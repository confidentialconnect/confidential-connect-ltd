import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft, Loader2, RefreshCw, Search, FileImage, ExternalLink,
  CheckCircle, XCircle, Clock, Phone, Mail, Building2, User, Target,
} from "lucide-react";

interface PromotionPayment {
  id: string;
  user_id: string;
  plan: string;
  amount: number;
  duration: string | null;
  full_name: string;
  business_name: string;
  phone: string;
  email: string | null;
  promote_what: string;
  target_audience: string | null;
  receipt_url: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_OPTIONS = ["pending", "approved", "rejected", "live"];

const AdminPromotionPayments = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [payments, setPayments] = useState<PromotionPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [receiptUrls, setReceiptUrls] = useState<Record<string, string>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Promotion Payments | Admin Dashboard";
    fetchPayments();
  }, []);

  if (!authLoading && (!user || !isAdmin)) {
    return <Navigate to="/auth" replace />;
  }

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("promotion_payments")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const list = (data || []) as PromotionPayment[];
      setPayments(list);

      // Generate signed URLs for any receipts
      const urls: Record<string, string> = {};
      await Promise.all(
        list
          .filter((p) => p.receipt_url)
          .map(async (p) => {
            const { data: signed } = await supabase.storage
              .from("receipts")
              .createSignedUrl(p.receipt_url!, 60 * 60);
            if (signed?.signedUrl) urls[p.id] = signed.signedUrl;
          })
      );
      setReceiptUrls(urls);
    } catch (e: any) {
      console.error(e);
      toast({ title: "Error", description: "Failed to load promotion payments", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (p: PromotionPayment, newStatus: string) => {
    setUpdatingId(p.id);
    try {
      const notes = notesDraft[p.id] ?? p.admin_notes ?? null;
      const { error } = await supabase
        .from("promotion_payments")
        .update({ status: newStatus, admin_notes: notes, updated_at: new Date().toISOString() })
        .eq("id", p.id);
      if (error) throw error;

      // Notify the user
      await supabase.from("notifications").insert({
        user_id: p.user_id,
        title: `Promotion ${newStatus}`,
        message: `Your "${p.plan}" promotion submission has been ${newStatus}.${notes ? ` Note: ${notes}` : ""}`,
        type: newStatus === "approved" || newStatus === "live" ? "success" : newStatus === "rejected" ? "error" : "info",
        link: "/dashboard",
      });

      setPayments((prev) =>
        prev.map((row) => (row.id === p.id ? { ...row, status: newStatus, admin_notes: notes } : row))
      );
      toast({ title: "Updated", description: `Submission marked as ${newStatus}` });
    } catch (e: any) {
      console.error(e);
      toast({ title: "Update failed", description: e.message ?? "Try again", variant: "destructive" });
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = payments.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      p.full_name.toLowerCase().includes(q) ||
      p.business_name.toLowerCase().includes(q) ||
      (p.email ?? "").toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.plan.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: payments.length,
    pending: payments.filter((p) => p.status === "pending").length,
    approved: payments.filter((p) => p.status === "approved" || p.status === "live").length,
    rejected: payments.filter((p) => p.status === "rejected").length,
    revenue: payments
      .filter((p) => p.status === "approved" || p.status === "live")
      .reduce((s, p) => s + Number(p.amount || 0), 0),
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-700 border-yellow-300",
      approved: "bg-green-500/10 text-green-700 border-green-300",
      live: "bg-emerald-500/10 text-emerald-700 border-emerald-300",
      rejected: "bg-red-500/10 text-red-700 border-red-300",
    };
    const Icon = status === "rejected" ? XCircle : status === "pending" ? Clock : CheckCircle;
    return (
      <Badge variant="outline" className={map[status] ?? ""}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/admin"><ArrowLeft className="h-4 w-4 mr-2" />Back to Admin</Link>
          </Button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Promotion Payments</h1>
              <p className="text-muted-foreground">Review submissions, view receipts, approve or reject with notes.</p>
            </div>
            <Button onClick={fetchPayments} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card><CardContent className="p-4"><div className="text-2xl font-bold">{stats.total}</div><div className="text-sm text-muted-foreground">Total</div></CardContent></Card>
          <Card className="bg-yellow-50 border-yellow-200"><CardContent className="p-4"><div className="text-2xl font-bold text-yellow-700">{stats.pending}</div><div className="text-sm text-yellow-600">Pending</div></CardContent></Card>
          <Card className="bg-green-50 border-green-200"><CardContent className="p-4"><div className="text-2xl font-bold text-green-700">{stats.approved}</div><div className="text-sm text-green-600">Approved/Live</div></CardContent></Card>
          <Card className="bg-red-50 border-red-200"><CardContent className="p-4"><div className="text-2xl font-bold text-red-700">{stats.rejected}</div><div className="text-sm text-red-600">Rejected</div></CardContent></Card>
          <Card className="bg-primary/5 border-primary/20 col-span-2 md:col-span-1"><CardContent className="p-4"><div className="text-2xl font-bold text-primary">₦{stats.revenue.toLocaleString()}</div><div className="text-sm text-primary/80">Confirmed Revenue</div></CardContent></Card>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, business, email, phone, or plan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <Card><CardContent className="p-10 text-center text-muted-foreground">No promotion submissions found.</CardContent></Card>
          ) : (
            filtered.map((p) => {
              const url = receiptUrls[p.id];
              const isImage = p.receipt_url && /\.(png|jpe?g|gif|webp)$/i.test(p.receipt_url);
              return (
                <Card key={p.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          {p.business_name}
                          <span className="text-sm font-normal text-muted-foreground">— {p.plan}</span>
                        </CardTitle>
                        <CardDescription className="flex flex-wrap gap-3 mt-1">
                          <span className="flex items-center gap-1"><User className="h-3 w-3" />{p.full_name}</span>
                          {p.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{p.email}</span>}
                          <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{p.phone}</span>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {statusBadge(p.status)}
                        <span className="font-bold text-primary">₦{Number(p.amount).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Separator className="my-3" />
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="md:col-span-2 space-y-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">What to promote</p>
                          <p className="font-medium">{p.promote_what}</p>
                        </div>
                        {p.target_audience && (
                          <div>
                            <p className="text-muted-foreground flex items-center gap-1"><Target className="h-3 w-3" />Target audience</p>
                            <p>{p.target_audience}</p>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-muted-foreground">Duration</p>
                            <p>{p.duration ?? "—"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Submitted</p>
                            <p>{new Date(p.created_at).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground flex items-center gap-1"><FileImage className="h-3 w-3" />Payment Receipt</p>
                        {p.receipt_url ? (
                          url ? (
                            <div className="space-y-2">
                              {isImage ? (
                                <a href={url} target="_blank" rel="noopener noreferrer" className="block">
                                  <img src={url} alt="Receipt" className="rounded-md border max-h-48 w-full object-cover hover:opacity-90 transition" />
                                </a>
                              ) : (
                                <div className="border rounded-md p-4 text-center text-sm text-muted-foreground">Receipt file (PDF)</div>
                              )}
                              <Button size="sm" variant="outline" asChild className="w-full">
                                <a href={url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3 mr-1" />Open Receipt
                                </a>
                              </Button>
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">Loading receipt...</div>
                          )
                        ) : (
                          <div className="text-sm text-muted-foreground italic">No receipt uploaded</div>
                        )}
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Admin notes (sent to user)</label>
                        <Textarea
                          rows={2}
                          placeholder="Add a note for the user (optional)..."
                          value={notesDraft[p.id] ?? p.admin_notes ?? ""}
                          onChange={(e) => setNotesDraft((prev) => ({ ...prev, [p.id]: e.target.value }))}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateStatus(p, "approved")}
                          disabled={updatingId === p.id || p.status === "approved"}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />Approve
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateStatus(p, "live")}
                          disabled={updatingId === p.id || p.status === "live"}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />Mark Live
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateStatus(p, "rejected")}
                          disabled={updatingId === p.id || p.status === "rejected"}
                        >
                          <XCircle className="h-3 w-3 mr-1" />Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(p, "pending")}
                          disabled={updatingId === p.id || p.status === "pending"}
                        >
                          <Clock className="h-3 w-3 mr-1" />Reset to Pending
                        </Button>
                        <Button size="sm" variant="outline" asChild className="ml-auto">
                          <a
                            href={`https://wa.me/${p.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${p.full_name}, regarding your "${p.plan}" promotion submission with Confidential Connect Ltd.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            WhatsApp Client
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPromotionPayments;