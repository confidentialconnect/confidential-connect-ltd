import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GraduationCap, Zap, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type PinProduct = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  retail_price: number;
  sort_order: number;
};

const NGN = (n: number) => `₦${Number(n).toLocaleString()}`;

export const InstantPinsBanner = () => {
  const [pins, setPins] = useState<PinProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("pin_products")
        .select("id,slug,name,description,retail_price,sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      setPins((data as PinProduct[]) || []);
      setLoading(false);
    })();
  }, []);

  return (
    <section className="py-12 bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-wide">
              <GraduationCap className="h-5 w-5" /> Instant Result PINs
            </div>
            <h2 className="mt-2 text-2xl md:text-3xl font-bold">
              Buy WAEC, NECO, NABTEB &amp; more — delivered in seconds
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Pay securely with Paystack and receive your PIN &amp; Serial on-screen and by email immediately. Available 24/7.
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Zap className="h-4 w-4 text-primary" /> Instant delivery</span>
              <span className="inline-flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-primary" /> Secure payment</span>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : pins.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-sm text-muted-foreground">No PIN products available right now.</p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pins.map((p) => (
                <Card key={p.id} className="p-5 flex flex-col hover:shadow-lg transition-shadow">
                  <h3 className="font-semibold">{p.name}</h3>
                  {p.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                  )}
                  <div className="mt-3 text-primary font-bold text-xl">{NGN(p.retail_price)}</div>
                  <Button asChild size="sm" className="mt-4 w-full">
                    <Link to={`/buy-pin?slug=${p.slug}`}>Buy Now</Link>
                  </Button>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Button asChild size="lg" variant="outline">
              <Link to="/buy-pin">See all PIN products →</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstantPinsBanner;