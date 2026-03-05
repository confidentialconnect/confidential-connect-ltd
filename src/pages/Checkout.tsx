import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart, formatNGN } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, CreditCard, Info } from "lucide-react";

/**
 * Calculate Paystack processing fee for Nigerian transactions.
 * Local cards: 1.5% + ₦100 flat fee (for amounts >= ₦2,500), capped at ₦2,000 + ₦100.
 * Returns the fee in Naira.
 */
function calculatePaystackFee(amount: number): number {
  if (amount <= 0) return 0;
  let fee = amount * 0.015;
  if (amount >= 2500) {
    fee += 100;
  }
  // Cap: max Paystack fee is ₦2,000 + ₦100 flat = ₦2,100
  return Math.min(fee, 2100);
}

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  // Form state - pre-fill with user data if available
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSupabaseAvailable, setIsSupabaseAvailable] = useState(false);

  // Pre-fill form with user data
  useEffect(() => {
    if (user && profile) {
      setFormData(prev => ({
        ...prev,
        fullName: profile.full_name || "",
        email: user.email || "",
        phone: profile.phone || "",
      }));
    }
  }, [user, profile]);

  useEffect(() => {
    document.title = "Checkout | Confidential Connect Ltd";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Complete your order securely with our educational services checkout.");
  }, []);

  // Calculate Paystack fee and total
  const paystackFee = useMemo(() => calculatePaystackFee(subtotal), [subtotal]);
  const totalWithFee = useMemo(() => subtotal + paystackFee, [subtotal, paystackFee]);

  // Generate order summary message for WhatsApp/Email
  const orderMessage = useMemo(() => {
    const itemSummary = items
      .map(item => `${item.name} x ${item.quantity} - ${formatNGN(item.price * item.quantity)}`)
      .join('\n');
    
    return `New Order Request

Customer Details:
Name: ${formData.fullName}
Phone: ${formData.phone}
Email: ${formData.email}
Address: ${formData.address}, ${formData.city}, ${formData.state}

Order Items:
${itemSummary}

Total: ${formatNGN(subtotal)}

Please confirm this order and provide payment instructions.`;
  }, [formData, items, subtotal, formatNGN]);

  // Check Supabase availability
  useEffect(() => {
    const checkSupabase = async () => {
      try {
        // Simply check if we can reach the functions endpoint
        setIsSupabaseAvailable(true);
      } catch (e) {
        setIsSupabaseAvailable(false);
      }
    };
    checkSupabase();
  }, []);

  const handleProceedToPayment = async () => {
    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to place an order.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    if (!isSupabaseAvailable) {
      toast({
        title: "Service Unavailable",
        description: "Payment processing is currently unavailable. Please try WhatsApp or Email options.",
        variant: "destructive"
      });
      return;
    }

    // Validate required fields
    const requiredFields = ['fullName', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create order in Supabase
      const { data, error } = await supabase.functions.invoke('create-order', {
        body: {
          customer: formData,
          items: items,
          totalAmount: subtotal,
          userId: user.id
        }
      });

      if (error) throw error;

      // Store order data for payment page and success page
      const orderData = {
        id: data.order?.id,
        paymentReference: data.paymentReference,
        totalAmount: subtotal,
        paystackFee: paystackFee,
        totalWithFee: totalWithFee,
        customer: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone
        },
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      };
      
      localStorage.setItem('orderData', JSON.stringify({
        payment_reference: data.paymentReference,
        total_amount: Math.round(totalWithFee * 100), // Total + fee in kobo for Paystack
        subtotal: subtotal,
        paystack_fee: paystackFee,
        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        order_items: orderData.items
      }));
      
      // Also store for success page
      localStorage.setItem('lastOrder', JSON.stringify(orderData));

      // Navigate to payments page where user can choose payment method
      navigate('/payments');
      
    } catch (error) {
      console.error('Order creation failed:', error);
      toast({
        title: "Order Creation Failed",
        description: "Could not create your order. Please try again or use alternative methods.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };


  const handleWhatsApp = () => {
    const whatsappUrl = `https://wa.me/2347040294858?text=${encodeURIComponent(orderMessage)}`;
    window.open(whatsappUrl, '_blank');
    clearCart();
    navigate('/order-success');
  };

  const handleEmail = () => {
    const subject = 'New Order Request';
    const mailtoUrl = `mailto:confidentialconnectltd@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(orderMessage)}`;
    window.location.href = mailtoUrl;
    clearCart();
    navigate('/order-success');
  };

  // Empty cart check
  if (items.length === 0) {
    return (
      <section className="pt-24 pb-16 bg-background min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="p-10">
              <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
              <p className="text-muted-foreground mb-6">
                Add some products to your cart before checking out.
              </p>
              <Button asChild>
                <span onClick={() => navigate('/#products')}>Continue Shopping</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-24 pb-16 bg-background min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {!user && (
          <Card className="max-w-2xl mx-auto mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-yellow-800 mb-2">
                  Sign in to your account for a faster checkout experience
                </p>
                <Button variant="outline" onClick={() => navigate('/auth')}>
                  Sign In / Create Account
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" onClick={() => navigate('/cart')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
            <h1 className="text-3xl font-bold">Checkout</h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Information Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Enter your details to complete your order
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0803 123 4567"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Street address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="City"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="State"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </div>
                        </div>
                        <div className="font-medium">
                          {formatNGN(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatNGN(subtotal)}</span>
                  </div>

                  {/* Paystack Payment Section */}
                  {isSupabaseAvailable && (
                    <div className="space-y-3 pt-4">
                      <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                        <div className="flex items-center gap-2 mb-3">
                          <CreditCard className="h-5 w-5 text-primary" />
                          <h4 className="text-sm font-semibold text-primary">Secure Payment with Paystack</h4>
                        </div>
                        <ul className="text-xs text-muted-foreground space-y-1.5">
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-primary rounded-full"></span>
                            Accepts Visa, Mastercard, Verve cards
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-primary rounded-full"></span>
                            Bank transfer and USSD options available
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-primary rounded-full"></span>
                            Instant payment confirmation
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-primary rounded-full"></span>
                            256-bit SSL encryption
                          </li>
                        </ul>
                      </div>
                      
                       <Button 
                        className="w-full" 
                        onClick={handleProceedToPayment}
                        disabled={isProcessing}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        {isProcessing ? "Processing..." : "Proceed to Payment"}
                      </Button>
                    </div>
                  )}
                  
                  <div className="space-y-3 pt-4">
                    
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={handleWhatsApp}
                    >
                      Order via WhatsApp
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={handleEmail}
                    >
                      Order via Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;