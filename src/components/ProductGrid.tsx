import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Clock, CheckCircle, FileText, GraduationCap, Shield, CreditCard, Home, Coffee, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const products = [
  { id: 1, name: "WAEC Scratch Card", description: "Official WAEC result checker pin for instant result verification.", price: 4200, category: "Educational", icon: FileText, rating: 4.9, inStock: true, features: ["Instant delivery", "Valid for all years", "24/7 support"] },
  { id: 2, name: "Result Checker", description: "Authentic NECO scratch card token for checking SSCE results.", price: 500, category: "Educational", icon: GraduationCap, rating: 4.8, inStock: true, features: ["Fast verification", "Secure access", "24/7 support"] },
  { id: 3, name: "NABTEB Scratch Card", description: "NABTEB result checker for vocational education.", price: 1600, category: "Educational", icon: Shield, rating: 4.7, inStock: true, features: ["Technical education", "Business studies", "24/7 support"] },
  { id: 4, name: "GCE Result Checker", description: "GCE result verification token for advanced level examinations.", price: 500, category: "Educational", icon: Star, rating: 4.9, inStock: true, features: ["Advanced level", "Quick delivery", "24/7 support"] },
  { id: 5, name: "WAEC Certificate", description: "Official WAEC certificate collection and verification service.", price: 12000, category: "Documentation", icon: FileText, rating: 4.8, inStock: true, features: ["Authentication", "Fast processing", "24/7 support"] },
  { id: 6, name: "University Registration", description: "Complete university enrollment support with expert guidance.", price: 7000, category: "Educational", icon: GraduationCap, rating: 4.9, inStock: true, features: ["Complete support", "Expert guidance", "24/7 support"] },
  { id: 7, name: "Post-UTME Registration", description: "Post-UTME exam registration and preparation support.", price: 6000, category: "Educational", icon: Clock, rating: 4.8, inStock: true, features: ["Exam registration", "Preparation tips", "24/7 support"] },
  { id: 8, name: "NIN Retrieval Service", description: "Fast and secure National Identification Number retrieval.", price: 3500, category: "Identity", icon: Shield, rating: 4.9, inStock: true, features: ["Secure process", "Identity verification", "24/7 support"] },
  { id: 21, name: "Birth Certificate", description: "Official birth certificate documentation with authentication.", price: 5000, category: "Documentation", icon: FileText, rating: 4.9, inStock: true, features: ["Official documentation", "Authentication included", "Fast processing"] },
  { id: 22, name: "State of Origin Certificate", description: "State of origin certificate with government endorsement.", price: 12000, category: "Documentation", icon: Shield, rating: 4.8, inStock: true, features: ["Government endorsed", "Official verification", "Secure processing"] },
  { id: 10, name: "School Fees Payment", description: "Convenient school fees payment service.", price: 2000, category: "Payment", icon: CreditCard, rating: 4.6, inStock: true, features: ["Multiple institutions", "Instant confirmation", "24/7 support"] },
  { id: 11, name: "Hostel Booking", description: "University hostel accommodation booking service.", price: 20000, category: "Accommodation", icon: Home, rating: 4.5, inStock: true, features: ["Room selection", "Instant booking", "24/7 support"] },
];

export const ProductGrid = () => {
  const categories = ["All", "Educational", "Documentation", "Identity", "Payment", "Accommodation"];
  const { addItem } = useCart();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  const filtered = products.filter((p) => selectedCategory === "All" || p.category === selectedCategory);

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
          {filtered.map((product) => {
            const Icon = product.icon;
            return (
              <Card key={product.id} className="bg-card border-border hover-gold transition-all duration-300 hover:-translate-y-1 group">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 bg-accent rounded-xl group-hover:bg-primary/10 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-xs bg-accent text-primary border border-primary/10 font-body">
                      {product.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-display">{product.name}</CardTitle>
                  <CardDescription className="text-sm line-clamp-2 font-body">{product.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-primary font-display">
                      ₦{product.price.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-primary fill-primary" />
                      <span className="text-sm text-muted-foreground font-body">{product.rating}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {product.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-muted-foreground font-body">
                        <CheckCircle className="h-3.5 w-3.5 text-primary mr-2 shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button
                    className="w-full gradient-gold text-primary-foreground font-body font-semibold hover:opacity-90"
                    disabled={!product.inStock}
                    onClick={() => {
                      addItem({ id: product.id, name: product.name, price: product.price }, 1);
                      toast({ title: "Added to cart", description: `${product.name} added to your cart.` });
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
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
