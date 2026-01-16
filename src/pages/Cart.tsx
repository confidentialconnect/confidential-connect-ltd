import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart, formatNGN } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";

const Cart = () => {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  useEffect(() => {
    document.title = "Cart | Confidential Connect Ltd";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "View and manage items in your cart before secure checkout.");
  }, []);

  const isEmpty = items.length === 0;

  return (
    <section className="pt-24 pb-16 bg-background min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        {isEmpty ? (
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
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{formatNGN(item.price)} each</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        <Minus />
                      </Button>
                      <div className="w-10 text-center font-medium">{item.quantity}</div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        <Plus />
                      </Button>
                      <div className="w-24 text-right font-semibold">
                        {formatNGN(item.price * item.quantity)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatNGN(subtotal)}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Shipping and taxes calculated at checkout.</div>
                  <div className="flex gap-3">
                    <Button asChild variant="outline" className="flex-1">
                      <Link to="/#products">Continue Shopping</Link>
                    </Button>
                    <Button asChild className="flex-1">
                      <Link to="/checkout">Checkout</Link>
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

export default Cart;
