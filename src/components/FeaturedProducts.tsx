import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { CatalogProduct, PublicProductCard } from "@/components/PublicProductCard";

export const FeaturedProducts = () => {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.functions.invoke("public-catalog");
      const all = (((data as any)?.products as CatalogProduct[]) || []);
      const featured = all.filter((p) => p.featured);
      setProducts((featured.length > 0 ? featured : all).slice(0, 8));
      setLoading(false);
    })();
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4 font-body">
            Featured
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 font-display text-foreground">
            Featured Products &amp; Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
            Hand-picked services and documents trusted by thousands of students and clients.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products.map((product) => (
            <PublicProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Button asChild size="lg" variant="outline">
            <Link to="/products">
              Browse All Products <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;