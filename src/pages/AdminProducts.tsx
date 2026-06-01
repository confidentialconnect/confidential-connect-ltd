import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Plus, Edit, Trash2, Star, Copy, Eye, EyeOff, Upload, Loader2, Search,
} from "lucide-react";

interface Category { id: string; name: string; slug: string }
interface Product {
  id: string; name: string; description: string | null; category: string;
  price: number; discount_price: number | null; image_url: string | null;
  images: string[] | null; video_url: string | null; status: string;
  featured: boolean; tags: string[] | null; whatsapp: string | null;
  external_link: string | null; stock: number | null; sku: string | null;
  in_stock: boolean | null; created_at: string;
}

const empty: Partial<Product> = {
  name: "", description: "", category: "", price: 0, discount_price: null,
  image_url: "", images: [], video_url: "", status: "draft", featured: false,
  tags: [], whatsapp: "", external_link: "", stock: 0, sku: "", in_stock: true,
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Product>>(empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => { document.title = "Products | Admin"; load(); }, []);

  const load = async () => {
    setLoading(true);
    const [p, c] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("product_categories").select("id,name,slug").order("display_order"),
    ]);
    if (p.data) setProducts(p.data as any);
    if (c.data) setCategories(c.data as any);
    setLoading(false);
  };

  const openNew = () => {
    setEditing({ ...empty, category: categories[0]?.slug || "" });
    setTagsInput("");
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setTagsInput((p.tags || []).join(", "));
    setOpen(true);
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      const url = data.publicUrl;
      setEditing((e) => ({
        ...e,
        image_url: e.image_url || url,
        images: [...(e.images || []), url],
      }));
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    setEditing((e) => ({
      ...e,
      images: (e.images || []).filter((i) => i !== url),
      image_url: e.image_url === url ? (e.images || []).filter((i) => i !== url)[0] || "" : e.image_url,
    }));
  };

  const save = async () => {
    if (!editing.name || !editing.category || !editing.price) {
      toast.error("Name, category and price are required");
      return;
    }
    setSaving(true);
    const payload: any = {
      name: editing.name,
      description: editing.description,
      category: editing.category,
      price: Number(editing.price),
      discount_price: editing.discount_price ? Number(editing.discount_price) : null,
      image_url: editing.image_url || (editing.images?.[0] ?? null),
      images: editing.images || [],
      video_url: editing.video_url || null,
      status: editing.status || "draft",
      featured: !!editing.featured,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      whatsapp: editing.whatsapp || null,
      external_link: editing.external_link || null,
      stock: editing.stock ? Number(editing.stock) : 0,
      sku: editing.sku || null,
      in_stock: editing.in_stock ?? true,
    };
    const { error } = editing.id
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editing.id ? "Product updated" : "Product created");
    setOpen(false);
    load();
  };

  const quickUpdate = async (id: string, patch: any, msg: string) => {
    const { error } = await supabase.from("products").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(msg);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  const duplicate = async (p: Product) => {
    const { id, created_at, ...rest } = p as any;
    const { error } = await supabase.from("products").insert({ ...rest, name: `${p.name} (copy)`, status: "draft", featured: false });
    if (error) return toast.error(error.message);
    toast.success("Duplicated");
    load();
  };

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="text-2xl">Product Management</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{products.length} total · {products.filter(p=>p.status==="published").length} published</p>
          </div>
          <Button onClick={openNew} className="gap-2"><Plus className="h-4 w-4" /> Add Product</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search by name or SKU" className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">No products yet. Click "Add Product" to create one.</div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <Card key={p.id} className="overflow-hidden hover:shadow-md transition">
                  <div className="aspect-video bg-muted relative">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No image</div>
                    )}
                    <div className="absolute top-2 left-2 flex gap-1">
                      <Badge variant={p.status === "published" ? "default" : p.status === "archived" ? "secondary" : "outline"}>{p.status}</Badge>
                      {p.featured && <Badge className="bg-amber-500"><Star className="h-3 w-3 mr-1" /> Featured</Badge>}
                    </div>
                  </div>
                  <CardContent className="p-3 space-y-2">
                    <div>
                      <p className="font-semibold text-sm truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{p.category}</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold">₦{Number(p.price).toLocaleString()}</span>
                      {p.discount_price && <span className="text-xs line-through text-muted-foreground">₦{Number(p.discount_price).toLocaleString()}</span>}
                    </div>
                    <div className="flex gap-1 flex-wrap pt-1">
                      <Button size="sm" variant="outline" onClick={()=>openEdit(p)} className="h-7 px-2"><Edit className="h-3 w-3" /></Button>
                      <Button size="sm" variant="outline" onClick={()=>quickUpdate(p.id, { status: p.status === "published" ? "draft" : "published" }, p.status === "published" ? "Unpublished" : "Published")} className="h-7 px-2">
                        {p.status === "published" ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                      <Button size="sm" variant="outline" onClick={()=>quickUpdate(p.id, { featured: !p.featured }, p.featured ? "Unfeatured" : "Featured")} className="h-7 px-2">
                        <Star className={`h-3 w-3 ${p.featured ? "fill-amber-500 text-amber-500" : ""}`} />
                      </Button>
                      <Button size="sm" variant="outline" onClick={()=>duplicate(p)} className="h-7 px-2"><Copy className="h-3 w-3" /></Button>
                      <Button size="sm" variant="outline" onClick={()=>quickUpdate(p.id, { status: "archived" }, "Archived")} className="h-7 px-2 text-xs">Arch</Button>
                      <Button size="sm" variant="outline" onClick={()=>remove(p.id)} className="h-7 px-2 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing.id ? "Edit Product" : "New Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2"><Label>Name *</Label><Input value={editing.name || ""} onChange={(e)=>setEditing({...editing, name: e.target.value})} /></div>
              <div><Label>Category *</Label>
                <Select value={editing.category || ""} onValueChange={(v)=>setEditing({...editing, category: v})}>
                  <SelectTrigger><SelectValue placeholder="Pick one" /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Status</Label>
                <Select value={editing.status || "draft"} onValueChange={(v)=>setEditing({...editing, status: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Price (₦) *</Label><Input type="number" value={editing.price ?? 0} onChange={(e)=>setEditing({...editing, price: Number(e.target.value)})} /></div>
              <div><Label>Discount Price (₦)</Label><Input type="number" value={editing.discount_price ?? ""} onChange={(e)=>setEditing({...editing, discount_price: e.target.value ? Number(e.target.value) : null})} /></div>
              <div><Label>Stock</Label><Input type="number" value={editing.stock ?? 0} onChange={(e)=>setEditing({...editing, stock: Number(e.target.value)})} /></div>
              <div><Label>SKU</Label><Input value={editing.sku || ""} onChange={(e)=>setEditing({...editing, sku: e.target.value})} /></div>
              <div><Label>WhatsApp (e.g. 234704...)</Label><Input value={editing.whatsapp || ""} onChange={(e)=>setEditing({...editing, whatsapp: e.target.value})} /></div>
              <div><Label>External Link</Label><Input value={editing.external_link || ""} onChange={(e)=>setEditing({...editing, external_link: e.target.value})} /></div>
              <div className="sm:col-span-2"><Label>Video URL</Label><Input value={editing.video_url || ""} onChange={(e)=>setEditing({...editing, video_url: e.target.value})} /></div>
              <div className="sm:col-span-2"><Label>Tags (comma separated)</Label><Input value={tagsInput} onChange={(e)=>setTagsInput(e.target.value)} /></div>
              <div className="sm:col-span-2"><Label>Description</Label><Textarea rows={4} value={editing.description || ""} onChange={(e)=>setEditing({...editing, description: e.target.value})} /></div>
            </div>

            <div>
              <Label>Images</Label>
              <div className="flex gap-2 flex-wrap mt-2">
                {(editing.images || []).map((url) => (
                  <div key={url} className="relative h-20 w-20 rounded border overflow-hidden group">
                    <img src={url} className="w-full h-full object-cover" />
                    <button onClick={()=>removeImage(url)} className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs">Remove</button>
                  </div>
                ))}
                <label className="h-20 w-20 rounded border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-muted">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 text-muted-foreground" />}
                  <input type="file" accept="image/*" className="hidden" onChange={(e)=>e.target.files?.[0] && uploadImage(e.target.files[0])} />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={!!editing.featured} onChange={(e)=>setEditing({...editing, featured: e.target.checked})} /> Featured
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={editing.in_stock !== false} onChange={(e)=>setEditing({...editing, in_stock: e.target.checked})} /> In Stock
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Product"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;