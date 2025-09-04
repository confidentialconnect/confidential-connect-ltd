import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Calendar, 
  CreditCard, 
  Download, 
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Truck
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Orders = () => {
  const { user } = useAuth();
  
  // Mock orders data - in real app, this would come from API
  const [orders] = useState([
    {
      id: "ORD-2024-001",
      date: "2024-01-15",
      status: "completed",
      total: 250000,
      paymentMethod: "Card",
      items: [
        {
          name: "Complete Cybersecurity Audit",
          price: 250000,
          quantity: 1
        }
      ],
      deliveryDate: "2024-01-22",
      trackingNumber: "TRK-001-2024"
    },
    {
      id: "ORD-2024-002",
      date: "2024-01-10",
      status: "processing",
      total: 500000,
      paymentMethod: "Bank Transfer",
      items: [
        {
          name: "Custom Software Development",
          price: 500000,
          quantity: 1
        }
      ],
      estimatedDelivery: "2024-02-10"
    },
    {
      id: "ORD-2024-003",
      date: "2024-01-05",
      status: "shipped",
      total: 75000,
      paymentMethod: "Card",
      items: [
        {
          name: "Network Setup Consultation",
          price: 75000,
          quantity: 1
        }
      ],
      deliveryDate: "2024-01-12",
      trackingNumber: "TRK-003-2024"
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "processing":
        return <Clock className="h-4 w-4 text-warning" />;
      case "shipped":
        return <Truck className="h-4 w-4 text-info" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Package className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "processing":
        return "secondary";
      case "shipped":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const filterOrdersByStatus = (status: string) => {
    if (status === "all") return orders;
    return orders.filter(order => order.status === status);
  };

  const OrderCard = ({ order }: { order: any }) => (
    <Card key={order.id} className="hover-lift">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{order.id}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Calendar className="h-4 w-4" />
              {new Date(order.date).toLocaleDateString()}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold">₦{order.total.toLocaleString()}</p>
            <Badge variant={getStatusVariant(order.status)} className="mt-1">
              {getStatusIcon(order.status)}
              <span className="ml-1 capitalize">{order.status}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Order Items */}
          <div>
            <h4 className="font-medium mb-2">Items:</h4>
            {order.items.map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-center py-2">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <span className="font-medium">₦{item.price.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <Separator />

          {/* Order Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Payment Method:</span>
              <div className="flex items-center gap-1 mt-1">
                <CreditCard className="h-3 w-3" />
                {order.paymentMethod}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">
                {order.status === "completed" ? "Delivered:" : "Estimated Delivery:"}
              </span>
              <p className="mt-1">
                {order.deliveryDate 
                  ? new Date(order.deliveryDate).toLocaleDateString()
                  : new Date(order.estimatedDelivery).toLocaleDateString()
                }
              </p>
            </div>
          </div>

          {order.trackingNumber && (
            <div className="text-sm">
              <span className="text-muted-foreground">Tracking Number:</span>
              <p className="font-mono mt-1">{order.trackingNumber}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Eye className="h-3 w-3" />
              View Details
            </Button>
            {order.status === "completed" && (
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-3 w-3" />
                Download Receipt
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh] pt-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Please sign in</h2>
            <p className="text-muted-foreground mb-4">
              You need to be signed in to view your orders
            </p>
            <Button asChild>
              <a href="/auth">Sign In</a>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Orders</h1>
            <p className="text-muted-foreground">
              Track and manage your service orders
            </p>
          </div>

          {/* Order Tabs */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">
                All Orders ({orders.length})
              </TabsTrigger>
              <TabsTrigger value="processing">
                Processing ({filterOrdersByStatus("processing").length})
              </TabsTrigger>
              <TabsTrigger value="shipped">
                Shipped ({filterOrdersByStatus("shipped").length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({filterOrdersByStatus("completed").length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled ({filterOrdersByStatus("cancelled").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-16">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
                    <p className="text-muted-foreground mb-6">
                      When you place orders, they'll appear here
                    </p>
                    <Button asChild>
                      <a href="/categories">Browse Services</a>
                    </Button>
                  </div>
                ) : (
                  orders.map((order) => <OrderCard key={order.id} order={order} />)
                )}
              </div>
            </TabsContent>

            {["processing", "shipped", "completed", "cancelled"].map((status) => (
              <TabsContent key={status} value={status}>
                <div className="space-y-4">
                  {filterOrdersByStatus(status).length === 0 ? (
                    <div className="text-center py-16">
                      <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h2 className="text-xl font-semibold mb-2">
                        No {status} orders
                      </h2>
                      <p className="text-muted-foreground">
                        You don't have any {status} orders at the moment
                      </p>
                    </div>
                  ) : (
                    filterOrdersByStatus(status).map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Orders;