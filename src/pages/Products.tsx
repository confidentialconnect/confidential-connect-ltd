import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ArrowLeft } from "lucide-react";

// Complete products data with all 12 cloud services
const getAllProducts = () => [
  {
    id: "1",
    name: "Complete Cybersecurity Audit",
    description: "Comprehensive security assessment for your business infrastructure",
    price: 250000,
    category: "security",
    image: "/lovable-uploads/844d6332-7434-4200-93de-bb9fa92f86e9.png",
    rating: 4.8,
    reviews: 24,
    inStock: true
  },
  {
    id: "2", 
    name: "Penetration Testing Service",
    description: "Advanced penetration testing to identify security vulnerabilities",
    price: 180000,
    category: "security",
    image: "/lovable-uploads/56744fde-8308-4e73-8a51-d4b460dcfe1a.png",
    rating: 4.9,
    reviews: 18,
    inStock: true
  },
  {
    id: "3",
    name: "Custom Software Development",
    description: "Tailored software solutions for your business needs",
    price: 500000,
    category: "software",
    image: "/lovable-uploads/3657742a-fb6a-4c1a-a6c1-7bf4cf61cd8e.png",
    rating: 4.7,
    reviews: 32,
    inStock: true
  },
  {
    id: "4",
    name: "AWS Cloud Migration",
    description: "Seamless migration of your infrastructure to AWS cloud",
    price: 400000,
    category: "cloud",
    image: "/placeholder.svg",
    rating: 4.8,
    reviews: 22,
    inStock: true
  },
  {
    id: "5",
    name: "Azure Cloud Setup",
    description: "Complete Microsoft Azure cloud infrastructure setup",
    price: 350000,
    category: "cloud",
    image: "/placeholder.svg",
    rating: 4.6,
    reviews: 19,
    inStock: true
  },
  {
    id: "6",
    name: "Google Cloud Platform Setup",
    description: "Professional GCP cloud infrastructure deployment",
    price: 370000,
    category: "cloud",
    image: "/placeholder.svg",
    rating: 4.7,
    reviews: 25,
    inStock: true
  },
  {
    id: "7",
    name: "Multi-Cloud Strategy",
    description: "Hybrid multi-cloud infrastructure management",
    price: 600000,
    category: "cloud",
    image: "/placeholder.svg",
    rating: 4.9,
    reviews: 15,
    inStock: true
  },
  {
    id: "8",
    name: "Cloud Security Audit",
    description: "Comprehensive cloud security assessment and hardening",
    price: 280000,
    category: "cloud",
    image: "/placeholder.svg",
    rating: 4.8,
    reviews: 21,
    inStock: true
  },
  {
    id: "9",
    name: "Cloud Backup & Recovery",
    description: "Enterprise-grade cloud backup and disaster recovery solution",
    price: 220000,
    category: "cloud",
    image: "/placeholder.svg",
    rating: 4.7,
    reviews: 28,
    inStock: true
  },
  {
    id: "10",
    name: "Cloud Cost Optimization",
    description: "AI-powered cloud cost analysis and optimization",
    price: 150000,
    category: "cloud",
    image: "/placeholder.svg",
    rating: 4.6,
    reviews: 17,
    inStock: true
  },
  {
    id: "11",
    name: "Serverless Architecture",
    description: "Serverless application development and deployment",
    price: 320000,
    category: "cloud",
    image: "/placeholder.svg",
    rating: 4.8,
    reviews: 20,
    inStock: true
  },
  {
    id: "12",
    name: "Cloud Native Development",
    description: "Cloud-native application development with containers",
    price: 480000,
    category: "cloud",
    image: "/placeholder.svg",
    rating: 4.9,
    reviews: 24,
    inStock: true
  },
  {
    id: "13",
    name: "Network Infrastructure Setup",
    description: "Complete network design and implementation",
    price: 350000,
    category: "network",
    image: "/placeholder.svg",
    rating: 4.6,
    reviews: 15,
    inStock: true
  },
  {
    id: "14",
    name: "Database Optimization Service",
    description: "Performance tuning and optimization for your databases",
    price: 120000,
    category: "database", 
    image: "/placeholder.svg",
    rating: 4.8,
    reviews: 21,
    inStock: true
  },
  {
    id: "15",
    name: "Hardware Procurement & Setup",
    description: "Complete hardware solution with installation and configuration",
    price: 450000,
    category: "hardware",
    image: "/placeholder.svg",
    rating: 4.5,
    reviews: 28,
    inStock: true
  }
];

const categoryNames: Record<string, string> = {
  security: "Security Services",
  software: "Software Development", 
  network: "Network Solutions",
  database: "Database Services",
  hardware: "Hardware Solutions",
  cloud: "Cloud Services"
};

const Products = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const allProducts = getAllProducts();
    const filteredProducts = category 
      ? allProducts.filter(product => product.category === category)
      : allProducts;
    setProducts(filteredProducts);
  }, [category]);

  const categoryName = category ? categoryNames[category] || "Services" : "All Services";

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="ghost" 
              asChild
              className="p-0 h-auto"
            >
              <Link to="/categories">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Categories
              </Link>
            </Button>
          </div>

          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              {categoryName}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {category 
                ? `Explore our ${categoryName.toLowerCase()} and solutions`
                : "Browse our complete range of technology services"
              }
            </p>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="hover-lift">
                  <CardHeader className="p-0">
                    <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{categoryNames[product.category]}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-warning text-warning" />
                        <span className="text-xs text-muted-foreground">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg mb-2 line-clamp-2">
                      {product.name}
                    </CardTitle>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold text-primary">
                        ₦{product.price.toLocaleString()}
                      </div>
                      <Button asChild size="sm">
                        <Link to={`/product/${product.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No services found</h3>
              <p className="text-muted-foreground mb-4">
                No services available in this category at the moment.
              </p>
              <Button asChild>
                <Link to="/categories">
                  Browse All Categories
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;