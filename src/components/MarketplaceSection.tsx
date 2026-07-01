import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Phone, MessageCircle, Globe, BadgeCheck, Sparkles, Store } from "lucide-react";
import { NIGERIAN_STATES, BUSINESS_CATEGORIES } from "@/data/nigerianStates";

interface Business {
  id: string;
  name: string;
  category: string;
  short_description: string | null;
  description: string | null;
  state: string | null;
  city: string | null;
  phone: string | null;
  whatsapp: string | null;
  website: string | null;
  logo_url: string | null;
  verified: boolean;
  promotion_tier: number;
  status: string;
}

const tierLabel = (tier: number): { label: string; className: string } | null => {
  if (tier >= 3) return { label: "Promoted with Link", className: "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0" };
  if (tier === 2) return { label: "Featured", className: "bg-gradient-to-r from-primary to-purple-700 text-white border-0" };
  if (tier === 1) return { label: "Promoted", className: "bg-primary/10 text-primary border-primary/20" };
  return null;
};

export const MarketplaceSection = () => {
  const [items, setItems] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [stateFilter, setStateFilter] = useState<string>("all");

  const load = async () => {
    const { data } = await supabase
      .from("businesses")
      .select("id,name,category,short_description,description,state,city,phone,whatsapp,website,logo_url,verified,promotion_tier,status")
      .eq("status", "approved")
      .order("promotion_tier", { ascending: false })
      .order("sort_boost", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(120);
    setItems((data ?? []) as Business[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("public-businesses")
      .on("postgres_changes", { event: "*", schema: "public", table: "businesses" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((b) => {
      if (category !== "all" && b.category !== category) return false;
      if (stateFilter !== "all" && b.state !== stateFilter) return false;
      if (needle) {
        const hay = `${b.name} ${b.category} ${b.short_description ?? ""} ${b.description ?? ""} ${b.city ?? ""} ${b.state ?? ""}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [items, q, category, stateFilter]);

  const waLink = (b: Business) => {
    const num = (b.whatsapp || b.phone || "").replace(/[^\d]/g, "");
    if (!num) return null;
    const normalized = num.startsWith("0") ? "234" + num.slice(1) : num;
    const msg = encodeURIComponent(`Hi ${b.name}, I found you on Confidential Connect Ltd marketplace.`);
    return `https://wa.me/${normalized}?text=${msg}`;
  };

  const track = (id: string, metric: "whatsapp_clicks" | "link_clicks") => {
    supabase.rpc("increment_business_metric", { _business_id: id, _metric: metric });
  };

  return (
    <section id="marketplace" className="py-16 md:py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            <Store className="h-3.5 w-3.5" /> Live Marketplace
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">
            Discover Verified Businesses & Services
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse trusted businesses across Nigeria. Promoted listings appear first.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="max-w-4xl mx-auto mb-8 grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search businesses, services, categories..."
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
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-56 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="max-w-lg mx-auto">
            <CardContent className="p-8 text-center">
              <Store className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <h3 className="font-semibold mb-1">No businesses found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {items.length === 0
                  ? "Approved businesses will appear here as soon as they're added."
                  : "Try adjusting your filters or search terms."}
              </p>
              <Button asChild size="sm"><Link to="/advertising">List Your Business</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((b) => {
              const tier = tierLabel(b.promotion_tier);
              const wa = waLink(b);
              return (
                <Card key={b.id} className="group overflow-hidden hover:shadow-lg transition-all border-border/60 flex flex-col">
                  <div className="relative bg-gradient-to-br from-primary/5 to-purple-500/5 p-4 flex items-center gap-3 border-b">
                    <div className="h-14 w-14 rounded-lg bg-background border shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                      {b.logo_url ? (
                        <img src={b.logo_url} alt={b.name} className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <Store className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-semibold truncate">{b.name}</h3>
                        {b.verified && <BadgeCheck className="h-4 w-4 text-primary shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{b.category}</p>
                    </div>
                    {tier && (
                      <Badge className={`absolute top-2 right-2 text-[10px] px-1.5 py-0.5 ${tier.className}`}>
                        <Sparkles className="h-2.5 w-2.5 mr-0.5" /> {tier.label}
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-4 flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3 min-h-[2.5rem]">
                      {b.short_description || b.description || "Trusted business on Confidential Connect Ltd marketplace."}
                    </p>

                    {(b.city || b.state) && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{[b.city, b.state].filter(Boolean).join(", ")}</span>
                      </div>
                    )}

                    <div className="mt-auto grid grid-cols-2 gap-2">
                      {wa ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                          asChild
                          onClick={() => track(b.id, "whatsapp_clicks")}
                        >
                          <a href={wa} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="h-3.5 w-3.5 mr-1" /> Contact
                          </a>
                        </Button>
                      ) : b.phone ? (
                        <Button size="sm" variant="outline" asChild>
                          <a href={`tel:${b.phone}`}><Phone className="h-3.5 w-3.5 mr-1" /> Call</a>
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled><Phone className="h-3.5 w-3.5 mr-1" /> Contact</Button>
                      )}
                      <Button size="sm" asChild>
                        <Link to={`/business/${b.id}`}>View Details</Link>
                      </Button>
                    </div>

                    {b.website && b.promotion_tier >= 3 && (
                      <a
                        href={b.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => track(b.id, "link_clicks")}
                        className="mt-2 flex items-center justify-center gap-1 text-xs text-primary hover:underline"
                      >
                        <Globe className="h-3 w-3" /> Visit Website
                      </a>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="text-center mt-10">
          <Button asChild size="lg" variant="outline">
            <Link to="/advertising">Promote Your Business →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MarketplaceSection;