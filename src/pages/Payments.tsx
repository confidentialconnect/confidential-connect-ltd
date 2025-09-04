import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Phone, Copy, CheckCircle2, CreditCard, Wallet, Clock } from "lucide-react";
import { useCart, formatNGN } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const WHATSAPP_NUMBER_E164 = "2347040294858";

const paymentMethods = {
  remita: {
    label: "Remita (Cards/Online)",
    description: "Pay with Debit/Credit Cards, Bank Transfer",
    icon: "CreditCard",
  },
  opay: {
    label: "OPay",
    account: "7040294858",
    name: "OKPO CONFIDENCE OKO",
    description: "Mobile money transfer",
    icon: "Wallet",
  },
  palmpay: {
    label: "PalmPay", 
    account: "7040294858",
    name: "OKPO CONFIDENCE OKO",
    description: "Mobile money transfer",
    icon: "Wallet",
  },
} as const;

type MethodKey = keyof typeof paymentMethods;

const Payments = () => {
  const { items, subtotal } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [method, setMethod] = useState<MethodKey>("remita");
  const [orderData, setOrderData] = useState<any>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    document.title = "Payments | Confidential Connect";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Complete your payment using OPay, PalmPay or online card payment. Secure and instant confirmation.");

    // Load order data from localStorage
    const savedOrder = localStorage.getItem('currentOrder');
    if (savedOrder) {
      setOrderData(JSON.parse(savedOrder));
    }
  }, []);

  const summary = useMemo(() => {
    const currentItems = orderData?.items || items;
    if (!currentItems.length) return "No items in order";
    return currentItems
      .map((i: any) => `- ${i.name} x ${i.quantity} @ ${formatNGN(i.price)} = ${formatNGN(i.price * i.quantity)}`)
      .join("\n");
  }, [items, orderData]);

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied", description: `${label} copied to clipboard.` });
    } catch {
      toast({ title: "Copy failed", description: "Please copy manually.", variant: "destructive" });
    }
  };

  const handleRemitaPayment = async () => {
    if (!orderData?.paymentReference) {
      toast({
        title: "Error",
        description: "No order found. Please create a new order from checkout.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Initialize Remita payment
      const { data, error } = await supabase.functions.invoke('create-remita-payment', {
        body: {
          paymentReference: orderData.paymentReference,
          amount: orderData.total,
          customerName: orderData.customerInfo?.fullName || "Customer",
          customerEmail: orderData.customerInfo?.email || "customer@example.com",
          customerPhone: orderData.customerInfo?.phone || "",
          description: `Payment for Order #${orderData.paymentReference}`
        }
      });

      if (error) throw error;

      // Redirect to Remita payment page
      if (data?.paymentUrl) {
        window.open(data.paymentUrl, '_blank');
        
        toast({
          title: "Payment Initiated",
          description: "Complete your payment in the new tab. Return here once done.",
        });

        // Start checking payment status
        setTimeout(() => checkPaymentStatus(), 5000);
      }
    } catch (error) {
      console.error('Remita payment failed:', error);
      toast({
        title: "Payment Failed",
        description: "Unable to initialize payment. Please try again or use bank transfer.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!orderData?.paymentReference) return;

    try {
      const { data } = await supabase.functions.invoke('verify-remita-payment', {
        body: { paymentReference: orderData.paymentReference }
      });

      if (data?.status === 'completed') {
        localStorage.removeItem('currentOrder');
        navigate("/order-success");
        toast({
          title: "Payment Successful",
          description: "Your payment has been confirmed!",
        });
      } else if (data?.status === 'failed') {
        toast({
          title: "Payment Failed",
          description: "Payment was not successful. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
    }
  };
  const handleConfirmTransfer = async () => {
    if (!orderData?.paymentReference) {
      toast({
        title: "Error", 
        description: "No order found. Please create a new order.",
        variant: "destructive"
      });
      return;
    }

    setIsConfirming(true);

    try {
      const { error } = await supabase.functions.invoke('verify-payment', {
        body: {
          paymentReference: orderData.paymentReference,
          paymentStatus: 'completed'
        }
      });

      if (error) throw error;

      const m = paymentMethods[method as keyof typeof paymentMethods];
      const msg = [
        `Payment Confirmation - Order #${orderData.paymentReference}`,
        `Method: ${m.label}`,
        `Account: ${(m as any).account}`,
        `Name: ${(m as any).name}`,
        `Amount: ${formatNGN(orderData?.total || subtotal)}`,
        "",
        "Items:",
        summary,
        "",
        "I have sent the money. Kindly confirm. Thank you.",
      ]
        .filter(Boolean)
        .join("\n");

      const url = `https://wa.me/${WHATSAPP_NUMBER_E164}?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank");

      localStorage.removeItem('currentOrder');
      navigate("/order-success");
    } catch (error) {
      console.error('Payment confirmation failed:', error);
      toast({
        title: "Confirmation Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <section className="pt-24 pb-16 bg-background min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Payments</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Select a Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  {/* Card Payment - Featured */}
                  <div className={`rounded-lg border-2 border-primary bg-gradient-to-r from-primary/10 to-primary/5 p-6 ${method === "remita" ? "ring-2 ring-primary" : ""}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-full">
                          <CreditCard className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-bold text-lg">Pay with Card</div>
                          <div className="text-sm text-muted-foreground">Instant & Secure Payment</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">RECOMMENDED</span>
                        <input
                          type="radio"
                          name="method"
                          checked={method === "remita"}
                          onChange={() => setMethod("remita")}
                          aria-label="Select Card Payment"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="bg-white rounded p-2 text-center border">
                        <div className="text-xs font-medium text-blue-600">VISA</div>
                      </div>
                      <div className="bg-white rounded p-2 text-center border">
                        <div className="text-xs font-medium text-red-600">MASTERCARD</div>
                      </div>
                      <div className="bg-white rounded p-2 text-center border">
                        <div className="text-xs font-medium text-green-600">VERVE</div>
                      </div>
                      <div className="bg-white rounded p-2 text-center border">
                        <div className="text-xs font-medium text-purple-600">BANK TRANSFER</div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-4">
                      ✓ 256-bit SSL encryption  ✓ Instant confirmation  ✓ All Nigerian banks supported
                    </div>
                    
                    {method === "remita" && (
                      <Button 
                        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70" 
                        onClick={handleRemitaPayment}
                        disabled={isProcessingPayment}
                        size="lg"
                      >
                        <CreditCard className="h-5 w-5 mr-2" />
                        {isProcessingPayment ? "Processing..." : "Pay Now with Card"}
                      </Button>
                    )}
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    OR
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                  {/* OPay */}
                  <div className={`rounded-lg border p-4 ${method === "opay" ? "border-primary" : "border-border"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Wallet className="h-5 w-5" />
                        <div className="font-semibold">OPay</div>
                      </div>
                      <input
                        type="radio"
                        name="method"
                        checked={method === "opay"}
                        onChange={() => setMethod("opay")}
                        aria-label="Select OPay"
                      />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Account/Phone</span>
                        <span className="font-medium">{paymentMethods.opay.account}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Account Name</span>
                        <span className="font-medium">{paymentMethods.opay.name}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => handleCopy(paymentMethods.opay.account, "OPay number")}>
                        <Copy className="h-4 w-4 mr-2" /> Copy Number
                      </Button>
                    </div>
                  </div>

                  {/* PalmPay */}
                  <div className={`rounded-lg border p-4 ${method === "palmpay" ? "border-primary" : "border-border"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Wallet className="h-5 w-5" />
                        <div className="font-semibold">PalmPay</div>
                      </div>
                      <input
                        type="radio"
                        name="method"
                        checked={method === "palmpay"}
                        onChange={() => setMethod("palmpay")}
                        aria-label="Select PalmPay"
                      />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Account/Phone</span>
                        <span className="font-medium">{paymentMethods.palmpay.account}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Account Name</span>
                        <span className="font-medium">{paymentMethods.palmpay.name}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => handleCopy(paymentMethods.palmpay.account, "PalmPay number")}>
                        <Copy className="h-4 w-4 mr-2" /> Copy Number
                      </Button>
                    </div>
                  </div>
                  </div>
                </div>

                {orderData && (
                  <div className="rounded-lg border p-4 bg-primary/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-medium text-primary">Order #{orderData.paymentReference}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Order created for {orderData.customerInfo?.fullName}
                    </div>
                  </div>
                )}

                <div className="rounded-lg border p-4 bg-muted/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Amount to Pay</div>
                      <div className="text-muted-foreground text-sm">
                        {orderData ? "Order total" : "Based on your current cart subtotal"}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {formatNGN(orderData?.total || subtotal)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {method === "remita" ? (
                    <Button 
                      className="w-full" 
                      onClick={handleRemitaPayment}
                      disabled={isProcessingPayment}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      {isProcessingPayment ? "Processing Payment..." : "Pay with Remita"}
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={handleConfirmTransfer}
                      disabled={isConfirming}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" /> 
                      {isConfirming ? "Confirming..." : "I have sent the money"}
                    </Button>
                  )}
                  <Button asChild variant="outline" className="w-full">
                    <a href="/checkout">Go to Checkout</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {method === "remita" ? (
                  <div className="space-y-2">
                    <p className="text-green-600 font-medium">✓ Secure online payment with cards</p>
                    <p>• Accepts Visa, Mastercard, Verve cards</p>
                    <p>• Bank transfer and USSD options available</p>
                    <p>• Instant payment confirmation</p>
                    <p>• 256-bit SSL encryption</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="font-medium">Manual Transfer Instructions:</p>
                    <p>1. Transfer to the account details above</p>
                    <p>2. Click "I have sent the money" button</p>
                    <p>3. We'll verify and confirm your payment</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {(() => {
                    const currentItems = orderData?.items || items;
                    return currentItems.length === 0 ? (
                      <div className="text-sm text-muted-foreground">No items in order.</div>
                    ) : (
                      currentItems.map((i: any) => (
                        <div key={i.id} className="flex justify-between text-sm">
                          <span>
                            {i.name} × {i.quantity}
                          </span>
                          <span className="font-medium">{formatNGN(i.price * i.quantity)}</span>
                        </div>
                      ))
                    );
                  })()}
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">{formatNGN(orderData?.total || subtotal)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payments;
