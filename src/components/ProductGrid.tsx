import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Clock, CheckCircle, FileText, GraduationCap, Shield, CreditCard, Home, Coffee } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
const products = [
  {
    id: 1,
    name: "WAEC Scratch Card",
    description: "Official WAEC result checker pin for instant result verification. Valid for current and previous years.",
    price: 4200,
    category: "Educational",
    icon: FileText,
    rating: 4.9,
    inStock: true,
    features: ["Instant delivery", "Valid for all years", "24/7 support"]
  },
  {
    id: 2,
    name: "Result Checker",
    description: "Authentic NECO scratch card token for checking Senior Secondary Certificate Examination results.",
    price: 500,
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
    price: 1600,
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
    price: 500,
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
    price: 12000,
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
    price: 6000,
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
    price: 20000,
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
    name: "NECO Tokens",
    description: "Digital NECO result verification token for secure online access to Senior Secondary Certificate results.",
    price: 1600,
    category: "Educational",
    icon: GraduationCap,
    rating: 4.8,
    inStock: true,
    features: ["Digital token", "Instant access", "24/7 support"]
  },
  {
    id: 15,
    name: "NABTEB Tokens",
    description: "Official NABTEB digital token for accessing National Business and Technical Examinations Board results.",
    price: 1600,
    category: "Educational",
    icon: Shield,
    rating: 4.7,
    inStock: true,
    features: ["Digital access", "Business & technical", "24/7 support"]
  },
  {
    id: 16,
    name: "Bulk Scratch Card",
    description: "Bulk scratch cards for educational institutions and organizations. Minimum order 20 units, maximum 100 units.",
    price: 0,
    category: "Educational",
    icon: FileText,
    rating: 4.9,
    inStock: true,
    features: ["Bulk discount", "Min: 20 units", "Max: 100 units", "24/7 support"]
  },
  {
    id: 17,
    name: "NABTEB Scratch Card Bulk",
    description: "Bulk NABTEB scratch cards for result verification with tiered pricing based on quantity.",
    price: 1050,
    category: "Educational",
    icon: Shield,
    rating: 4.8,
    inStock: true,
    features: [
      "Quantity: 20-40 units | Unit Price: ₦1,050",
      "Quantity: 41-60 units | Unit Price: ₦1,000", 
      "Quantity: 61-80 units | Unit Price: ₦975",
      "Quantity: 81-100 units | Unit Price: ₦960",
      "24/7 support"
    ]
  },
  {
    id: 18,
    name: "WAEC Verification Pin Bulk",
    description: "Bulk WAEC verification pins for result checking with tiered pricing based on quantity.",
    price: 4500,
    category: "Educational",
    icon: FileText,
    rating: 4.9,
    inStock: true,
    features: [
      "Quantity: 20-40 units | Unit Price: ₦4,500",
      "Quantity: 41-60 units | Unit Price: ₦4,300",
      "Quantity: 61-80 units | Unit Price: ₦4,250", 
      "Quantity: 81-100 units | Unit Price: ₦4,100",
      "24/7 support"
    ]
  },
  {
    id: 19,
    name: "NECO Result Token Bulk",
    description: "Bulk NECO result tokens for educational institutions with tiered pricing based on quantity.",
    price: 1300,
    category: "Educational",
    icon: GraduationCap,
    rating: 4.8,
    inStock: true,
    features: [
      "Quantity: 20-40 units | Unit Price: ₦1,300",
      "Quantity: 41-60 units | Unit Price: ₦1,200",
      "Quantity: 61-80 units | Unit Price: ₦1,180",
      "Quantity: 81-100 units | Unit Price: ₦1,150",
      "24/7 support"
    ]
  },
  {
    id: 20,
    name: "NBAIS Scratch Card Bulk",
    description: "Bulk NBAIS scratch cards for result verification with tiered pricing based on quantity.",
    price: 1500,
    category: "Educational",
    icon: Shield,
    rating: 4.7,
    inStock: true,
    features: [
      "Quantity: 20-40 units | Unit Price: ₦1,500",
      "Quantity: 41-60 units | Unit Price: ₦1,350",
      "Quantity: 61-80 units | Unit Price: ₦1,300",
      "Quantity: 81-100 units | Unit Price: ₦1,250",
      "24/7 support"
    ]
  },
  {
    id: 21,
    name: "Birth Certificate",
    description: "Official birth certificate documentation service with verification and authentication guarantee.",
    price: 5000,
    category: "Documentation",
    icon: FileText,
    rating: 4.9,
    inStock: true,
    features: ["Official documentation", "Authentication included", "Fast processing", "24/7 support"]
  },
  {
    id: 22,
    name: "State of Origin Certificate",
    description: "Authentic state of origin certificate processing with official government endorsement and verification.",
    price: 12000,
    category: "Documentation", 
    icon: Shield,
    rating: 4.8,
    inStock: true,
    features: ["Government endorsed", "Official verification", "Secure processing", "24/7 support"]
  },
  {
    id: 23,
    name: "WAEC Certificate Service",
    description: "Complete WAEC certificate collection, verification, and authentication service with guaranteed authenticity.",
    price: 12000,
    category: "Documentation",
    icon: GraduationCap,
    rating: 4.9,
    inStock: true,
    features: ["Certificate collection", "Full authentication", "Guaranteed authenticity", "24/7 support"]
  }
];

export const ProductGrid = () => {
  const categories = ["All", "Educational", "Documentation", "Identity", "Payment", "Accommodation", "Food"];
  const { addItem } = useCart();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
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
              variant={selectedCategory === category ? "default" : "outline"}
              className="hover-lift"
              onClick={() => setSelectedCategory(category)}
              aria-pressed={selectedCategory === category}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slide-up">
          {products
            .filter((p) => selectedCategory === "All" || p.category === selectedCategory)
            .map((product, index) => {
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
                    <Button
                      className="w-full hover-lift"
                      disabled={!product.inStock}
                      onClick={() => {
                        addItem({ id: product.id, name: product.name, price: product.price }, 1);
                        toast({ title: "Added to cart", description: `${product.name} added to your cart.` });
                      }}
                    >
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
              <Button asChild size="lg" className="bg-white text-nigeria-green hover:bg-white/90 hover-lift">
                <a href="#contact" aria-label="Get expert consultation">Get Expert Consultation</a>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};