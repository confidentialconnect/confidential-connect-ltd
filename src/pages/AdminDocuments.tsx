import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, FileText, Search, RefreshCw, Send, Trash2 } from "lucide-react";

interface ServiceRequest {
  id: string;
  user_id: string;
  service_type: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  description: string | null;
  document_url: string | null;
  delivered_file_url: string | null;
  delivered_at: string | null;
  delivery_note: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

const STATUSES = ["pending", "in_progress", "completed", "rejected"];

const AdminDocuments = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<ServiceRequest | null>(null);
  const [deliveryNote, setDeliveryNote] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "Document Delivery | Admin";
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("service_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  const openItem = (it: ServiceRequest) => {
    setSelected(it);
    setDeliveryNote(it.delivery_note || "");
    setAdminNotes(it.admin_notes || "");
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("service_requests").update({ status }).eq("id", id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)));
    toast({ title: "Status updated", description: `Marked as ${status}` });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selected) return;
    if (file.size > 20 * 1024 * 1024) {
      return toast({ title: "Too large", description: "Max 20MB", variant: "destructive" });
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${selected.user_id}/${selected.id}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("delivered-documents")
        .upload(path, file, { upsert: false });
      if (upErr) throw upErr;

      const { error: updErr } = await supabase
        .from("service_requests")
        .update({
          delivered_file_url: path,
          delivered_at: new Date().toISOString(),
          delivery_note: deliveryNote || null,
          admin_notes: adminNotes || null,
          status: "completed",
        })
        .eq("id", selected.id);
      if (updErr) throw updErr;

      await supabase.from("notifications").insert({
        user_id: selected.user_id,
        title: "Your document is ready",
        message: `Your ${selected.service_type.replace(/_/g, " ")} is now available for download in your dashboard.`,
        type: "success",
        link: "/dashboard",
      });

      toast({ title: "Delivered", description: "Document uploaded and customer notified." });
      setSelected(null);
      fetchItems();
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const saveNotes = async () => {
    if (!selected) return;
    const { error } = await supabase
      .from("service_requests")
      .update({ admin_notes: adminNotes || null, delivery_note: deliveryNote || null })
      .eq("id", selected.id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: "Saved" });
    fetchItems();
  };

  const removeDelivered = async () => {
    if (!selected || !selected.delivered_file_url) return;
    await supabase.storage.from("delivered-documents").remove([selected.delivered_file_url]);
    await supabase
      .from("service_requests")
      .update({ delivered_file_url: null, delivered_at: null, status: "in_progress" })
      .eq("id", selected.id);
    toast({ title: "Removed" });
    setSelected(null);
    fetchItems();
  };

  const downloadCustomerDoc = async (path: string) => {
    const { data, error } = await supabase.storage.from("service-documents").createSignedUrl(path, 60);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    window.open(data.signedUrl, "_blank");
  };

  const filtered = items.filter((i) => {
    const m =
      i.client_name?.toLowerCase().includes(search.toLowerCase()) ||
      i.client_email?.toLowerCase().includes(search.toLowerCase()) ||
      i.service_type?.toLowerCase().includes(search.toLowerCase());
    const s = statusFilter === "all" || i.status === statusFilter;
    return m && s;
  });

  const statusColor = (s: string) =>
    s === "completed"
      ? "bg-green-100 text-green-700"
      : s === "in_progress"
      ? "bg-blue-100 text-blue-700"
      : s === "rejected"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Document Delivery</h1>
          <p className="text-muted-foreground">Upload completed documents and notify customers.</p>
        </div>
        <Button variant="outline" onClick={fetchItems}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">No requests found.</CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((it) => (
            <Card key={it.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="font-semibold capitalize">
                      {it.service_type.replace(/_/g, " ")}
                    </span>
                    <Badge className={statusColor(it.status)}>{it.status}</Badge>
                    {it.delivered_file_url && (
                      <Badge variant="outline" className="text-green-700 border-green-300">
                        Delivered
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {it.client_name} • {it.client_email} • {it.client_phone}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Submitted {new Date(it.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={it.status} onValueChange={(v) => updateStatus(it.id, v)}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={() => openItem(it)}>
                    <Upload className="h-4 w-4 mr-1" /> Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Deliver Document</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="text-sm">
                <p>
                  <strong>Service:</strong> {selected.service_type.replace(/_/g, " ")}
                </p>
                <p>
                  <strong>Customer:</strong> {selected.client_name} ({selected.client_email})
                </p>
                {selected.description && (
                  <p className="mt-2 text-muted-foreground">{selected.description}</p>
                )}
              </div>

              {selected.document_url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadCustomerDoc(selected.document_url!)}
                >
                  <Download className="h-4 w-4 mr-1" /> Customer Upload
                </Button>
              )}

              <div className="space-y-2">
                <Label>Admin notes (visible to customer)</Label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Delivery note</Label>
                <Textarea
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  rows={2}
                  placeholder="Optional message attached to the delivered file"
                />
              </div>

              {selected.delivered_file_url ? (
                <div className="bg-muted p-3 rounded text-sm">
                  <p className="font-medium text-green-700">Already delivered</p>
                  <p className="text-xs text-muted-foreground break-all">
                    {selected.delivered_file_url}
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-2"
                    onClick={removeDelivered}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Remove delivered file
                  </Button>
                </div>
              ) : (
                <div>
                  <Label>Upload completed document</Label>
                  <Input
                    ref={fileRef}
                    type="file"
                    onChange={handleUpload}
                    disabled={uploading}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.zip"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Max 20MB</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>
              Close
            </Button>
            <Button onClick={saveNotes}>
              <Send className="h-4 w-4 mr-1" /> Save notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDocuments;