import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    Eye,
    CheckCircle,
    Clock,
    XCircle,
    RefreshCw
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Order {
    id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    total_amount: number;
    payment_status: string | null;
    payment_reference: string | null;
    created_at: string | null;
    updated_at: string | null;
}

const Orders = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast({
                title: "Error",
                description: "Could not load your orders",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "My Orders | Confidential Connect Ltd";
        fetchOrders();
    }, [user]);

    const getStatusIcon = (status: string | null) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case "pending":
                return <Clock className="h-4 w-4 text-yellow-600" />;
            case "failed":
                return <XCircle className="h-4 w-4 text-destructive" />;
            default:
                return <Package className="h-4 w-4 text-muted-foreground" />;
        }
    };

    const getStatusVariant = (status: string | null): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case "completed": return "default";
            case "pending": return "secondary";
            case "failed": return "destructive";
            default: return "outline";
        }
    };

    const getStatusLabel = (status: string | null) => {
        switch (status) {
            case "completed": return "Paid";
            case "pending": return "Awaiting Payment";
            case "failed": return "Failed";
            default: return status || "Unknown";
        }
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-NG", {
            year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
        });
    };

    const filterByStatus = (status: string) => {
        if (status === "all") return orders;
        return orders.filter(o => o.payment_status === status);
    };

    const OrderCard = ({ order }: { order: Order }) => (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                        <CardTitle className="text-base font-mono">
                            {order.payment_reference || order.id.slice(0, 8)}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(order.created_at)}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-bold">{formatCurrency(order.total_amount)}</p>
                        <Badge variant={getStatusVariant(order.payment_status)} className="mt-1 gap-1">
                            {getStatusIcon(order.payment_status)}
                            {getStatusLabel(order.payment_status)}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <Separator className="mb-3" />
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <span className="text-muted-foreground">Customer</span>
                        <p className="font-medium">{order.customer_name}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Email</span>
                        <p className="font-medium truncate">{order.customer_email}</p>
                    </div>
                </div>
                <div className="flex gap-2 pt-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/order-success?ref=${order.payment_reference}`)}
                        className="gap-1"
                    >
                        <Eye className="h-3 w-3" />
                        View Receipt
                    </Button>
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
                        <p className="text-muted-foreground mb-4">You need to be signed in to view your orders</p>
                        <Button onClick={() => navigate("/auth")}>Sign In</Button>
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
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-1">My Orders</h1>
                            <p className="text-muted-foreground">Track your orders and payment status</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={fetchOrders} className="gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Refresh
                        </Button>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <Card key={i}>
                                    <CardContent className="p-6">
                                        <div className="animate-pulse space-y-3">
                                            <div className="h-5 bg-muted rounded w-1/3" />
                                            <div className="h-4 bg-muted rounded w-1/2" />
                                            <div className="h-4 bg-muted rounded w-1/4" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Tabs defaultValue="all" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
                                <TabsTrigger value="pending">Pending ({filterByStatus("pending").length})</TabsTrigger>
                                <TabsTrigger value="completed">Paid ({filterByStatus("completed").length})</TabsTrigger>
                                <TabsTrigger value="failed">Failed ({filterByStatus("failed").length})</TabsTrigger>
                            </TabsList>

                            {["all", "pending", "completed", "failed"].map(status => (
                                <TabsContent key={status} value={status}>
                                    <div className="space-y-4">
                                        {filterByStatus(status).length === 0 ? (
                                            <div className="text-center py-16">
                                                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                                <h2 className="text-xl font-semibold mb-2">
                                                    {status === "all" ? "No orders yet" : `No ${status} orders`}
                                                </h2>
                                                <p className="text-muted-foreground mb-6">
                                                    {status === "all"
                                                        ? "When you place orders, they'll appear here"
                                                        : `You don't have any ${status} orders`}
                                                </p>
                                                {status === "all" && (
                                                    <Button onClick={() => navigate("/products")}>Browse Products</Button>
                                                )}
                                            </div>
                                        ) : (
                                            filterByStatus(status).map(order => (
                                                <OrderCard key={order.id} order={order} />
                                            ))
                                        )}
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Orders;
