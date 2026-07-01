import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Store, Plus, Pencil, Trash2, Check, X, Eye, MessageCircle, MousePointerClick } from "lucide-react";
import { NIGERIAN_STATES, BUSINESS_CATEGORIES } from "@/data/nigerianStates";

type Biz = any;

const empty = (): Partial<Biz> => ({
  name: "", category: "General", short_description: "", description: "",
  state: "", city: "", phone: "", whatsapp: "", email: "", website: "", logo_url: "",
  verified: false, promotion_tier: 0, status: "approved",
});

const tierName = (t: number) => ["Regular","Promoted","Featured","Promote with Link"][t] || "Regular";

const AdminBusinesses = () => {
  const [items, setItems] = useState<Biz[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editing, setEditing] = useState<Partial<Biz> | null>(null);

  const load = async () => {
    setLoading(true);
    let q = supabase.from("businesses").select("*").order("created_at", { ascending: false });
    if (statusFilter !== "all") q = q.eq("status", statusFilter);
    const { data } = await q;
    setItems(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [statusFilter]);

  const save = async () => {
    if (!editing?.name?.trim()) { toast.error("Name is required"); return; }
    const payload = { ...editing };
    delete (payload as any).created_at;
    delete (payload as any).updated_at;
    delete (payload as any).views;
    delete (payload as any).whatsapp_clicks;
    delete (payload as any).link_clicks;
    if (editing.id) {
      const { error } = await supabase.from("businesses").update(payload).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Business updated");
    } else {
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await supabase.from("businesses").insert({ ...payload, owner_id: userData.user?.id } as any);
      if (error) { toast.error(error.message); return; }
      toast.success("Business added");
    }
    setEditing(null);
    load();
  };

  const setStatus = async (id: string, status: string) => {
    setItems((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
    const { error } = await supabase.from("businesses").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); load(); }
    else toast.success(`Marked ${status}`);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this business permanently?")) return;
    const { error } = await supabase.from("businesses").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Businesses</h1>
          <p className="text-sm text-muted-foreground">Approve, feature, and manage marketplace listings.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setEditing(empty())}><Plus className="h-4 w-4 mr-1" /> Add Business</Button>
        </div>
      </div>

      {loading ? (
        <div className="h-40 rounded-xl bg-muted animate-pulse" />
      ) : items.length === 0 ? (
        <Card><CardContent className="p-10 text-center text-muted-foreground">
          <Store className="h-10 w-10 mx-auto mb-2" /> No businesses in this view.
        </CardContent></Card>
      ) : (
        <div className="grid gap-3">
          {items.map((b) => (
            <Card key={b.id}>
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden flex items-center justify-center shrink-0">
                  {b.logo_url ? <img src={b.logo_url} alt={b.name} className="h-full w-full object-cover" /> : <Store className="h-5 w-5 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-semibold truncate">{b.name}</p>
                    <Badge variant="outline">{b.category}</Badge>
                    <Badge variant={b.status === "approved" ? "default" : "secondary"}>{b.status}</Badge>
                    {b.verified && <Badge className="bg-primary/10 text-primary border-primary/20">Verified</Badge>}
                    <Badge variant="outline">{tierName(b.promotion_tier)}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {[b.city, b.state].filter(Boolean).join(", ") || "—"}
                    {b.phone && ` · ${b.phone}`}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {b.views ?? 0}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {b.whatsapp_clicks ?? 0}</span>
                    <span className="flex items-center gap-1"><MousePointerClick className="h-3 w-3" /> {b.link_clicks ?? 0}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {b.status !== "approved" && (
                    <Button size="sm" variant="outline" onClick={() => setStatus(b.id, "approved")}>
                      <Check className="h-3.5 w-3.5 mr-1" /> Approve
                    </Button>
                  )}
                  {b.status !== "rejected" && (
                    <Button size="sm" variant="outline" onClick={() => setStatus(b.id, "rejected")}>
                      <X className="h-3.5 w-3.5 mr-1" /> Reject
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => setEditing(b)}>
                    <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(b.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit Business" : "Add Business"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label>Business Name *</Label>
                <Input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={editing.category ?? "General"} onValueChange={(v) => setEditing({ ...editing, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{BUSINESS_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>State</Label>
                <Select value={editing.state ?? ""} onValueChange={(v) => setEditing({ ...editing, state: v })}>
                  <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent>{NIGERIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>City</Label>
                <Input value={editing.city ?? ""} onChange={(e) => setEditing({ ...editing, city: e.target.value })} />
              </div>
              <div>
                <Label>Address</Label>
                <Input value={editing.address ?? ""} onChange={(e) => setEditing({ ...editing, address: e.target.value })} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={editing.phone ?? ""} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} />
              </div>
              <div>
                <Label>WhatsApp</Label>
                <Input value={editing.whatsapp ?? ""} onChange={(e) => setEditing({ ...editing, whatsapp: e.target.value })} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={editing.email ?? ""} onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
              </div>
              <div>
                <Label>Website</Label>
                <Input value={editing.website ?? ""} onChange={(e) => setEditing({ ...editing, website: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label>Logo URL</Label>
                <Input value={editing.logo_url ?? ""} onChange={(e) => setEditing({ ...editing, logo_url: e.target.value })} placeholder="https://..." />
              </div>
              <div className="sm:col-span-2">
                <Label>Short Description</Label>
                <Input value={editing.short_description ?? ""} maxLength={140} onChange={(e) => setEditing({ ...editing, short_description: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label>Full Description</Label>
                <Textarea rows={4} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div>
                <Label>Promotion Tier</Label>
                <Select value={String(editing.promotion_tier ?? 0)} onValueChange={(v) => setEditing({ ...editing, promotion_tier: Number(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Regular</SelectItem>
                    <SelectItem value="1">Promoted</SelectItem>
                    <SelectItem value="2">Featured</SelectItem>
                    <SelectItem value="3">Promote with Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={editing.status ?? "approved"} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <Switch checked={!!editing.verified} onCheckedChange={(v) => setEditing({ ...editing, verified: v })} />
                <Label>Verified badge</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBusinesses;