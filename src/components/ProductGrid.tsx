import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { CatalogProduct, PublicProductCard } from "@/components/PublicProductCard";
import { Link } from "react-router-dom";

export const ProductGrid = () => {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    void (async () => {
      const { data } = await supabase.functions.invoke("public-catalog");
      setProducts(((data as any)?.products as CatalogProduct[]) || []);
      setLoading(false);
    })();
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((product) => product.category)))],
    [products],
  );
  const filtered = products.filter(
    (product) => selectedCategory === "All" || product.category === selectedCategory,
  );

  return (
    <section id="products" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4 font-body">Products & Pricing</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 font-display text-foreground">
            Our Products & Services
          </h2>
          <div className="line-gold mx-auto mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body leading-relaxed">
            Comprehensive educational services and products to support your academic journey.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`font-body text-sm tracking-wide ${selectedCategory === category ? "gradient-gold text-primary-foreground shadow-gold" : ""}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filtered.map((product) => (
            <PublicProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-foreground rounded-2xl p-10 max-w-2xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
            <h3 className="text-2xl font-bold mb-3 text-background font-display">Need Help Choosing?</h3>
            <p className="text-background/60 mb-6 font-body">
              Our team of experts is ready to help you find the perfect solution.
            </p>
            <Button asChild size="lg" className="gradient-gold text-primary-foreground shadow-gold font-body font-semibold">
              <Link to="/contact">
                Get Expert Consultation
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
