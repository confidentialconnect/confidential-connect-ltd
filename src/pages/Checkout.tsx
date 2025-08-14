import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart, formatNGN } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const WHATSAPP_NUMBER_E164 = "2347040294858"; // Primary WhatsApp in E.164 without '+' for wa.me
const ORDER_EMAIL = "princejuniorokpo@gmail.com";

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
    notes: "",
  });

  const isCartEmpty = items.length === 0;

  useEffect(() => {
    document.title = "Checkout | Confidential Connect";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Enter your contact and delivery information to place your order.");
  }, []);

  const summary = useMemo(() => {
    return items
      .map(
        (i) => `- ${i.name} x ${i.quantity} @ ${formatNGN(i.price)} = ${formatNGN(i.price * i.quantity)}`
      )
      .join("\n");
  }, [items]);

  const orderMessage = useMemo(() => {
    return [`New Order from ${form.fullName || "(Name not provided)"}`,
      `Contact: ${form.phone || "N/A"}${form.email ? `, ${form.email}` : ""}`,
      `Address: ${[form.address, form.city, form.state, form.country].filter(Boolean).join(", ") || "N/A"}`,
      form.notes ? `Notes: ${form.notes}` : undefined,
      "",
      "Items:",
      summary,
      "",
      `Subtotal: ${formatNGN(subtotal)}`,
    ]
      .filter(Boolean)
      .join("\n");
  }, [form, summary, subtotal]);

  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [supabaseAvailable, setSupabaseAvailable] = useState(true);

  useEffect(() => {
    // Check if Supabase is properly configured
    const checkSupabase = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('create-order', {
          body: { test: true }
        });
        if (error && error.message === 'Supabase not configured') {
          setSupabaseAvailable(false);
        }
      } catch (e) {
        setSupabaseAvailable(false);
      }
    };
    checkSupabase();
  }, []);

  const handleProceedToPayment = async () => {
    if (isCartEmpty) return;
    
    if (!supabaseAvailable) {
      toast({
        title: "Service Unavailable",
        description: "Online payments are being set up. Please use WhatsApp or Email options below.",
        variant: "destructive"
      });
      return;
    }
    
    if (!form.fullName || !form.phone) {
      toast({
        title: "Missing Information",
        description: "Please provide your name and phone number.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-order', {
        body: {
          customerName: form.fullName,
          customerEmail: form.email,
          customerPhone: form.phone,
          customerAddress: [form.address, form.city, form.state, form.country].filter(Boolean).join(", "),
          items: items,
          totalAmount: subtotal,
          paymentMethod: 'bank_transfer'
        }
      });

      if (error) throw error;

      // Store order details in localStorage for payment page
      localStorage.setItem('currentOrder', JSON.stringify({
        orderId: data.order.id,
        paymentReference: data.paymentReference,
        customerInfo: form,
        items: items,
        total: subtotal
      }));

      clearCart();
      navigate("/payments");
    } catch (error) {
      console.error('Order creation failed:', error);
      toast({
        title: "Order Failed",
        description: "Failed to create order. Please try again or use WhatsApp/Email options.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWhatsApp = () => {
    if (isCartEmpty) return;
    const url = `https://wa.me/${WHATSAPP_NUMBER_E164}?text=${encodeURIComponent(orderMessage)}`;
    window.open(url, "_blank");
    clearCart();
    navigate("/order-success");
  };

  const handleEmail = () => {
    if (isCartEmpty) return;
    const subject = encodeURIComponent(`New Order from ${form.fullName || "Customer"}`);
    const body = encodeURIComponent(orderMessage);
    window.location.href = `mailto:${ORDER_EMAIL}?subject=${subject}&body=${body}`;
    clearCart();
    navigate("/order-success");
  };

  return (
    <section className="pt-24 pb-16 bg-background min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        {isCartEmpty ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-6">Your cart is empty.</p>
              <Button asChild>
                <Link to="/#products">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2">Full Name</label>
                    <Input
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2">Phone</label>
                      <Input
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="e.g., 0803 123 4567"
                        type="tel"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Email</label>
                      <Input
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                        type="email"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Address</label>
                    <Input
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="Street address"
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm mb-2">City</label>
                      <Input
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">State</label>
                      <Input
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Country</label>
                      <Input
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                        placeholder="Country"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Notes</label>
                    <Textarea
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Any special instructions (optional)"
                      className="min-h-[100px]"
                    />
                  </div>
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
                    {items.map((i) => (
                      <div key={i.id} className="flex justify-between text-sm">
                        <span>
                          {i.name} × {i.quantity}
                        </span>
                        <span className="font-medium">{formatNGN(i.price * i.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">Subtotal</span>
                    <span className="font-semibold">{formatNGN(subtotal)}</span>
                  </div>
                  <div className="space-y-3">
                    {supabaseAvailable ? (
                      <>
                        <Button 
                          className="w-full" 
                          onClick={handleProceedToPayment}
                          disabled={isProcessing}
                        >
                          {isProcessing ? "Processing..." : "Proceed to Payment"}
                        </Button>
                        <div className="text-xs text-muted-foreground text-center">
                          You'll be redirected to our secure payment page
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground text-center p-3 bg-muted rounded-lg">
                        Online payments are being configured. Please use the options below.
                      </div>
                    )}
                    <Button variant="outline" className="w-full" onClick={handleWhatsApp}>
                      Place Order via WhatsApp
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleEmail}>
                      Send Order via Email
                    </Button>
                    <Button asChild variant="ghost" className="w-full">
                      <Link to="/cart">Back to Cart</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Checkout;
