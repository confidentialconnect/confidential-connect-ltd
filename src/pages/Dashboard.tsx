import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
    FileText, Bell, Clock, CheckCircle, AlertCircle,
    Plus, Loader2, Package, Download, Megaphone, ShieldCheck
} from 'lucide-react';

interface ServiceRequest {
    id: string;
    service_type: string;
    status: string;
    created_at: string;
    updated_at: string;
    description: string | null;
    admin_notes: string | null;
    delivered_file_url: string | null;
    delivered_at: string | null;
    delivery_note: string | null;
}

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    created_at: string;
    link: string | null;
}

interface PromotionRow {
    id: string;
    plan: string;
    amount: number;
    business_name: string | null;
    status: string;
    admin_notes: string | null;
    created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
    pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: Clock },
    in_progress: { label: 'In Progress', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: Loader2 },
    completed: { label: 'Completed', color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: CheckCircle },
    rejected: { label: 'Rejected', color: 'bg-red-500/10 text-red-600 border-red-500/20', icon: AlertCircle },
};

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

const Dashboard = () => {
    const { user, profile } = useAuth();
    const { toast } = useToast();
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [promotions, setPromotions] = useState<PromotionRow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = 'My Dashboard | Confidential Connect Ltd';
        if (user) {
            fetchData();
            subscribeToNotifications();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const [reqRes, notifRes, promoRes] = await Promise.all([
                supabase
                    .from('service_requests')
                    .select('*')
                    .eq('user_id', user!.id)
                    .order('created_at', { ascending: false }),
                supabase
                    .from('notifications')
                    .select('*')
                    .eq('user_id', user!.id)
                    .order('created_at', { ascending: false })
                    .limit(20),
                supabase
                    .from('promotion_payments')
                    .select('id, plan, amount, business_name, status, admin_notes, created_at')
                    .eq('user_id', user!.id)
                    .order('created_at', { ascending: false }),
            ]);

            if (reqRes.data) setRequests(reqRes.data);
            if (notifRes.data) setNotifications(notifRes.data);
            if (promoRes.data) setPromotions(promoRes.data as PromotionRow[]);
        } catch (error) {
            console.error('Dashboard fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const subscribeToNotifications = () => {
        const channel = supabase
            .channel('user-notifications')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${user!.id}`,
            }, (payload) => {
                const newNotif = payload.new as Notification;
                setNotifications(prev => [newNotif, ...prev]);
                toast({ title: newNotif.title, description: newNotif.message });
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    };

    const markAsRead = async (notifId: string) => {
        await supabase.from('notifications').update({ is_read: true }).eq('id', notifId);
        setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: true } : n));
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;
    const delivered = requests.filter(r => r.delivered_file_url);

    const downloadDelivered = async (path: string) => {
        const { data, error } = await supabase.storage
            .from('delivered-documents')
            .createSignedUrl(path, 120);
        if (error || !data) {
            toast({ title: 'Error', description: error?.message || 'Could not generate link', variant: 'destructive' });
            return;
        }
        window.open(data.signedUrl, '_blank');
    };

    if (!user) {
        return (
            <div className="min-h-screen">
                <Header />
                <div className="flex items-center justify-center min-h-[60vh] pt-20">
                    <Card className="w-full max-w-md mx-4">
                        <CardHeader className="text-center">
                            <CardTitle>Sign In Required</CardTitle>
                            <CardDescription>Please sign in to access your dashboard</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full"><a href="/auth">Sign In</a></Button>
                        </CardContent>
                    </Card>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">
                                Welcome, {profile?.full_name || 'User'}
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Track your service requests and notifications
                            </p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <Button asChild variant="outline">
                                <Link to="/my-purchases">
                                    <Package className="h-4 w-4 mr-2" />
                                    My Purchases
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link to="/request-service">
                                    <Plus className="h-4 w-4 mr-2" />
                                    New Service Request
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    {!(profile as any)?.verified && (
                        <Card className="mb-6 border-amber-300 bg-amber-50">
                            <CardContent className="p-4 flex items-center justify-between gap-3 flex-wrap">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-amber-900">Verify your identity</p>
                                        <p className="text-xs text-amber-800">Get a verified badge and unlock higher transaction limits.</p>
                                    </div>
                                </div>
                                <Link to="/verify-identity"><Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">Start verification</Button></Link>
                            </CardContent>
                        </Card>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-foreground">{requests.length}</div>
                                <div className="text-xs text-muted-foreground">Total Requests</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-yellow-600">
                                    {requests.filter(r => r.status === 'pending').length}
                                </div>
                                <div className="text-xs text-muted-foreground">Pending</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {requests.filter(r => r.status === 'in_progress').length}
                                </div>
                                <div className="text-xs text-muted-foreground">In Progress</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {requests.filter(r => r.status === 'completed').length}
                                </div>
                                <div className="text-xs text-muted-foreground">Completed</div>
                            </CardContent>
                        </Card>
                    </div>

                    <Tabs defaultValue="requests" className="space-y-6">
                        <TabsList>
                            <TabsTrigger value="requests" className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                My Requests
                            </TabsTrigger>
                            <TabsTrigger value="downloads" className="flex items-center gap-2">
                                <Download className="h-4 w-4" />
                                Downloads
                                {delivered.length > 0 && (
                                    <span className="ml-1 bg-green-600 text-white text-xs rounded-full h-5 min-w-5 px-1 flex items-center justify-center">
                                        {delivered.length}
                                    </span>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="promotions" className="flex items-center gap-2">
                                <Megaphone className="h-4 w-4" />
                                Promotions
                            </TabsTrigger>
                            <TabsTrigger value="notifications" className="flex items-center gap-2">
                                <Bell className="h-4 w-4" />
                                Notifications
                                {unreadCount > 0 && (
                                    <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="requests">
                            {loading ? (
                                <div className="text-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                                </div>
                            ) : requests.length === 0 ? (
                                <Card>
                                    <CardContent className="py-12 text-center">
                                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No Requests Yet</h3>
                                        <p className="text-muted-foreground mb-4">
                                            Submit your first service request to get started
                                        </p>
                                        <Button asChild>
                                            <Link to="/request-service">Request a Service</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {requests.map((req) => {
                                        const statusConf = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
                                        const StatusIcon = statusConf.icon;
                                        return (
                                            <Card key={req.id}>
                                                <CardContent className="p-5">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <h3 className="font-semibold text-foreground">
                                                                    {SERVICE_LABELS[req.service_type] || req.service_type}
                                                                </h3>
                                                                <Badge variant="outline" className={statusConf.color}>
                                                                    <StatusIcon className="h-3 w-3 mr-1" />
                                                                    {statusConf.label}
                                                                </Badge>
                                                            </div>
                                                            {req.description && (
                                                                <p className="text-sm text-muted-foreground mb-2">
                                                                    {req.description}
                                                                </p>
                                                            )}
                                                            {req.admin_notes && (
                                                                <div className="bg-muted/50 rounded-lg p-3 mt-2">
                                                                    <p className="text-xs font-medium text-foreground mb-1">Admin Response:</p>
                                                                    <p className="text-sm text-muted-foreground">{req.admin_notes}</p>
                                                                </div>
                                                            )}
                                                            <p className="text-xs text-muted-foreground mt-2">
                                                                Submitted: {new Date(req.created_at).toLocaleDateString('en-NG', {
                                                                    year: 'numeric', month: 'long', day: 'numeric'
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="downloads">
                            {delivered.length === 0 ? (
                                <Card>
                                    <CardContent className="py-12 text-center">
                                        <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground">
                                            No delivered documents yet. You'll see them here once we complete your requests.
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-3">
                                    {delivered.map((req) => (
                                        <Card key={req.id}>
                                            <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-primary" />
                                                        <span className="font-semibold">
                                                            {SERVICE_LABELS[req.service_type] || req.service_type}
                                                        </span>
                                                        <Badge variant="outline" className="text-green-700 border-green-300">
                                                            Ready
                                                        </Badge>
                                                    </div>
                                                    {req.delivery_note && (
                                                        <p className="text-sm text-muted-foreground mt-1">{req.delivery_note}</p>
                                                    )}
                                                    {req.delivered_at && (
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            Delivered {new Date(req.delivered_at).toLocaleString()}
                                                        </p>
                                                    )}
                                                </div>
                                                <Button onClick={() => downloadDelivered(req.delivered_file_url!)}>
                                                    <Download className="h-4 w-4 mr-2" /> Download
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="promotions">
                            {promotions.length === 0 ? (
                                <Card>
                                    <CardContent className="py-12 text-center">
                                        <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground mb-4">No promotions yet</p>
                                        <Button asChild>
                                            <Link to="/advertising">Promote Your Business</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-3">
                                    {promotions.map((p) => {
                                        const color =
                                            p.status === 'approved' || p.status === 'live'
                                                ? 'bg-green-500/10 text-green-700 border-green-300'
                                                : p.status === 'rejected'
                                                ? 'bg-red-500/10 text-red-700 border-red-300'
                                                : 'bg-yellow-500/10 text-yellow-700 border-yellow-300';
                                        return (
                                            <Card key={p.id}>
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            <p className="font-semibold capitalize">
                                                                {p.plan} Plan — ₦{Number(p.amount).toLocaleString()}
                                                            </p>
                                                            {p.business_name && (
                                                                <p className="text-sm text-muted-foreground">{p.business_name}</p>
                                                            )}
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                {new Date(p.created_at).toLocaleString()}
                                                            </p>
                                                            {p.admin_notes && (
                                                                <div className="bg-muted/50 rounded p-2 mt-2 text-sm">
                                                                    <span className="font-medium">Admin:</span> {p.admin_notes}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <Badge variant="outline" className={color}>{p.status}</Badge>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="notifications">
                            {notifications.length === 0 ? (
                                <Card>
                                    <CardContent className="py-12 text-center">
                                        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground">No notifications yet</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-3">
                                    {notifications.map((notif) => (
                                        <Card
                                            key={notif.id}
                                            className={`cursor-pointer transition-colors ${!notif.is_read ? 'border-primary/30 bg-primary/5' : ''}`}
                                            onClick={() => markAsRead(notif.id)}
                                        >
                                            <CardContent className="p-4 flex items-start gap-3">
                                                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!notif.is_read ? 'bg-primary' : 'bg-transparent'}`} />
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm text-foreground">{notif.title}</p>
                                                    <p className="text-sm text-muted-foreground">{notif.message}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {new Date(notif.created_at).toLocaleDateString('en-NG', {
                                                            year: 'numeric', month: 'short', day: 'numeric',
                                                            hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;
