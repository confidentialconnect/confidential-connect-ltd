import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const OrderSuccess = () => {
  useEffect(() => {
    document.title = "Order Sent | Confidential Connect";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Your order details have been sent. We'll contact you shortly.");
  }, []);

  return (
    <section className="pt-24 pb-16 bg-background min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="p-10">
            <h1 className="text-3xl font-bold mb-3">Thank You!</h1>
            <p className="text-muted-foreground mb-8">
              Your order message has been sent via your selected method. We'll reach out soon to complete your request.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button asChild>
                <Link to="/#products">Continue Shopping</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/">Go to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default OrderSuccess;
