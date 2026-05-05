import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PaymentMethods } from "@/components/PaymentMethods";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";

const Payments = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>('paystack');
  const [orderData, setOrderData] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // SEO optimization
    document.title = "Payment Gateway - Complete Your Order | Secure Payment Portal";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "Complete your payment securely with Paystack, OPay, or PalmPay. Instant confirmation and SSL encryption for safe transactions.");
    }

    const savedOrderData = localStorage.getItem('orderData');
    if (savedOrderData) {
      setOrderData(JSON.parse(savedOrderData));
    } else {
      navigate('/checkout');
    }
  }, [navigate]);

  const handlePaystackPayment = () => {
    const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_live_258b0e0fcab902ea3361ef5affa8110b925badc1';
    const handler = (window as any).PaystackPop.setup({
      key: paystackKey,
      email: orderData.customer_email,
      amount: orderData.total_amount, // already in kobo
      currency: 'NGN',
      ref: orderData.payment_reference,
      channels: ['card', 'bank', 'ussd'],
      metadata: {
        custom_fields: [
          { display_name: "Customer Name", variable_name: "customer_name", value: orderData.customer_name },
          { display_name: "Phone", variable_name: "phone", value: orderData.customer_phone },
        ]
      },
      callback: function (response: any) {
        toast({ title: "Verifying payment...", description: "Please wait while we confirm your payment." });
        supabase.functions.invoke('verify-paystack', {
          body: { reference: response.reference }
        }).then(({ data, error }) => {
          if (error) {
            handlePaymentError(error.message || 'Payment verification failed');
            return;
          }
          if (data?.success) {
            handlePaymentSuccess();
          } else {
            handlePaymentError(data?.message || 'Payment verification failed');
          }
        }).catch((err: any) => {
          handlePaymentError(err.message || 'Payment verification failed');
        });
      },
      onClose: () => {
        toast({ title: "Payment Cancelled", description: "You closed the payment window.", variant: "destructive" });
      },
    });
    handler.openIframe();
  };

  const handlePayment = () => {
    if (selectedMethod === 'paystack') {
      handlePaystackPayment();
    } else {
      toast({
        title: "Transfer Instructions",
        description: "Use the displayed account details to make payment, then send your receipt to WhatsApp: +2347040294858 for confirmation.",
        duration: 8000
      });
    }
  };

  const handlePaymentSuccess = () => {
    // Clear order data and navigate to success page with reference
    const ref = orderData?.payment_reference;
    localStorage.removeItem('orderData');
    navigate(`/order-success${ref ? `?ref=${ref}` : ''}`);
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Error",
      description: error,
      variant: "destructive"
    });
  };

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <p className="text-muted-foreground">Preparing your payment...</p>
        </div>
      </div>
    );
  }




  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background p-4">
      <div className="max-w-5xl mx-auto pt-8">
        {/* Enhanced Header */}
        <header className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/checkout')}
            className="flex items-center gap-2 mb-4 hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Checkout
          </Button>
          
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Complete Your Payment
            </h1>
            <p className="text-muted-foreground text-lg">
              Choose your preferred payment method below
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                ✓ Secure Payment
              </div>
              <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                ✓ Instant Confirmation
              </div>
            </div>
          </div>
        </header>

        <main className="grid lg:grid-cols-3 gap-6">
          {/* Payment Methods Section */}
          <section className="lg:col-span-2">
            <PaymentMethods
              selectedMethod={selectedMethod}
              onMethodSelect={setSelectedMethod}
              orderAmount={orderData.total_amount}
            />
          </section>

          {/* Enhanced Order Summary & Actions */}
          <aside className="space-y-6">
            {/* Order Summary Card */}
            <div className="bg-gradient-to-br from-card to-card/80 rounded-xl border-2 border-primary/20 shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold">Order Summary</h2>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">Order Reference</div>
                  <div className="font-mono text-sm font-semibold">{orderData.payment_reference}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Customer</div>
                    <div className="text-sm font-medium truncate">{orderData.customer_name}</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Phone</div>
                    <div className="text-sm font-medium">{orderData.customer_phone}</div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">Email</div>
                  <div className="text-sm font-medium truncate">{orderData.customer_email}</div>
                </div>
              </div>

              <div className="border-t border-dashed pt-4 mb-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Order Items
                </h3>
                <div className="space-y-2">
                  {orderData.order_items?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center text-sm bg-background/50 p-2 rounded">
                      <span className="flex-1">{item.name}</span>
                      <span className="text-muted-foreground mx-2">×{item.quantity}</span>
                      <span className="font-semibold">₦{(item.price / 100 * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t-2 border-primary/20 pt-4 bg-gradient-to-r from-primary/10 to-primary/5 -mx-6 -mb-6 px-6 pb-6 mt-4 rounded-b-xl">
                {orderData.subtotal && orderData.paystack_fee && (
                  <div className="space-y-1 mb-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₦{orderData.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Processing Fee</span>
                      <span>₦{orderData.paystack_fee.toLocaleString()}</span>
                    </div>
                    <Separator className="my-1" />
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total Amount:</span>
                  <span className="text-2xl font-bold text-primary">₦{(orderData.total_amount / 100).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Action Button */}
            <div className="bg-card rounded-xl border shadow-md p-6">
              <Button
                onClick={handlePayment}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all"
                size="lg"
                disabled={!selectedMethod}
              >
                {selectedMethod === 'paystack' && '💳 Pay with Paystack'}
                {selectedMethod === 'moniepoint' && '🏦 Transfer to Moniepoint'}
                {!selectedMethod && 'Select Payment Method'}
              </Button>
              
              <div className="mt-4 text-center space-y-2">
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Secured with 256-bit SSL encryption
                </p>
              </div>
            </div>

            {/* Security & Trust Badges */}
            <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-5 border">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Why Choose Us?
              </h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Instant payment confirmation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Real-time fraud detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>24/7 customer support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>PCI DSS Level 1 compliant</span>
                </li>
              </ul>
              
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-center text-muted-foreground">
                  Need help? Contact us on WhatsApp
                </p>
                <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                  <a href="https://wa.me/2347040294858" target="_blank" rel="noopener noreferrer">
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Chat on WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default Payments;