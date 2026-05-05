import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatNGN } from "@/contexts/CartContext";
import { LiveCharts } from "@/components/LiveCharts";
import { SupportChat } from "@/components/SupportChat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Users, FileText, Package, Bell,
    Clock, CheckCircle, AlertCircle, Loader2, Wallet, ThumbsUp
} from "lucide-react";

interface Order {
    id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    payment_reference: string | null;
    total_amount: number;
    payment_status: string | null;
    created_at: string | null;
    user_id: string;
}

interface ServiceRequest {
    id: string;
    user_id: string;
    service_type: string;
    client_name: string;
    client_email: string;
    client_phone: string;
    description: string | null;
    status: string;
    admin_notes: string | null;
    created_at: string;
}

interface ProfileData {
    id: string;
    email: string | null;
    full_name: string | null;
    created_at: string | null;
}

interface PromotionPaymentRow {
    id: string;
    user_id: string;
    amount: number;
    status: string;
    created_at: string;
}

const SERVICE_LABELS: Record<string, string> = {
    birth_certificate: 'Birth Certificate',
    state_of_origin: 'State of Origin Certificate',
    waec_certificate: 'WAEC Certificate',
    waec_scratch_card: 'WAEC Scratch Card',
    neco_token: 'NECO Token',
    nabteb_scratch_card: 'NABTEB Scratch Card',
    nabteb_token: 'NABTEB Token',
    result_checker: 'Result Checker',
    gce_result_checker: 'G.C.E. Result Checker',
    post_utme: 'Post UTME Registration',
    hostel_booking: 'Hostel Booking',
    cv_preparation: 'Professional CV Preparation',
    document_processing: 'Document Processing',
    other: 'Other Service',
};

