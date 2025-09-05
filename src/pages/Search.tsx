import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { GoogleInspiredFooter } from "@/components/GoogleInspiredFooter";
import { SearchBar } from "@/components/SearchBar";
import { SmartSearch } from "@/components/SmartSearch";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Code, 
  Globe, 
  Database, 
  Cloud, 
  Laptop,
  Clock,
  Star,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";

const Search = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock search results based on your services
  const mockResults = [
    {
      id: "1",
      title: "Complete Cybersecurity Audit",
      description: "Comprehensive security assessment for your business infrastructure including vulnerability testing and compliance evaluation.",
      category: "Security",
      price: 250000,
      rating: 4.8,
      reviews: 24,
      icon: Shield,
      url: "/product/1",
      type: "service"
    },
    {
      id: "2",
      title: "Custom Software Development",
      description: "Tailored software solutions built to meet your specific business requirements and objectives.",
      category: "Development",
      price: 500000,
      rating: 4.9,
      reviews: 18,
      icon: Code,
      url: "/product/2",
      type: "service"
    },
    {
      id: "3",
      title: "Cloud Migration Services",
      description: "Seamless migration of your infrastructure to cloud platforms with minimal downtime.",
      category: "Cloud",
      price: 300000,
      rating: 4.7,
      reviews: 15,
      icon: Cloud,
      url: "/product/3",
      type: "service"
    }
  ];

  const performSearch = (searchQuery: string) => {
    setLoading(true);
    setQuery(searchQuery);
    
    // Simulate search delay
    setTimeout(() => {
      if (searchQuery.trim()) {
        const filtered = mockResults.filter(result =>
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setResults(filtered);
      } else {
        setResults(mockResults);
      }
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    const searchQuery = searchParams.get("q") || searchParams.get("search");
    if (searchQuery) {
      performSearch(searchQuery);
    } else {
      setResults(mockResults);
    }

    // Set SEO meta tags
    document.title = searchQuery 
      ? `Search results for "${searchQuery}" - Confidential Connect`
      : "Search - Confidential Connect";
  }, [searchParams]);

  const resultStats = {
    total: results.length,
    time: "0.25 seconds"
  };

  return (
    <div className="min-h-screen">
      <KeyboardShortcuts />
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Header */}
          <div className="mb-8">
            <div className="flex items-center gap-8 mb-6">
              <Link to="/" className="text-2xl font-bold text-gradient">
                Confidential Connect
              </Link>
              <div className="flex-1 max-w-2xl">
                <SearchBar 
                  onSearch={performSearch}
                  placeholder="Search services and solutions..."
                />
              </div>
            </div>

            {/* Results Stats */}
            {query && (
              <div className="text-sm text-muted-foreground mb-4">
                About {resultStats.total.toLocaleString()} results ({resultStats.time})
              </div>
            )}
          </div>

          {/* Global AI Search */}
          {!query && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Globe className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Global AI Search</h2>
              </div>
              <SmartSearch 
                onSearchResults={(smartResults) => {
                  setResults(smartResults);
                  setLoading(false);
                }}
                placeholder="Search for anything in the world..."
                className="w-full"
              />
            </div>
          )}

          {/* Search Results */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="development">Development</TabsTrigger>
              <TabsTrigger value="cloud">Cloud</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-6">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-full"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : results.length > 0 ? (
                  results.map((result) => {
                    const IconComponent = result.icon;
                    return (
                      <Card key={result.id} className="hover-lift">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                              <IconComponent className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Link 
                                  to={result.url}
                                  className="text-xl font-semibold text-primary hover:underline"
                                >
                                  {result.title}
                                </Link>
                                <Badge variant="secondary">{result.category}</Badge>
                              </div>
                              <p className="text-muted-foreground mb-3 leading-relaxed">
                                {result.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-warning text-warning" />
                                    <span className="text-sm font-medium">{result.rating}</span>
                                    <span className="text-sm text-muted-foreground">
                                      ({result.reviews} reviews)
                                    </span>
                                  </div>
                                  <div className="text-lg font-bold text-primary">
                                    ₦{result.price.toLocaleString()}
                                  </div>
                                </div>
                                <Button asChild>
                                  <Link to={result.url}>View Details</Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <div className="text-center py-16">
                    <div className="mb-4">
                      <div className="text-6xl mb-4">🔍</div>
                      <h2 className="text-2xl font-semibold mb-2">No results found</h2>
                      <p className="text-muted-foreground mb-6">
                        Try different keywords or browse our categories
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Button variant="outline" asChild>
                        <Link to="/categories">Browse Categories</Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link to="/contact">Contact Support</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Other tab contents would be filtered versions */}
            <TabsContent value="services">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Service-specific results would appear here</p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Related Searches */}
          {query && results.length > 0 && (
            <div className="mt-12">
              <h3 className="text-lg font-semibold mb-4">Related searches</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "cybersecurity services",
                  "software development",
                  "cloud migration",
                  "database management",
                  "network security"
                ].map((related, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => performSearch(related)}
                  >
                    {related}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <GoogleInspiredFooter />
      <ScrollToTop />
    </div>
  );
};

export default Search;
