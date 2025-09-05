import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, ShoppingCart, Star, ArrowLeft, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

// Complete product data with all 12 cloud services
const getProductById = (id: string) => {
  const products = [
    {
      id: "1",
      name: "Complete Cybersecurity Audit",
      description: "Comprehensive security assessment for your business infrastructure",
      fullDescription: "Our complete cybersecurity audit provides a thorough assessment of your organization's security posture. We identify vulnerabilities, assess risks, and provide actionable recommendations to strengthen your defenses against cyber threats.",
      price: 250000,
      category: "security",
      images: ["/lovable-uploads/844d6332-7434-4200-93de-bb9fa92f86e9.png"],
      rating: 4.8,
      reviews: 24,
      inStock: true,
      features: [
        "Network vulnerability assessment",
        "Security policy review", 
        "Penetration testing",
        "Compliance evaluation",
        "Risk assessment report",
        "Security recommendations"
      ],
      specifications: {
        "Duration": "2-3 weeks",
        "Delivery": "Comprehensive report",
        "Support": "30 days post-delivery",
        "Certification": "ISO 27001 compliant"
      }
    },
    {
      id: "2",
      name: "Penetration Testing Service",
      description: "Advanced penetration testing to identify security vulnerabilities",
      fullDescription: "Our penetration testing service simulates real-world attacks to identify weaknesses in your systems before malicious actors can exploit them.",
      price: 180000,
      category: "security",
      images: ["/lovable-uploads/56744fde-8308-4e73-8a51-d4b460dcfe1a.png"],
      rating: 4.9,
      reviews: 18,
      inStock: true,
      features: [
        "External penetration testing",
        "Internal network testing",
        "Web application testing",
        "Social engineering assessment",
        "Detailed vulnerability report",
        "Remediation guidance"
      ],
      specifications: {
        "Duration": "1-2 weeks",
        "Delivery": "Technical report + presentation",
        "Support": "60 days consultation",
        "Methodology": "OWASP & NIST compliant"
      }
    },
    {
      id: "3", 
      name: "Custom Software Development",
      description: "Tailored software solutions for your business needs",
      fullDescription: "We create custom software applications designed specifically for your business requirements, ensuring scalability, security, and optimal performance.",
      price: 500000,
      category: "software",
      images: ["/lovable-uploads/3657742a-fb6a-4c1a-a6c1-7bf4cf61cd8e.png"],
      rating: 4.7,
      reviews: 32,
      inStock: true,
      features: [
        "Requirements analysis",
        "Custom application development",
        "Database design",
        "API integration",
        "Testing & quality assurance",
        "Deployment & maintenance"
      ],
      specifications: {
        "Duration": "3-6 months",
        "Technology": "React, Node.js, Python",
        "Support": "1 year warranty",
        "Delivery": "Full source code + documentation"
      }
    },
    {
      id: "4",
      name: "AWS Cloud Migration",
      description: "Seamless migration of your infrastructure to AWS cloud",
      fullDescription: "Complete migration service to move your applications and data to Amazon Web Services with minimal downtime and maximum efficiency.",
      price: 400000,
      category: "cloud",
      images: ["/placeholder.svg"],
      rating: 4.8,
      reviews: 22,
      inStock: true,
      features: [
        "Infrastructure assessment",
        "Migration planning",
        "Data transfer",
        "Application migration",
        "Security configuration",
        "Performance optimization"
      ],
      specifications: {
        "Duration": "4-8 weeks",
        "Support": "90 days post-migration",
        "Certification": "AWS certified team",
        "Backup": "Full rollback plan"
      }
    },
    {
      id: "5",
      name: "Azure Cloud Setup",
      description: "Complete Microsoft Azure cloud infrastructure setup",
      fullDescription: "Professional Azure cloud environment setup with best practices for security, scalability, and cost optimization.",
      price: 350000,
      category: "cloud",
      images: ["/placeholder.svg"],
      rating: 4.6,
      reviews: 19,
      inStock: true,
      features: [
        "Azure subscription setup",
        "Virtual network configuration",
        "Identity & access management",
        "Backup & disaster recovery",
        "Monitoring setup",
        "Cost optimization"
      ],
      specifications: {
        "Duration": "3-6 weeks",
        "Support": "6 months",
        "Certification": "Microsoft certified",
        "Training": "Team training included"
      }
    },
    {
      id: "6",
      name: "Google Cloud Platform Setup",
      description: "Professional GCP cloud infrastructure deployment",
      fullDescription: "Complete Google Cloud Platform setup with enterprise-grade security, monitoring, and scalability features.",
      price: 370000,
      category: "cloud",
      images: ["/placeholder.svg"],
      rating: 4.7,
      reviews: 25,
      inStock: true,
      features: [
        "GCP project setup",
        "Kubernetes deployment",
        "Cloud storage configuration",
        "IAM setup",
        "Monitoring & logging",
        "CI/CD pipeline"
      ],
      specifications: {
        "Duration": "3-5 weeks",
        "Support": "6 months",
        "Certification": "Google Cloud certified",
        "Documentation": "Complete setup guide"
      }
    },
    {
      id: "7",
      name: "Multi-Cloud Strategy",
      description: "Hybrid multi-cloud infrastructure management",
      fullDescription: "Strategic multi-cloud approach using AWS, Azure, and GCP for optimal performance, cost efficiency, and risk mitigation.",
      price: 600000,
      category: "cloud",
      images: ["/placeholder.svg"],
      rating: 4.9,
      reviews: 15,
      inStock: true,
      features: [
        "Multi-cloud architecture design",
        "Cross-cloud networking",
        "Unified monitoring",
        "Cost optimization",
        "Disaster recovery",
        "Compliance management"
      ],
      specifications: {
        "Duration": "8-12 weeks",
        "Support": "1 year",
        "Expertise": "All major cloud platforms",
        "Strategy": "Custom roadmap included"
      }
    },
    {
      id: "8",
      name: "Cloud Security Audit",
      description: "Comprehensive cloud security assessment and hardening",
      fullDescription: "Thorough security audit of your cloud infrastructure with actionable recommendations for improved security posture.",
      price: 280000,
      category: "cloud",
      images: ["/placeholder.svg"],
      rating: 4.8,
      reviews: 21,
      inStock: true,
      features: [
        "Security configuration review",
        "Access control audit",
        "Data encryption assessment",
        "Compliance checking",
        "Vulnerability scanning",
        "Security hardening"
      ],
      specifications: {
        "Duration": "2-4 weeks",
        "Standards": "ISO 27001, SOC 2",
        "Support": "90 days",
        "Report": "Executive & technical reports"
      }
    },
    {
      id: "9",
      name: "Cloud Backup & Recovery",
      description: "Enterprise-grade cloud backup and disaster recovery solution",
      fullDescription: "Comprehensive backup and disaster recovery solution ensuring business continuity with minimal downtime.",
      price: 220000,
      category: "cloud",
      images: ["/placeholder.svg"],
      rating: 4.7,
      reviews: 28,
      inStock: true,
      features: [
        "Automated backup scheduling",
        "Cross-region replication",
        "Point-in-time recovery",
        "Disaster recovery testing",
        "Compliance reporting",
        "24/7 monitoring"
      ],
      specifications: {
        "RTO": "< 4 hours",
        "RPO": "< 1 hour",
        "Support": "24/7 emergency support",
        "Testing": "Quarterly DR testing"
      }
    },
    {
      id: "10",
      name: "Cloud Cost Optimization",
      description: "AI-powered cloud cost analysis and optimization",
      fullDescription: "Advanced cost optimization service using AI to analyze usage patterns and recommend cost-saving measures.",
      price: 150000,
      category: "cloud",
      images: ["/placeholder.svg"],
      rating: 4.6,
      reviews: 17,
      inStock: true,
      features: [
        "Cost analysis & reporting",
        "Resource rightsizing",
        "Reserved instance optimization",
        "Automated scaling policies",
        "Budget alerts",
        "Monthly optimization reviews"
      ],
      specifications: {
        "Savings": "20-40% typical reduction",
        "Duration": "Ongoing service",
        "Reporting": "Monthly detailed reports",
        "Tools": "Custom dashboard included"
      }
    },
    {
      id: "11",
      name: "Serverless Architecture",
      description: "Serverless application development and deployment",
      fullDescription: "Modern serverless architecture implementation for scalable, cost-effective applications with automatic scaling.",
      price: 320000,
      category: "cloud",
      images: ["/placeholder.svg"],
      rating: 4.8,
      reviews: 20,
      inStock: true,
      features: [
        "Serverless architecture design",
        "Lambda/Functions deployment",
        "API Gateway setup",
        "Database integration",
        "Monitoring & logging",
        "CI/CD pipeline"
      ],
      specifications: {
        "Platforms": "AWS Lambda, Azure Functions",
        "Duration": "6-10 weeks",
        "Support": "6 months",
        "Scaling": "Automatic scaling included"
      }
    },
    {
      id: "12",
      name: "Cloud Native Development",
      description: "Cloud-native application development with containers",
      fullDescription: "Development of cloud-native applications using containers, microservices, and modern DevOps practices.",
      price: 480000,
      category: "cloud",
      images: ["/placeholder.svg"],
      rating: 4.9,
      reviews: 24,
      inStock: true,
      features: [
        "Microservices architecture",
        "Container orchestration",
        "DevOps pipeline setup",
        "Service mesh implementation",
        "Monitoring & observability",
        "Security best practices"
      ],
      specifications: {
        "Technology": "Docker, Kubernetes",
        "Duration": "8-16 weeks", 
        "Support": "1 year",
        "Training": "Team training included"
      }
    }
  ];
  
  return products.find(p => p.id === id);
};

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (id) {
      const foundProduct = getProductById(id);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        navigate("/categories");
      }
    }
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: parseInt(product.id),
        name: product.name,
        price: product.price
      });
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted 
        ? "Item removed from your wishlist" 
        : "Item added to your wishlist",
    });
  };

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh] pt-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Product not found</h2>
            <Button onClick={() => navigate("/categories")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/categories")}
              className="p-0 h-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Categories
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square w-20 bg-muted rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-muted-foreground text-lg mb-4">
                  {product.description}
                </p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? "fill-warning text-warning"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                  <Badge variant={product.inStock ? "default" : "destructive"}>
                    {product.inStock ? "Available" : "Out of Stock"}
                  </Badge>
                </div>

                <div className="text-3xl font-bold text-primary mb-6">
                  ₦{product.price.toLocaleString()}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={toggleWishlist}
                  className="px-4"
                >
                  <Heart
                    className={`h-4 w-4 ${isWishlisted ? "fill-current text-destructive" : ""}`}
                  />
                </Button>
              </div>

              <Separator />

              {/* Product Features */}
              <div>
                <h3 className="font-semibold mb-3">What's Included:</h3>
                <ul className="space-y-2">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-success" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.fullDescription}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Specifications</h3>
                <div className="space-y-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="font-medium">{value as string}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Product;