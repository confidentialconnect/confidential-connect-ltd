import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PaymentMethods } from "@/components/PaymentMethods";
import { PaymentProcessing } from "@/components/PaymentProcessing";

const Payments = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>('remita-card');
  const [orderData, setOrderData] = useState<any>(null);
  const [showProcessing, setShowProcessing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // SEO optimization
    document.title = "Payment Gateway - Complete Your Order | Secure Payment Portal";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "Complete your payment securely with credit/debit cards via Remita, OPay, or PalmPay. Instant confirmation and SSL encryption for safe transactions.");
    }

    const savedOrderData = localStorage.getItem('orderData');
    if (savedOrderData) {
      setOrderData(JSON.parse(savedOrderData));
    } else {
      navigate('/checkout');
    }
  }, [navigate]);

  const handlePayment = () => {
    if (selectedMethod === 'remita-card') {
      // Show processing for card payments via Remita
      setShowProcessing(true);
    } else if (selectedMethod === 'remita-bank') {
      // Show bank transfer details with account information
      toast({
        title: "Bank Transfer Details",
        description: "Bank: First Bank of Nigeria | Account: 3191660932 | Name: Okpo Confidence. After payment, send receipt to WhatsApp: +2347040294858.",
        duration: 10000
      });
    } else {
      // For mobile payments (OPay, PalmPay), show transfer instructions
      toast({
        title: "Transfer Instructions",
        description: "Use the displayed account details to make payment, then send your receipt to WhatsApp: +2347040294858 for confirmation.",
        duration: 8000
      });
    }
  };

  const handlePaymentSuccess = () => {
    // Clear order data and navigate to success page
    localStorage.removeItem('orderData');
    navigate('/order-success');
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Error",
      description: error,
      variant: "destructive"
    });
    setShowProcessing(false);
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

  if (showProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
        <div className="max-w-md mx-auto pt-20">
          <PaymentProcessing
            orderData={orderData}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/checkout')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Checkout
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Complete Payment</h1>
            <p className="text-muted-foreground">Choose your preferred payment method</p>
          </div>
        </header>

        <main className="grid lg:grid-cols-3 gap-8">
          {/* Payment Methods Section */}
          <section className="lg:col-span-2">
            <PaymentMethods
              selectedMethod={selectedMethod}
              onMethodSelect={setSelectedMethod}
              orderAmount={orderData.total_amount}
            />
          </section>

          {/* Order Summary & Actions */}
          <aside className="space-y-6">
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Order Reference:</span>
                  <span className="font-mono text-xs">{orderData.payment_reference}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Customer:</span>
                  <span className="text-right">{orderData.customer_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Phone:</span>
                  <span>{orderData.customer_phone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Email:</span>
                  <span className="text-right text-xs">{orderData.customer_email}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <h3 className="font-semibold mb-2">Items:</h3>
                <div className="space-y-1 text-sm">
                  {orderData.order_items?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-left">{item.name} x{item.quantity}</span>
                      <span>₦{(item.price / 100 * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-primary">₦{(orderData.total_amount / 100).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Action Button */}
            <div className="bg-card rounded-lg border p-6">
              <Button
                onClick={handlePayment}
                className="w-full"
                size="lg"
                disabled={!selectedMethod}
              >
                {selectedMethod.includes('remita') ? 'Continue to Payment' : 'View Transfer Details'}
              </Button>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  🔒 Secure payment powered by 256-bit SSL encryption
                </p>
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-2">Security Features</h3>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>✓ PCI DSS Compliant</li>
                <li>✓ End-to-end encryption</li>
                <li>✓ Real-time fraud detection</li>
                <li>✓ Instant payment confirmation</li>
              </ul>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default Payments;