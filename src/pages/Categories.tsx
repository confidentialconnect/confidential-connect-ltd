import { useState } from "react";
import { usePageSEO } from "@/hooks/usePageSEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Laptop, Shield, Globe, Server, Database, Code } from "lucide-react";

const Categories = () => {
  usePageSEO({
      title: 'Services',
      description: 'Browse all services offered by CONFIDENTIAL CONNECT LTD — document processing, school registration, WAEC/NECO result checking, and digital services.',
      keywords: 'services confidential connect, document processing services, digital services Nigeria, school registration',
      canonical: 'https://confidential-connect-ltd.lovable.app/categories',
  });

  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    {
      id: "security",
      name: "Security Services",
      icon: Shield,
      description: "Cybersecurity, penetration testing, and security audits",
      productCount: 12,
      color: "bg-destructive"
    },
    {
      id: "software",
      name: "Software Development",
      icon: Code,
      description: "Custom software solutions and applications",
      productCount: 18,
      color: "bg-education-blue"
    },
    {
      id: "network",
      name: "Network Solutions",
      icon: Globe,
      description: "Network design, setup, and maintenance",
      productCount: 8,
      color: "bg-nigeria-green"
    },
    {
      id: "database",
      name: "Database Services",
      icon: Database,
      description: "Database design, optimization, and management",
      productCount: 6,
      color: "bg-warning"
    },
    {
      id: "hardware",
      name: "Hardware Solutions",
      icon: Laptop,
      description: "Computer hardware and device solutions",
      productCount: 15,
      color: "bg-education-purple"
    },
    {
      id: "cloud",
      name: "Cloud Services",
      icon: Server,
      description: "Cloud migration, setup, and management",
      productCount: 10,
      color: "bg-info"
    }
  ];

  const filteredCategories = selectedCategory === "all" 
    ? categories 
    : categories.filter(cat => cat.id === selectedCategory);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20 pb-12">
        {/* SEO Headers */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              Service Categories
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our comprehensive range of technology services and solutions
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.id} className="hover-lift">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-3 rounded-lg ${category.color} text-white`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary">{category.productCount} services</Badge>
                    </div>
                    <CardTitle className="text-xl">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {category.description}
                    </p>
                    <Button asChild className="w-full">
                      <Link to={`/products?category=${category.id}`}>
                        View Services
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;