import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search as SearchIcon, Store, Package, GraduationCap, MapPin, BadgeCheck, Loader2 } from "lucide-react";
import { NIGERIAN_STATES, BUSINESS_CATEGORIES } from "@/data/nigerianStates";

type Business = {
  id: string; name: string; category: string; short_description: string | null; description: string | null;
  state: string | null; city: string | null; logo_url: string | null; verified: boolean; promotion_tier: number;
};
type Product = {
  id: string; name: string; description: string | null; price: number; discount_price: number | null;
  image_url: string | null; category: string; featured: boolean;
};
type PinProduct = {
  id: string; slug: string; name: string; description: string | null; retail_price: number;
};

const NGN = (n: number) => `₦${Number(n).toLocaleString()}`;
const matches = (needle: string, ...fields: (string | null | undefined)[]) => {
  if (!needle) return true;
  const hay = fields.filter(Boolean).join(" ").toLowerCase();
  return hay.includes(needle.toLowerCase());
};

const SearchPage = () => {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("category") || "all");
  const [stateFilter, setStateFilter] = useState(params.get("state") || "all");
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [pins, setPins] = useState<PinProduct[]>([]);

  useEffect(() => {
    document.title = q
      ? `Search results for "${q}" — Confidential Connect Ltd`
      : "Search — Confidential Connect Ltd";
  }, [q]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [b, p, pin] = await Promise.all([
        supabase.from("businesses")
          .select("id,name,category,short_description,description,state,city,logo_url,verified,promotion_tier")
          .eq("status", "approved")
          .order("promotion_tier", { ascending: false })
          .limit(200),
        supabase.from("products")
          .select("id,name,description,price,discount_price,image_url,category,featured")
          .eq("status", "published")
          .order("featured", { ascending: false })
          .limit(200),
        supabase.from("pin_products")
          .select("id,slug,name,description,retail_price")
          .eq("is_active", true)
          .order("sort_order", { ascending: true }),
      ]);
      setBusinesses((b.data as Business[]) || []);
      setProducts((p.data as Product[]) || []);
      setPins((pin.data as PinProduct[]) || []);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (category !== "all") next.set("category", category);
    if (stateFilter !== "all") next.set("state", stateFilter);
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, category, stateFilter]);

  const filteredBusinesses = useMemo(() => businesses.filter((b) => {
    if (category !== "all" && b.category !== category) return false;
    if (stateFilter !== "all" && b.state !== stateFilter) return false;
    return matches(q, b.name, b.category, b.short_description, b.description, b.city, b.state);
  }), [businesses, q, category, stateFilter]);

  const filteredProducts = useMemo(() => products.filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    return matches(q, p.name, p.description, p.category);
  }), [products, q, category]);

  const filteredPins = useMemo(() => pins.filter((p) => matches(q, p.name, p.description, p.slug)), [pins, q]);

  const total = filteredBusinesses.length + filteredProducts.length + filteredPins.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Search</h1>
            <p className="text-muted-foreground">Find approved businesses, products, and instant PINs.</p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-[1fr_200px_200px] gap-3">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, keyword, service, category..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="pl-9 h-11"
                />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-11"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {BUSINESS_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger className="h-11"><SelectValue placeholder="State" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {NIGERIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">{total} result{total === 1 ? "" : "s"} found</p>

              <Tabs defaultValue="all" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="all">All ({total})</TabsTrigger>
                  <TabsTrigger value="businesses">Businesses ({filteredBusinesses.length})</TabsTrigger>
                  <TabsTrigger value="products">Products ({filteredProducts.length})</TabsTrigger>
                  <TabsTrigger value="pins">PINs ({filteredPins.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-8">
                  {filteredBusinesses.length > 0 && <BusinessGrid items={filteredBusinesses} />}
                  {filteredProducts.length > 0 && <ProductGrid items={filteredProducts} />}
                  {filteredPins.length > 0 && <PinGrid items={filteredPins} />}
                  {total === 0 && <EmptyState />}
                </TabsContent>
                <TabsContent value="businesses">
                  {filteredBusinesses.length > 0 ? <BusinessGrid items={filteredBusinesses} /> : <EmptyState />}
                </TabsContent>
                <TabsContent value="products">
                  {filteredProducts.length > 0 ? <ProductGrid items={filteredProducts} /> : <EmptyState />}
                </TabsContent>
                <TabsContent value="pins">
                  {filteredPins.length > 0 ? <PinGrid items={filteredPins} /> : <EmptyState />}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const EmptyState = () => (
  <Card><CardContent className="text-center py-12">
    <SearchIcon className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
    <h3 className="font-semibold mb-1">No results</h3>
    <p className="text-sm text-muted-foreground">Try different keywords or clear your filters.</p>
  </CardContent></Card>
);

const BusinessGrid = ({ items }: { items: Business[] }) => (
  <div>
    <h2 className="font-semibold mb-3 flex items-center gap-2"><Store className="h-4 w-4" /> Businesses</h2>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((b) => (
        <Card key={b.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex gap-3">
            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
              {b.logo_url ? <img src={b.logo_url} alt={b.name} className="h-full w-full object-cover" /> : <Store className="h-5 w-5 text-muted-foreground" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <Link to={`/business/${b.id}`} className="font-semibold hover:text-primary truncate">{b.name}</Link>
                {b.verified && <BadgeCheck className="h-4 w-4 text-primary shrink-0" />}
              </div>
              <Badge variant="secondary" className="text-[10px] mt-1">{b.category}</Badge>
              {(b.city || b.state) && (
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />{[b.city, b.state].filter(Boolean).join(", ")}
                </p>
              )}
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{b.short_description || b.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const ProductGrid = ({ items }: { items: Product[] }) => (
  <div>
    <h2 className="font-semibold mb-3 flex items-center gap-2"><Package className="h-4 w-4" /> Products</h2>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((p) => {
        const price = p.discount_price || p.price;
        return (
          <Card key={p.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <Link to={`/product/${p.id}`} className="block aspect-video bg-muted">
              {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : (
                <div className="w-full h-full flex items-center justify-center"><Package className="h-8 w-8 text-muted-foreground" /></div>
              )}
            </Link>
            <CardContent className="p-3">
              <Badge variant="secondary" className="text-[10px]">{p.category}</Badge>
              <Link to={`/product/${p.id}`} className="block font-semibold text-sm mt-2 line-clamp-1 hover:text-primary">{p.name}</Link>
              <p className="text-primary font-bold mt-1">{NGN(price)}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  </div>
);

const PinGrid = ({ items }: { items: PinProduct[] }) => (
  <div>
    <h2 className="font-semibold mb-3 flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Instant Result PINs</h2>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <Card key={p.id} className="p-4 hover:shadow-md transition-shadow">
          <h3 className="font-semibold">{p.name}</h3>
          {p.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>}
          <div className="mt-2 text-primary font-bold">{NGN(p.retail_price)}</div>
          <Button asChild size="sm" className="mt-3 w-full">
            <Link to={`/buy-pin?slug=${p.slug}`}>Buy Now</Link>
          </Button>
        </Card>
      ))}
    </div>
  </div>
);

export default SearchPage;