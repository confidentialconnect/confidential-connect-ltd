import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

const Wishlist = () => {
  const { addItem } = useCart();
  const { toast } = useToast();
  
  // Mock wishlist data - in real app, this would come from user's saved items
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: "1",
      name: "Complete Cybersecurity Audit",
      description: "Comprehensive security assessment for your business",
      price: 250000,
      image: "/lovable-uploads/844d6332-7434-4200-93de-bb9fa92f86e9.png",
      inStock: true,
      category: "Security"
    },
    {
      id: "2",
      name: "Custom Software Development",
      description: "Tailored software solutions for your business needs",
      price: 500000,
      image: "/placeholder.svg",
      inStock: true,
      category: "Software"
    }
  ]);

  const handleRemoveFromWishlist = (id: string) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
    toast({
      title: "Removed from wishlist",
      description: "Item has been removed from your wishlist.",
    });
  };

  const handleAddToCart = (item: any) => {
    addItem({
      id: parseInt(item.id),
      name: item.name,
      price: item.price
    });
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const handleMoveAllToCart = () => {
    wishlistItems.forEach(item => {
      addItem({
        id: parseInt(item.id),
        name: item.name,
        price: item.price
      });
    });
    setWishlistItems([]);
    toast({
      title: "Moved to cart",
      description: "All wishlist items have been added to your cart.",
    });
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
              <p className="text-muted-foreground">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            {wishlistItems.length > 0 && (
              <Button onClick={handleMoveAllToCart} className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Move All to Cart
              </Button>
            )}
          </div>

          {/* Wishlist Content */}
          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">
                Save items you love to your wishlist for later
              </p>
              <Button asChild>
                <Link to="/categories">
                  Explore Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="hover-lift">
                  <CardHeader className="pb-4">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Badge variant="secondary" className="mb-2">
                          {item.category}
                        </Badge>
                        <CardTitle className="text-lg leading-tight">
                          {item.name}
                        </CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground text-sm mb-4">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-primary">
                        ₦{item.price.toLocaleString()}
                      </span>
                      <Badge variant={item.inStock ? "default" : "destructive"}>
                        {item.inStock ? "Available" : "Out of Stock"}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.inStock}
                        className="flex-1"
                        size="sm"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/product/${item.id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;