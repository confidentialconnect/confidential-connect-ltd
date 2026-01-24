import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Package, Mail, Phone, Copy, Check, ShoppingBag, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OrderDetails {
  id: string;
  payment_reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  payment_status: string;
  created_at: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const paymentReference = searchParams.get("ref");

  useEffect(() => {
    document.title = "Order Confirmed | Confidential Connect Ltd";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Your order has been confirmed. Thank you for shopping with us!");
  }, []);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!paymentReference) {
        // Try to get order from localStorage
        const storedOrder = localStorage.getItem("lastOrder");
        if (storedOrder) {
          const parsedOrder = JSON.parse(storedOrder);
          setOrder({
            id: parsedOrder.id || "N/A",
            payment_reference: parsedOrder.paymentReference || "N/A",
            customer_name: parsedOrder.customer?.name || "Customer",
            customer_email: parsedOrder.customer?.email || "",
            customer_phone: parsedOrder.customer?.phone || "",
            total_amount: parsedOrder.totalAmount || 0,
            payment_status: "pending",
            created_at: new Date().toISOString(),
            items: parsedOrder.items || []
          });
        }
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("payment_reference", paymentReference)
          .single();

        if (error) throw error;
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
        toast({
          title: "Error",
          description: "Could not load order details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [paymentReference, toast]);

  const copyOrderRef = async () => {
    if (order?.payment_reference) {
      await navigator.clipboard.writeText(order.payment_reference);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Order reference copied to clipboard"
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <section className="pt-24 pb-16 bg-background min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-10 text-center">
              <div className="animate-pulse space-y-4">
                <div className="h-16 w-16 bg-muted rounded-full mx-auto" />
                <div className="h-6 bg-muted rounded w-3/4 mx-auto" />
                <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-24 pb-16 bg-background min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="max-w-2xl mx-auto">
          {/* Success Header */}
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
              Order Confirmed!
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Thank you for your order. We've received your request and will process it shortly.
            </p>
          </CardHeader>

          <CardContent className="space-y-6 px-6 pb-8">
            {order && (
              <>
                {/* Order Reference */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Order Reference</p>
                      <p className="font-mono font-bold text-lg">{order.payment_reference}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyOrderRef}
                      className="flex items-center gap-2"
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Order Summary */}
                <div>
                  <h3 className="font-semibold flex items-center gap-2 mb-3">
                    <Package className="h-5 w-5" />
                    Order Summary
                  </h3>
                  
                  {order.items && order.items.length > 0 ? (
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>
                            {item.name} × {item.quantity}
                          </span>
                          <span className="font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                      <Separator className="my-2" />
                    </div>
                  ) : null}
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(order.total_amount)}</span>
                  </div>
                </div>

                <Separator />

                {/* Customer Details */}
                <div>
                  <h3 className="font-semibold mb-3">Contact Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{order.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{order.customer_email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{order.customer_phone}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Status & Date */}
                <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Status: </span>
                    <Badge 
                      variant={order.payment_status === "completed" ? "default" : "secondary"}
                      className="ml-1"
                    >
                      {order.payment_status === "completed" ? "Paid" : "Awaiting Payment"}
                    </Badge>
                  </div>
                  <div className="text-muted-foreground">
                    {formatDate(order.created_at)}
                  </div>
                </div>

                {/* Confirmation Message */}
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm">
                  <p className="text-blue-800 dark:text-blue-200">
                    📧 <strong>Confirmation sent!</strong> A copy of this order has been saved to your account. 
                    You can view your order history in the <Link to="/orders" className="underline font-medium">Orders</Link> page.
                  </p>
                </div>
              </>
            )}

            {!order && (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">
                  Your order has been submitted successfully. We'll contact you shortly to confirm.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Button asChild className="w-full sm:w-auto">
                <Link to="/products" className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link to="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Go to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default OrderSuccess;
