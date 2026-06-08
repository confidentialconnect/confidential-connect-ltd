import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Loader2, Tag } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number | null;
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const empty: Partial<Category> = { name: "", slug: "", description: "", display_order: 0 };

const AdminCategories = () => {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Category>>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => { document.title = "Categories | Admin"; load(); }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("product_categories")
      .select("*")
      .order("display_order", { ascending: true });
    setItems((data as any) || []);
    setLoading(false);
  };

  const save = async () => {
    if (!editing.name?.trim()) return toast.error("Name is required");
    setSaving(true);
    const payload: any = {
      name: editing.name!.trim(),
      slug: (editing.slug?.trim() || slugify(editing.name!)),
      description: editing.description || null,
      display_order: Number(editing.display_order) || 0,
    };
    const op = editing.id
      ? supabase.from("product_categories").update(payload).eq("id", editing.id)
      : supabase.from("product_categories").insert(payload);
    const { error } = await op;
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(editing.id ? "Category updated" : "Category created");
    setOpen(false);
    setEditing(empty);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    const { error } = await supabase.from("product_categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Categories</h1>
          <p className="text-sm text-muted-foreground">Organize products and services into categories.</p>
        </div>
        <Button onClick={() => { setEditing(empty); setOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> New Category
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>All Categories ({items.length})</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No categories yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm">
                  <div className="min-w-0 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Tag className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground truncate">/{c.slug}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(c); setOpen(true); }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => del(c.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing.id ? "Edit Category" : "New Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input
                value={editing.name || ""}
                onChange={(e) => setEditing({
                  ...editing,
                  name: e.target.value,
                  slug: editing.id ? editing.slug : slugify(e.target.value),
                })}
              />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </div>
            <div>
              <Label>Display Order</Label>
              <Input
                type="number"
                value={editing.display_order ?? 0}
                onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editing.id ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;