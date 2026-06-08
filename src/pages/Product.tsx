import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import {
  ArrowLeft, ShoppingCart, Check, Star, Package, Loader2, Share2, MessageCircle,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  image_url: string | null;
  images: string[] | null;
  video_url: string | null;
  category: string;
  featured: boolean;
  status: string;
  tags: string[] | null;
  whatsapp: string | null;
  external_link: string | null;
  stock: number | null;
  sku: string | null;
  in_stock: boolean | null;
}

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
      setProduct((data as any) || null);
      if (data) document.title = `${(data as any).name} | Confidential Connect Ltd`;
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16 container mx-auto px-4 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Product not found</h1>
          <p className="text-muted-foreground mb-6">This product may have been removed or is unavailable.</p>
          <Button asChild><Link to="/products"><ArrowLeft className="h-4 w-4 mr-2" />Browse Products</Link></Button>
        </main>
        <Footer />
      </div>
    );
  }

  const images = [product.image_url, ...(product.images || [])].filter(Boolean) as string[];
  const finalPrice = product.discount_price || product.price;
  const inStock = product.in_stock !== false && product.status === "published";

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: product.name, url }); } catch {}
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gallery */}
            <div className="space-y-3">
              <div className="aspect-square bg-muted rounded-xl overflow-hidden">
                {images[activeImage] ? (
                  <img src={images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Package className="h-16 w-16" />
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`aspect-square rounded-md overflow-hidden border-2 ${i === activeImage ? "border-primary" : "border-transparent"}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              {product.video_url && (
                <video src={product.video_url} controls className="w-full rounded-lg" />
              )}
            </div>

            {/* Info */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">{product.category}</Badge>
                {product.featured && <Badge>Featured</Badge>}
                {!inStock && <Badge variant="destructive">Out of Stock</Badge>}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold font-display">{product.name}</h1>
              <div className="flex items-center gap-2">
                {[1,2,3,4,5].map((s) => <Star key={s} className="h-4 w-4 fill-primary text-primary" />)}
                <span className="text-sm text-muted-foreground">Trusted by hundreds of clients</span>
              </div>

              <div className="flex items-baseline gap-3">
                <p className="text-3xl md:text-4xl font-bold text-primary">₦{Number(finalPrice).toLocaleString()}</p>
                {product.discount_price && product.price > product.discount_price && (
                  <p className="text-lg text-muted-foreground line-through">₦{Number(product.price).toLocaleString()}</p>
                )}
              </div>

              {product.description && (
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</p>
              )}

              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map((t) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                </div>
              )}

              <Separator />

              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-md">
                  <Button variant="ghost" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</Button>
                  <span className="w-10 text-center">{quantity}</span>
                  <Button variant="ghost" size="sm" onClick={() => setQuantity(quantity + 1)}>+</Button>
                </div>
                <Button
                  size="lg"
                  className="flex-1"
                  disabled={!inStock}
                  onClick={() => {
                    addItem({ id: product.id, name: product.name, price: finalPrice }, quantity);
                    toast.success(`${product.name} added to cart`);
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.whatsapp && (
                  <Button asChild variant="outline">
                    <a href={`https://wa.me/${product.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer">
                      <MessageCircle className="h-4 w-4 mr-2" /> Chat on WhatsApp
                    </a>
                  </Button>
                )}
                {product.external_link && (
                  <Button asChild variant="outline">
                    <a href={product.external_link} target="_blank" rel="noreferrer">More info</a>
                  </Button>
                )}
                <Button variant="ghost" onClick={share}>
                  <Share2 className="h-4 w-4 mr-2" /> Share
                </Button>
              </div>

              <Card>
                <CardContent className="p-4 grid grid-cols-2 gap-3 text-sm">
                  {product.sku && <><span className="text-muted-foreground">SKU</span><span className="font-medium">{product.sku}</span></>}
                  <span className="text-muted-foreground">Availability</span>
                  <span className="font-medium flex items-center gap-1">
                    {inStock ? <><Check className="h-3.5 w-3.5 text-green-600" /> In stock</> : "Unavailable"}
                  </span>
                  {product.stock !== null && product.stock !== undefined && (
                    <><span className="text-muted-foreground">Stock</span><span className="font-medium">{product.stock}</span></>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;