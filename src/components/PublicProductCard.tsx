import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Package } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import servicesBanner from "@/assets/services-banner.jpg";
import originCertificate from "@/assets/origin-certificate.jpg";
import identificationCertificate from "@/assets/identification-certificate.jpg";
import certificatesCollection from "@/assets/certificates-collection.jpg";

export interface CatalogProduct {
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
  in_stock?: boolean | null;
}

const getFallbackImage = (product: CatalogProduct) => {
  const searchText = `${product.name} ${product.category}`.toLowerCase();

  if (searchText.includes("origin")) return originCertificate;
  if (searchText.includes("nin") || searchText.includes("identity")) {
    return identificationCertificate;
  }
  if (searchText.includes("certificate") || searchText.includes("document")) {
    return certificatesCollection;
  }
  return servicesBanner;
};

export const getProductImage = (product: CatalogProduct) => {
  return product.image_url || product.images?.find(Boolean) || getFallbackImage(product);
};

export const getProductPrice = (product: CatalogProduct) => {
  return product.discount_price && product.discount_price > 0
    ? product.discount_price
    : product.price;
};

interface PublicProductCardProps {
  product: CatalogProduct;
}

export const PublicProductCard = ({ product }: PublicProductCardProps) => {
  const { addItem } = useCart();
  const price = getProductPrice(product);
  const hasDiscount = Boolean(
    product.discount_price && product.discount_price > 0 && product.price > product.discount_price,
  );
  const inStock = product.in_stock !== false;

  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col">
      <Link
        to={`/product/${product.id}`}
        className="block aspect-video bg-muted relative overflow-hidden"
      >
        <img
          src={getProductImage(product)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = servicesBanner;
          }}
        />
        {hasDiscount && <Badge variant="destructive" className="absolute top-2 left-2">SALE</Badge>}
        {!inStock && <Badge variant="secondary" className="absolute top-2 right-2">Unavailable</Badge>}
      </Link>

      <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary" className="text-xs truncate max-w-[70%]">
            {product.category}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span>4.8</span>
          </div>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold line-clamp-1 font-display hover:text-primary">{product.name}</h3>
        </Link>
        <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">
          {product.description || "Professional service delivered by Confidential Connect Ltd."}
        </p>

        <div className="flex items-end justify-between pt-1 mt-auto">
          <div>
            <p className="text-lg font-bold text-primary">₦{Number(price).toLocaleString()}</p>
            {hasDiscount && (
              <p className="text-xs text-muted-foreground line-through">
                ₦{Number(product.price).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button asChild size="sm" variant="outline" className="flex-1">
            <Link to={`/product/${product.id}`}>View</Link>
          </Button>
          <Button
            size="sm"
            className="flex-1"
            disabled={!inStock}
            onClick={() => {
              addItem({ id: product.id, name: product.name, price }, 1);
              toast.success(`${product.name} added to cart`);
            }}
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1" /> Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const ProductImagePlaceholder = () => (
  <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
    <Package className="h-10 w-10" />
  </div>
);

export default PublicProductCard;