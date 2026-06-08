import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowRight, Star, Package } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

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
}

export const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("products")
        .select("id,name,description,price,discount_price,image_url,images,category,featured,status")
        .eq("status", "published")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(8);
      setProducts((data as any) || []);
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
          {(loading ? Array.from({ length: 4 }) : products).map((p: any, i: number) => (
            <Card key={p?.id ?? i} className="overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="aspect-video bg-muted relative overflow-hidden">
                {p?.image_url || (p?.images && p.images[0]) ? (
                  <img
                    src={p.image_url || p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Package className="h-10 w-10" />
                  </div>
                )}
                {p?.discount_price && p?.price > p.discount_price && (
                  <Badge className="absolute top-2 left-2 bg-destructive">SALE</Badge>
                )}
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  {p?.category && <Badge variant="secondary" className="text-xs">{p.category}</Badge>}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-primary text-primary" /> 4.8
                  </div>
                </div>
                <h3 className="font-semibold line-clamp-1 font-display">{p?.name || "Loading..."}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{p?.description}</p>
                <div className="flex items-end justify-between pt-1">
                  <div>
                    {p?.discount_price ? (
                      <>
                        <p className="text-lg font-bold text-primary">₦{Number(p.discount_price).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground line-through">₦{Number(p.price).toLocaleString()}</p>
                      </>
                    ) : (
                      <p className="text-lg font-bold text-primary">{p ? `₦${Number(p.price).toLocaleString()}` : ""}</p>
                    )}
                  </div>
                </div>
                {p && (
                  <div className="flex gap-2 pt-2">
                    <Button asChild size="sm" variant="outline" className="flex-1">
                      <Link to={`/product/${p.id}`}>View</Link>
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        addItem({ id: p.id, name: p.name, price: p.discount_price || p.price });
                        toast.success("Added to cart");
                      }}
                    >
                      <ShoppingCart className="h-3.5 w-3.5 mr-1" /> Add
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
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