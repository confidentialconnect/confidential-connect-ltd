import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  ArrowLeft, Loader2, RefreshCw, Search, FileImage, ExternalLink,
  CheckCircle, XCircle, Clock, Phone, Mail, Building2, User, Target, Pencil, PlayCircle, Flag,
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

const STATUS_OPTIONS = ["pending", "approved", "in_progress", "completed", "live", "rejected"];

const AdminPromotionPayments = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<PromotionPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [receiptUrls, setReceiptUrls] = useState<Record<string, string>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<PromotionPayment | null>(null);
  const [editForm, setEditForm] = useState<Partial<PromotionPayment>>({});
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    document.title = "Promotion Payments | Admin Dashboard";
    fetchPayments();
  }, []);

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
    if (p.status === newStatus) return;
    const prevStatus = p.status;
    const notes = notesDraft[p.id] ?? p.admin_notes ?? null;

    // Optimistic UI update — flip status instantly
    setPayments((prev) =>
      prev.map((row) => (row.id === p.id ? { ...row, status: newStatus, admin_notes: notes } : row))
    );
    setUpdatingId(p.id);
    const loadingId = sonnerToast.loading(`Updating to ${newStatus.replace("_", " ")}...`);
    try {
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

      sonnerToast.success(`Marked as ${newStatus.replace("_", " ")}`, {
        id: loadingId,
        description: `${p.business_name} — ${p.plan}`,
      });
    } catch (e: any) {
      console.error(e);
      // Roll back optimistic update on failure
      setPayments((prev) =>
        prev.map((row) => (row.id === p.id ? { ...row, status: prevStatus } : row))
      );
      sonnerToast.error("Update failed", {
        id: loadingId,
        description: e.message ?? "Please try again.",
      });
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
    inProgress: payments.filter((p) => p.status === "in_progress").length,
    completed: payments.filter((p) => p.status === "completed").length,
    revenue: payments
      .filter((p) => ["approved", "live", "in_progress", "completed"].includes(p.status))
      .reduce((s, p) => s + Number(p.amount || 0), 0),
  };

  const now = Date.now();
  const inWindow = (p: PromotionPayment, ms: number) =>
    ["approved", "live", "in_progress", "completed"].includes(p.status) &&
    now - new Date(p.created_at).getTime() <= ms;
  const sumAmt = (arr: PromotionPayment[]) => arr.reduce((s, p) => s + Number(p.amount || 0), 0);
  const revenueDaily = sumAmt(payments.filter((p) => inWindow(p, 24 * 3600 * 1000)));
  const revenueWeekly = sumAmt(payments.filter((p) => inWindow(p, 7 * 24 * 3600 * 1000)));
  const revenueMonthly = sumAmt(payments.filter((p) => inWindow(p, 30 * 24 * 3600 * 1000)));

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-700 border-yellow-300",
      approved: "bg-green-500/10 text-green-700 border-green-300",
      live: "bg-emerald-500/10 text-emerald-700 border-emerald-300",
      in_progress: "bg-blue-500/10 text-blue-700 border-blue-300",
      completed: "bg-violet-500/10 text-violet-700 border-violet-300",
      rejected: "bg-red-500/10 text-red-700 border-red-300",
    };
    const Icon = status === "rejected" ? XCircle : status === "pending" ? Clock : CheckCircle;
    return (
      <Badge variant="outline" className={map[status] ?? ""}>
        <Icon className="h-3 w-3 mr-1" />
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const openEdit = (p: PromotionPayment) => {
    setEditing(p);
    setEditForm({
      full_name: p.full_name,
      business_name: p.business_name,
      phone: p.phone,
      email: p.email,
      plan: p.plan,
      amount: p.amount,
      duration: p.duration,
      promote_what: p.promote_what,
      target_audience: p.target_audience,
    });
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSavingEdit(true);
    try {
      const patch = {
        full_name: editForm.full_name ?? editing.full_name,
        business_name: editForm.business_name ?? editing.business_name,
        phone: editForm.phone ?? editing.phone,
        email: editForm.email ?? editing.email,
        plan: editForm.plan ?? editing.plan,
        amount: Number(editForm.amount ?? editing.amount),
        duration: editForm.duration ?? editing.duration,
        promote_what: editForm.promote_what ?? editing.promote_what,
        target_audience: editForm.target_audience ?? editing.target_audience,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase
        .from("promotion_payments")
        .update(patch)
        .eq("id", editing.id);
      if (error) throw error;
      setPayments((prev) => prev.map((r) => (r.id === editing.id ? { ...r, ...patch } as PromotionPayment : r)));
      toast({ title: "Saved", description: "Request details updated" });
      setEditing(null);
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message ?? "Try again", variant: "destructive" });
    } finally {
      setSavingEdit(false);
    }
  };

  if (loading) {
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

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <Card><CardContent className="p-4"><div className="text-2xl font-bold">{stats.total}</div><div className="text-sm text-muted-foreground">Total</div></CardContent></Card>
          <Card className="bg-yellow-50 border-yellow-200"><CardContent className="p-4"><div className="text-2xl font-bold text-yellow-700">{stats.pending}</div><div className="text-sm text-yellow-600">Pending</div></CardContent></Card>
          <Card className="bg-green-50 border-green-200"><CardContent className="p-4"><div className="text-2xl font-bold text-green-700">{stats.approved}</div><div className="text-sm text-green-600">Approved/Live</div></CardContent></Card>
          <Card className="bg-blue-50 border-blue-200"><CardContent className="p-4"><div className="text-2xl font-bold text-blue-700">{stats.inProgress}</div><div className="text-sm text-blue-600">In Progress</div></CardContent></Card>
          <Card className="bg-violet-50 border-violet-200"><CardContent className="p-4"><div className="text-2xl font-bold text-violet-700">{stats.completed}</div><div className="text-sm text-violet-600">Completed</div></CardContent></Card>
          <Card className="bg-red-50 border-red-200"><CardContent className="p-4"><div className="text-2xl font-bold text-red-700">{stats.rejected}</div><div className="text-sm text-red-600">Rejected</div></CardContent></Card>
          <Card className="bg-primary/5 border-primary/20 col-span-2 lg:col-span-1"><CardContent className="p-4"><div className="text-2xl font-bold text-primary">₦{stats.revenue.toLocaleString()}</div><div className="text-sm text-primary/80">Total Revenue</div></CardContent></Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Daily Revenue</div><div className="text-2xl font-bold text-primary">₦{revenueDaily.toLocaleString()}</div></CardContent></Card>
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Weekly Revenue</div><div className="text-2xl font-bold text-primary">₦{revenueWeekly.toLocaleString()}</div></CardContent></Card>
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20"><CardContent className="p-4"><div className="text-sm text-muted-foreground">Monthly Revenue</div><div className="text-2xl font-bold text-primary">₦{revenueMonthly.toLocaleString()}</div></CardContent></Card>
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
                          onClick={() => updateStatus(p, "in_progress")}
                          disabled={updatingId === p.id || p.status === "in_progress"}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <PlayCircle className="h-3 w-3 mr-1" />In Progress
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
                          onClick={() => updateStatus(p, "completed")}
                          disabled={updatingId === p.id || p.status === "completed"}
                          className="bg-violet-600 hover:bg-violet-700"
                        >
                          <Flag className="h-3 w-3 mr-1" />Completed
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
                        <Button size="sm" variant="outline" onClick={() => openEdit(p)}>
                          <Pencil className="h-3 w-3 mr-1" />Edit
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

        <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Request</DialogTitle>
            </DialogHeader>
            {editing && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Full name</label>
                  <Input value={editForm.full_name ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, full_name: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium">Business name</label>
                  <Input value={editForm.business_name ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, business_name: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input value={editForm.phone ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input value={editForm.email ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium">Plan</label>
                  <Select value={editForm.plan ?? ""} onValueChange={(v) => setEditForm((f) => ({ ...f, plan: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Starter">Starter</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Growth">Growth</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Amount (₦)</label>
                  <Input type="number" value={editForm.amount ?? 0} onChange={(e) => setEditForm((f) => ({ ...f, amount: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="text-sm font-medium">Duration</label>
                  <Input value={editForm.duration ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, duration: e.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Promotion content</label>
                  <Textarea rows={3} value={editForm.promote_what ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, promote_what: e.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Target audience</label>
                  <Textarea rows={2} value={editForm.target_audience ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, target_audience: e.target.value }))} />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditing(null)} disabled={savingEdit}>Cancel</Button>
              <Button onClick={saveEdit} disabled={savingEdit}>
                {savingEdit && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminPromotionPayments;