import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Search, ShoppingCart, Star, Package, Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  image_url: string | null;
  images: string[] | null;
  category: string;
  featured: boolean;
  status: string;
  created_at: string | null;
}

interface Category { id: string; name: string; slug: string }

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const { addItem } = useCart();

  useEffect(() => {
    document.title = "Shop | Confidential Connect Ltd";
    (async () => {
      const [p, c] = await Promise.all([
        supabase.from("products").select("*").eq("status", "published"),
        supabase.from("product_categories").select("id,name,slug").order("display_order"),
      ]);
      setProducts((p.data as any) || []);
      setCategories((c.data as any) || []);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (category && category !== "all") next.set("category", category); else next.delete("category");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
      );
    }
    if (maxPrice) {
      const m = Number(maxPrice);
      if (!isNaN(m)) list = list.filter((p) => (p.discount_price || p.price) <= m);
    }
    switch (sort) {
      case "price-asc": list.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price)); break;
      case "price-desc": list.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price)); break;
      case "name": list.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: list.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
    }
    return list;
  }, [products, category, search, sort, maxPrice]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">Shop Products &amp; Services</h1>
            <p className="text-muted-foreground">
              Browse our full catalog of verified documents, services, and educational products.
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger><SelectValue placeholder="Sort" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name (A–Z)</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Max price (₦)"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="md:col-span-1"
              />
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : filtered.length === 0 ? (
            <Card><CardContent className="text-center py-20">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="font-semibold mb-1">No products found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your filters or check back later.</p>
            </CardContent></Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((p) => {
                const img = p.image_url || (p.images && p.images[0]) || "";
                const finalPrice = p.discount_price || p.price;
                return (
                  <Card key={p.id} className="overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-1">
                    <Link to={`/product/${p.id}`} className="block aspect-video bg-muted relative overflow-hidden">
                      {img ? (
                        <img src={img} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Package className="h-10 w-10" />
                        </div>
                      )}
                      {p.featured && <Badge className="absolute top-2 right-2">Featured</Badge>}
                      {p.discount_price && p.price > p.discount_price && (
                        <Badge className="absolute top-2 left-2 bg-destructive">SALE</Badge>
                      )}
                    </Link>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">{p.category}</Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-primary text-primary" /> 4.8
                        </div>
                      </div>
                      <Link to={`/product/${p.id}`}>
                        <h3 className="font-semibold line-clamp-1 font-display hover:text-primary">{p.name}</h3>
                      </Link>
                      <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">{p.description}</p>
                      <div className="flex items-end justify-between pt-1">
                        <div>
                          {p.discount_price ? (
                            <>
                              <p className="text-lg font-bold text-primary">₦{Number(p.discount_price).toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground line-through">₦{Number(p.price).toLocaleString()}</p>
                            </>
                          ) : (
                            <p className="text-lg font-bold text-primary">₦{Number(p.price).toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button asChild size="sm" variant="outline" className="flex-1">
                          <Link to={`/product/${p.id}`}>View</Link>
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            addItem({ id: p.id, name: p.name, price: finalPrice });
                            toast.success(`${p.name} added to cart`);
                          }}
                        >
                          <ShoppingCart className="h-3.5 w-3.5 mr-1" /> Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;