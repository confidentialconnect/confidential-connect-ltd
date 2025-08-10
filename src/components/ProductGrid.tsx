import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Clock, CheckCircle, FileText, GraduationCap, Shield, CreditCard, Home, Coffee } from "lucide-react";

const products = [
  {
    id: 1,
    name: "WAEC Scratch Card",
    description: "Official WAEC result checker pin for instant result verification. Valid for current and previous years.",
    price: 4500,
    category: "Educational",
    icon: FileText,
    rating: 4.9,
    inStock: true,
    features: ["Instant delivery", "Valid for all years", "24/7 support"]
  },
  {
    id: 2,
    name: "NECO Result Checker",
    description: "Authentic NECO scratch card token for checking Senior Secondary Certificate Examination results.",
    price: 1000,
    category: "Educational",
    icon: GraduationCap,
    rating: 4.8,
    inStock: true,
    features: ["Fast verification", "Secure access", "24/7 support"]
  },
  {
    id: 3,
    name: "NABTEB Scratch Card",
    description: "National Business and Technical Examinations Board result checker for vocational education.",
    price: 2000,
    category: "Educational",
    icon: Shield,
    rating: 4.7,
    inStock: true,
    features: ["Technical education", "Business studies", "24/7 support"]
  },
  {
    id: 4,
    name: "GCE Result Checker",
    description: "General Certificate of Education (GCE) result verification token for advanced level examinations.",
    price: 2000,
    category: "Educational",
    icon: Star,
    rating: 4.9,
    inStock: true,
    features: ["Advanced level", "Quick delivery", "24/7 support"]
  },
  {
    id: 5,
    name: "WAEC Certificate",
    description: "Official WAEC certificate collection and verification service with authentication guarantee.",
    price: 15000,
    category: "Documentation",
    icon: FileText,
    rating: 4.8,
    inStock: true,
    features: ["Authentication", "Fast processing", "24/7 support"]
  },
  {
    id: 6,
    name: "University Registration",
    description: "Complete university enrollment support including form filling, document submission, and guidance.",
    price: 7000,
    category: "Educational",
    icon: GraduationCap,
    rating: 4.9,
    inStock: true,
    features: ["Complete support", "Expert guidance", "24/7 support"]
  },
  {
    id: 7,
    name: "Polytechnic Enrollment",
    description: "Comprehensive polytechnic admission support with application processing and document verification.",
    price: 7000,
    category: "Educational",
    icon: Shield,
    rating: 4.7,
    inStock: true,
    features: ["Application support", "Document help", "24/7 support"]
  },
  {
    id: 8,
    name: "Post-UTME Registration",
    description: "Post-UTME examination registration and preparation support for university admission screening.",
    price: 8000,
    category: "Educational",
    icon: Clock,
    rating: 4.8,
    inStock: true,
    features: ["Exam registration", "Preparation tips", "24/7 support"]
  },
  {
    id: 9,
    name: "NIN Retrieval Service",
    description: "Fast and secure National Identification Number retrieval service with verification support.",
    price: 3500,
    category: "Identity",
    icon: Shield,
    rating: 4.9,
    inStock: true,
    features: ["Secure process", "Identity verification", "24/7 support"]
  },
  {
    id: 10,
    name: "School Fees Payment",
    description: "Convenient school fees payment service for universities, polytechnics, and secondary schools.",
    price: 2000,
    category: "Payment",
    icon: CreditCard,
    rating: 4.6,
    inStock: true,
    features: ["Multiple institutions", "Instant confirmation", "24/7 support"]
  },
  {
    id: 11,
    name: "Hostel Booking",
    description: "University and polytechnic hostel accommodation booking service with room selection.",
    price: 15000,
    category: "Accommodation",
    icon: Home,
    rating: 4.5,
    inStock: true,
    features: ["Room selection", "Instant booking", "24/7 support"]
  },
  {
    id: 12,
    name: "Premium Chinchin",
    description: "Delicious homemade chinchin snacks made with premium ingredients. Perfect for students and families.",
    price: 200,
    category: "Food",
    icon: Coffee,
    rating: 4.8,
    inStock: true,
    features: ["Homemade quality", "Fresh ingredients", "24/7 support"]
  },
  {
    id: 13,
    name: "Fresh Soya Milk",
    description: "Nutritious and fresh soya milk rich in protein. Healthy beverage option for students and health enthusiasts.",
    price: 800,
    category: "Food",
    icon: Coffee,
    rating: 4.7,
    inStock: true,
    features: ["High protein", "Fresh daily", "24/7 support"]
  },
  {
    id: 14,
    name: "NECO Result Token",
    description: "Digital NECO result verification token for secure online access to Senior Secondary Certificate results.",
    price: 2000,
    category: "Educational",
    icon: GraduationCap,
    rating: 4.8,
    inStock: true,
    features: ["Digital token", "Instant access", "24/7 support"]
  },
  {
    id: 15,
    name: "NABTEB Token",
    description: "Official NABTEB digital token for accessing National Business and Technical Examinations Board results.",
    price: 2000,
    category: "Educational",
    icon: Shield,
    rating: 4.7,
    inStock: true,
    features: ["Digital access", "Business & technical", "24/7 support"]
  }
];

export const ProductGrid = () => {
  const categories = ["All", "Educational", "Documentation", "Identity", "Payment", "Accommodation", "Food"];

  return (
    <section id="products" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4 text-gradient">Our Products & Services</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive educational services and products to support your academic journey and daily needs.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 animate-slide-up">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              className="hover-lift"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slide-up">
          {products.map((product, index) => {
            const Icon = product.icon;
            return (
              <Card key={product.id} className="hover-lift border-border/50 hover:border-primary/50 transition-all duration-300" style={{animationDelay: `${index * 0.1}s`}}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="h-8 w-8 text-primary" />
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="text-sm line-clamp-3">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-primary">
                      ₦{product.price.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                      <span className="text-sm text-muted-foreground">{product.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="h-3 w-3 text-success mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button className="w-full hover-lift" disabled={!product.inStock}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fade-in">
          <Card className="max-w-2xl mx-auto p-8 gradient-hero">
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-4">Need Help Choosing?</h3>
              <p className="text-white/90 mb-6">
                Our team of experts is ready to help you find the perfect educational solution for your needs.
              </p>
              <Button size="lg" className="bg-white text-nigeria-green hover:bg-white/90 hover-lift">
                Get Expert Consultation
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};