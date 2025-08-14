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
  opay: {
    label: "OPay",
    account: "7040294858",
    name: "OKPO CONFIDENCE OKO",
  },
  palmpay: {
    label: "PalmPay",
    account: "7040294858",
    name: "OKPO CONFIDENCE OKO",
  },
} as const;

type MethodKey = keyof typeof paymentMethods;

const Payments = () => {
  const { items, subtotal } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [method, setMethod] = useState<MethodKey>("opay");
  const [orderData, setOrderData] = useState<any>(null);
  const [isConfirming, setIsConfirming] = useState(false);

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
      // Update payment status to completed
      const { error } = await supabase.functions.invoke('verify-payment', {
        body: {
          paymentReference: orderData.paymentReference,
          paymentStatus: 'completed'
        }
      });

      if (error) throw error;

      const m = paymentMethods[method];
      const msg = [
        `Payment Confirmation - Order #${orderData.paymentReference}`,
        `Method: ${m.label}`,
        `Account: ${m.account}`,
        `Name: ${m.name}`,
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

      // Clear order data and navigate to success
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
                <div className="grid md:grid-cols-2 gap-4">
                  {/* OPay */}
                  <div className={`rounded-lg border p-4 ${method === "opay" ? "border-primary" : "border-border"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold">OPay</div>
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
                      <div className="font-semibold">PalmPay</div>
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
                  <Button 
                    className="w-full" 
                    onClick={handleConfirmTransfer}
                    disabled={isConfirming}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" /> 
                    {isConfirming ? "Confirming..." : "I have sent the money"}
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <a href="/checkout">Go to Checkout</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pay Online (Cards) - Coming Soon</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  We can enable secure in-app card payments (e.g., Remita/OPay/Paystack/Flutterwave). To proceed, please connect Supabase so we can safely store your payment gateway keys.
                </p>
                <ul className="list-disc ml-6">
                  <li>Multiple methods and automatic confirmation</li>
                  <li>Receipts and order tracking</li>
                  <li>Works with your existing checkout flow</li>
                </ul>
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
