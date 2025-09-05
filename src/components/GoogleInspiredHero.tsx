import { SearchBar } from "./SearchBar";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Shield, 
  Code, 
  Globe, 
  Database, 
  Cloud, 
  Laptop,
  TrendingUp,
  Zap
} from "lucide-react";

export const GoogleInspiredHero = () => {
  const featuredServices = [
    {
      icon: Shield,
      title: "Cybersecurity",
      description: "Complete security audits and protection",
      badge: "Most Popular",
      color: "bg-destructive"
    },
    {
      icon: Code,
      title: "Software Development",
      description: "Custom applications and solutions",
      badge: "Trending",
      color: "bg-education-blue"
    },
    {
      icon: Cloud,
      title: "Cloud Solutions",
      description: "Migration and cloud infrastructure",
      badge: "New",
      color: "bg-success"
    }
  ];

  const quickStats = [
    { icon: TrendingUp, value: "500+", label: "Projects Completed" },
    { icon: Shield, value: "10+", label: "Years Experience" },
    { icon: Zap, value: "24/7", label: "Support Available" },
  ];

  return (
    <section className="min-h-screen flex flex-col justify-center py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Logo and Search */}
        <div className="text-center mb-16">
          {/* Company Logo - Google Style */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold mb-4">
              <span className="text-primary">C</span>
              <span className="text-destructive">o</span>
              <span className="text-warning">n</span>
              <span className="text-education-blue">f</span>
              <span className="text-success">i</span>
              <span className="text-destructive">d</span>
              <span className="text-primary">e</span>
              <span className="text-warning">n</span>
              <span className="text-education-blue">t</span>
              <span className="text-success">i</span>
              <span className="text-primary">a</span>
              <span className="text-destructive">l</span>
              {" "}
              <span className="text-education-blue">C</span>
              <span className="text-success">o</span>
              <span className="text-warning">n</span>
              <span className="text-destructive">n</span>
              <span className="text-primary">e</span>
              <span className="text-education-blue">c</span>
              <span className="text-success">t</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your trusted technology partner for secure, innovative solutions
            </p>
          </div>

          {/* Search Bar */}
          <SearchBar />
        </div>

        {/* Quick Stats */}
        <div className="flex justify-center mb-16">
          <div className="flex flex-wrap justify-center gap-8">
            {quickStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <IconComponent className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">{stat.value}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Featured Services - Google Cards Style */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8">Featured Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card 
                  key={index} 
                  className="hover-lift cursor-pointer group" 
                  onClick={() => window.location.href = `/categories?category=${service.title.toLowerCase().replace(' ', '-')}`}
                >
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-4">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${service.color}/10 group-hover:${service.color}/20 transition-colors`}>
                        <IconComponent className={`h-8 w-8 ${service.color.replace('bg-', 'text-')}`} />
                      </div>
                      <Badge className="absolute -top-2 -right-2 text-xs">
                        {service.badge}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground text-sm">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Doodle Section - Google Style */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <span className="text-sm">Available in:</span>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-muted rounded text-xs">English</span>
              <span className="px-2 py-1 bg-muted rounded text-xs">Hausa</span>
              <span className="px-2 py-1 bg-muted rounded text-xs">Yoruba</span>
              <span className="px-2 py-1 bg-muted rounded text-xs">Igbo</span>
            </div>
          </div>
        </div>

        {/* I'm Feeling Lucky Alternatives */}
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {[
            { text: "I'm Feeling Secure", search: "cybersecurity" },
            { text: "I'm Feeling Innovative", search: "software development" }, 
            { text: "I'm Feeling Connected", search: "network solutions" },
            { text: "I'm Feeling Technical", search: "technical support" }
          ].map((feeling, index) => (
            <button
              key={index}
              onClick={() => window.location.href = `/categories?search=${encodeURIComponent(feeling.search)}`}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-full transition-all duration-200 hover:scale-105"
            >
              {feeling.text}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};