const AdminHome = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
    const [users, setUsers] = useState<ProfileData[]>([]);
    const [promotions, setPromotions] = useState<PromotionPaymentRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
    const { toast } = useToast();

    useEffect(() => {
        document.title = "Admin Dashboard | Confidential Connect Ltd";
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const [ordersRes, requestsRes, usersRes, promosRes] = await Promise.all([
                supabase.from('orders').select('*').order('created_at', { ascending: false }),
                supabase.from('service_requests').select('*').order('created_at', { ascending: false }),
                supabase.from('profiles').select('id, email, full_name, created_at').order('created_at', { ascending: false }),
                supabase.from('promotion_payments').select('id, user_id, amount, status, created_at').order('created_at', { ascending: false }),
            ]);

            if (ordersRes.data) setOrders(ordersRes.data);
            if (requestsRes.data) setServiceRequests(requestsRes.data);
            if (usersRes.data) setUsers(usersRes.data);
            if (promosRes.data) setPromotions(promosRes.data as PromotionPaymentRow[]);
        } catch (error) {
            console.error('Admin fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ payment_status: newStatus })
                .eq('id', orderId);
            if (error) throw error;
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, payment_status: newStatus } : o));
            toast({ title: "Success", description: `Order status updated to ${newStatus}` });
        } catch (error) {
            toast({ title: "Error", description: "Failed to update order", variant: "destructive" });
        }
    };

    const updateRequestStatus = async (reqId: string, newStatus: string) => {
        try {
            const req = serviceRequests.find(r => r.id === reqId);
            const notes = adminNotes[reqId] || null;

            const { error } = await supabase
                .from('service_requests')
                .update({ status: newStatus, admin_notes: notes })
                .eq('id', reqId);
            if (error) throw error;

            // Send notification to the user
            if (req) {
                await supabase.from('notifications').insert({
                    user_id: req.user_id,
                    title: `Request ${newStatus === 'completed' ? 'Completed' : newStatus === 'in_progress' ? 'In Progress' : 'Updated'}`,
                    message: `Your "${SERVICE_LABELS[req.service_type] || req.service_type}" request has been updated to: ${newStatus}.${notes ? ` Note: ${notes}` : ''}`,
                    type: newStatus === 'completed' ? 'success' : 'info',
                    link: '/dashboard',
                });
            }

            setServiceRequests(prev => prev.map(r =>
                r.id === reqId ? { ...r, status: newStatus, admin_notes: notes } : r
            ));
            toast({ title: "Success", description: `Service request updated to ${newStatus}` });
        } catch (error) {
            toast({ title: "Error", description: "Failed to update request", variant: "destructive" });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-500/10 text-green-600';
            case 'pending': return 'bg-yellow-500/10 text-yellow-600';
            case 'in_progress': return 'bg-blue-500/10 text-blue-600';
            case 'failed':
            case 'rejected': return 'bg-red-500/10 text-red-600';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    // Combined request stats (service requests + promotion submissions)
    const allRequests = [
        ...serviceRequests.map((r) => ({ status: r.status })),
        ...promotions.map((p) => ({ status: p.status })),
    ];
    const totalRequests = allRequests.length;
    const pendingRequests = allRequests.filter((r) => r.status === 'pending').length;
    const approvedRequests = allRequests.filter((r) => r.status === 'approved' || r.status === 'live' || r.status === 'in_progress').length;
    const completedRequests = allRequests.filter((r) => r.status === 'completed').length;
    const promoRevenue = promotions
        .filter((p) => ['approved', 'live', 'in_progress', 'completed'].includes(p.status))
        .reduce((s, p) => s + Number(p.amount || 0), 0);
    const orderRevenue = orders
        .filter((o) => o.payment_status === 'paid' || o.payment_status === 'completed')
        .reduce((s, o) => s + Number(o.total_amount || 0) / 100, 0);
    const totalRevenue = promoRevenue + orderRevenue;

    return (
        <section className="pt-24 pb-16 bg-background min-h-screen">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                        <p className="text-muted-foreground">
                            CONFIDENTIAL CONNECT LTD — Management Panel
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline">
                            <Link to="/admin/orders">📊 Payment Tracking</Link>
                        </Button>
                        <Button asChild>
                            <Link to="/admin/promotions">📣 Promotion Payments</Link>
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                    <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                            <FileText className="h-8 w-8 text-primary" />
                            <div>
                                <div className="text-2xl font-bold">{totalRequests}</div>
                                <div className="text-xs text-muted-foreground">Total Requests</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                            <Clock className="h-8 w-8 text-yellow-500" />
                            <div>
                                <div className="text-2xl font-bold">{pendingRequests}</div>
                                <div className="text-xs text-muted-foreground">Pending</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                            <ThumbsUp className="h-8 w-8 text-blue-500" />
                            <div>
                                <div className="text-2xl font-bold">{approvedRequests}</div>
                                <div className="text-xs text-muted-foreground">Approved</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 flex items-center gap-3">
                            <CheckCircle className="h-8 w-8 text-green-500" />
                            <div>
                                <div className="text-2xl font-bold">{completedRequests}</div>
                                <div className="text-xs text-muted-foreground">Completed</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-primary/5 border-primary/20 col-span-2 md:col-span-1">
                        <CardContent className="p-4 flex items-center gap-3">
                            <Wallet className="h-8 w-8 text-primary" />
                            <div>
                                <div className="text-2xl font-bold text-primary">₦{totalRevenue.toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground">Total Revenue</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="service-requests" className="space-y-6">
                    <TabsList className="flex-wrap">
                        <TabsTrigger value="service-requests">Service Requests</TabsTrigger>
                        <TabsTrigger value="orders">Orders</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        <TabsTrigger value="support">Support</TabsTrigger>
                    </TabsList>

                    {/* Service Requests Tab */}
                    <TabsContent value="service-requests">
                        <Card>
                            <CardHeader>
                                <CardTitle>Service Requests Management</CardTitle>
                                <CardDescription>Review and manage client service requests</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>
                                ) : serviceRequests.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">No service requests yet</div>
                                ) : (
                                    <div className="space-y-4">
                                        {serviceRequests.map((req) => (
                                            <div key={req.id} className="border rounded-lg p-4 space-y-3">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-semibold">
                                                                {SERVICE_LABELS[req.service_type] || req.service_type}
                                                            </h3>
                                                            <Badge variant="outline" className={getStatusColor(req.status)}>
                                                                {req.status}
                                                            </Badge>
                                                        </div>
                                                        <div className="text-sm text-muted-foreground space-y-0.5">
                                                            <p><strong>Client:</strong> {req.client_name}</p>
                                                            <p><strong>Email:</strong> {req.client_email}</p>
                                                            <p><strong>Phone:</strong> {req.client_phone}</p>
                                                            {req.description && <p><strong>Details:</strong> {req.description}</p>}
                                                            <p><strong>Date:</strong> {new Date(req.created_at).toLocaleDateString('en-NG')}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Separator />

                                                <div className="space-y-2">
                                                    <Textarea
                                                        placeholder="Add admin notes for the client..."
                                                        value={adminNotes[req.id] ?? req.admin_notes ?? ''}
                                                        onChange={(e) => setAdminNotes(prev => ({ ...prev, [req.id]: e.target.value }))}
                                                        rows={2}
                                                    />
                                                    <div className="flex flex-wrap gap-2">
                                                        <Select
                                                            defaultValue={req.status}
                                                            onValueChange={(value) => updateRequestStatus(req.id, value)}
                                                        >
                                                            <SelectTrigger className="w-[180px]">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="pending">Pending</SelectItem>
                                                                <SelectItem value="in_progress">In Progress</SelectItem>
                                                                <SelectItem value="completed">Completed</SelectItem>
                                                                <SelectItem value="rejected">Rejected</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Orders Tab */}
                    <TabsContent value="orders">
                        <Card>
                            <CardHeader>
                                <CardTitle>Orders Management</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {orders.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">No orders yet</div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div key={order.id} className="border rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="font-medium">#{order.payment_reference || order.id.slice(0, 8)}</div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className={getStatusColor(order.payment_status || 'pending')}>
                                                            {order.payment_status}
                                                        </Badge>
                                                        <Button size="sm" variant="outline" onClick={() => updateOrderStatus(order.id, 'completed')} disabled={order.payment_status === 'completed'}>
                                                            Complete
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-2 text-sm">
                                                    <div>
                                                        <p className="font-medium">{order.customer_name}</p>
                                                        <p className="text-muted-foreground">{order.customer_email}</p>
                                                        <p className="text-muted-foreground">{order.customer_phone}</p>
                                                    </div>
                                                    <div className="md:text-right">
                                                        <p className="font-medium">{formatNGN(order.total_amount / 100)}</p>
                                                        <p className="text-muted-foreground">{new Date(order.created_at!).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Users Tab */}
                    <TabsContent value="users">
                        <Card>
                            <CardHeader>
                                <CardTitle>Registered Users</CardTitle>
                                <CardDescription>{users.length} total users</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {users.map((u) => (
                                        <div key={u.id} className="flex items-center justify-between border rounded-lg p-3">
                                            <div>
                                                <p className="font-medium">{u.full_name || 'No name'}</p>
                                                <p className="text-sm text-muted-foreground">{u.email}</p>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Joined: {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="analytics">
                        <LiveCharts />
                    </TabsContent>

                    <TabsContent value="support">
                        <SupportChat />
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
};

export default AdminHome;
