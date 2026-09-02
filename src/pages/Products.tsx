import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, Package, Loader2 } from "lucide-react";
import { CatalogProduct, PublicProductCard } from "@/components/PublicProductCard";

interface Category { id: string; name: string; slug: string }

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [maxPrice, setMaxPrice] = useState<string>("");

  useEffect(() => {
    document.title = "Shop | Confidential Connect Ltd";
    (async () => {
      const { data } = await supabase.functions.invoke("public-catalog");
      setProducts(((data as any)?.products as CatalogProduct[]) || []);
      setCategories(((data as any)?.categories as Category[]) || []);
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
              {filtered.map((product) => (
                <PublicProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;