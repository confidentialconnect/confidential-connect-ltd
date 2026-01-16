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
    <section className="min-h-screen flex flex-col justify-center py-20 gradient-mesh relative overflow-hidden">
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-brand-blue/20 animate-float blur-sm"></div>
      <div className="absolute top-40 right-20 w-16 h-16 rounded-full bg-brand-purple/20 animate-float delay-1000 blur-sm"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 rounded-full bg-brand-pink/20 animate-float delay-2000 blur-sm"></div>
      <div className="absolute bottom-20 right-10 w-12 h-12 rounded-full bg-brand-orange/20 animate-float delay-500 blur-sm"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Logo and Search */}
        <div className="text-center mb-16 animate-fade-in">
          {/* Company Logo - Premium Style */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
              <span className="text-brand-blue hover-scale inline-block cursor-pointer animate-bounce-in">C</span>
              <span className="text-brand-red hover-scale inline-block cursor-pointer animate-bounce-in delay-100">o</span>
              <span className="text-brand-orange hover-scale inline-block cursor-pointer animate-bounce-in delay-200">n</span>
              <span className="text-brand-blue hover-scale inline-block cursor-pointer animate-bounce-in delay-300">f</span>
              <span className="text-brand-green hover-scale inline-block cursor-pointer animate-bounce-in delay-400">i</span>
              <span className="text-brand-red hover-scale inline-block cursor-pointer animate-bounce-in delay-500">d</span>
              <span className="text-brand-purple hover-scale inline-block cursor-pointer animate-bounce-in delay-600">e</span>
              <span className="text-brand-orange hover-scale inline-block cursor-pointer animate-bounce-in delay-700">n</span>
              <span className="text-brand-blue hover-scale inline-block cursor-pointer animate-bounce-in delay-800">t</span>
              <span className="text-brand-green hover-scale inline-block cursor-pointer animate-bounce-in delay-900">i</span>
              <span className="text-brand-purple hover-scale inline-block cursor-pointer animate-bounce-in delay-1000">a</span>
              <span className="text-brand-red hover-scale inline-block cursor-pointer animate-bounce-in delay-1100">l</span>
              {" "}
              <span className="text-brand-blue hover-scale inline-block cursor-pointer animate-bounce-in delay-1200">C</span>
              <span className="text-brand-green hover-scale inline-block cursor-pointer animate-bounce-in delay-1300">o</span>
              <span className="text-brand-orange hover-scale inline-block cursor-pointer animate-bounce-in delay-1400">n</span>
              <span className="text-brand-red hover-scale inline-block cursor-pointer animate-bounce-in delay-1500">n</span>
              <span className="text-brand-purple hover-scale inline-block cursor-pointer animate-bounce-in delay-1600">e</span>
              <span className="text-brand-blue hover-scale inline-block cursor-pointer animate-bounce-in delay-1700">c</span>
              <span className="text-brand-green hover-scale inline-block cursor-pointer animate-bounce-in delay-1800">t</span>
              {" "}
              <span className="text-brand-orange hover-scale inline-block cursor-pointer animate-bounce-in delay-1900">L</span>
              <span className="text-brand-purple hover-scale inline-block cursor-pointer animate-bounce-in delay-2000">t</span>
              <span className="text-brand-blue hover-scale inline-block cursor-pointer animate-bounce-in delay-2100">d</span>
            </h1>
            <div className="relative">
              <p className="text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed animate-slide-up">
                Your trusted technology partner for secure, innovative solutions
              </p>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-brand-blue to-brand-purple rounded-full"></div>
            </div>
          </div>

          {/* Premium Search Bar */}
          <div className="animate-slide-up delay-300">
            <SearchBar />
          </div>
        </div>

        {/* Premium Stats */}
        <div className="flex justify-center mb-20 animate-fade-in delay-500">
          <div className="flex flex-wrap justify-center gap-12">
            {quickStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="glass rounded-2xl p-6 hover-glow transition-all duration-500 group-hover:scale-105">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <div className="p-2 rounded-full bg-gradient-to-br from-brand-blue to-brand-purple animate-pulse-glow">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-3xl font-black text-shimmer">{stat.value}</span>
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">{stat.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Premium Featured Services */}
        <div className="max-w-7xl mx-auto animate-slide-up delay-700">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gradient mb-4">Featured Services</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-brand-blue to-brand-purple rounded-full mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card 
                  key={index} 
                  className="border-gradient glass hover-lift cursor-pointer group relative overflow-hidden" 
                  onClick={() => window.location.href = `/categories?category=${service.title.toLowerCase().replace(' ', '-')}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-brand-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardContent className="p-8 text-center relative z-10">
                    <div className="relative mb-6">
                      <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-purple shadow-premium group-hover:shadow-glow transition-all duration-500 group-hover:scale-110">
                        <IconComponent className="h-10 w-10 text-white" />
                        <div className="absolute inset-0 rounded-2xl animate-pulse-glow"></div>
                      </div>
                      <Badge className="absolute -top-2 -right-4 text-xs font-semibold bg-gradient-to-r from-brand-orange to-brand-red text-white border-0 shadow-premium animate-bounce-in">
                        {service.badge}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gradient group-hover:text-shimmer transition-all duration-300">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                    <div className="mt-4 h-1 w-0 group-hover:w-full bg-gradient-to-r from-brand-blue to-brand-purple rounded-full transition-all duration-500 mx-auto"></div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Premium Language Section */}
        <div className="text-center mt-20 animate-fade-in delay-1000">
          <div className="glass rounded-2xl p-6 inline-block">
            <div className="flex items-center gap-4 text-muted-foreground">
              <Globe className="h-5 w-5 text-brand-blue" />
              <span className="text-sm font-medium">Available in:</span>
              <div className="flex gap-2">
                {['English', 'Hausa', 'Yoruba', 'Igbo'].map((lang, index) => (
                  <span key={lang} className="px-3 py-1 bg-gradient-to-r from-brand-blue to-brand-purple text-white rounded-full text-xs font-medium hover-scale cursor-pointer">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Premium Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-12 animate-bounce-in delay-1200">
          {[
            { text: "I'm Feeling Secure", search: "cybersecurity", gradient: "from-brand-red to-brand-pink" },
            { text: "I'm Feeling Innovative", search: "software development", gradient: "from-brand-blue to-brand-purple" }, 
            { text: "I'm Feeling Connected", search: "network solutions", gradient: "from-brand-green to-brand-blue" },
            { text: "I'm Feeling Technical", search: "technical support", gradient: "from-brand-orange to-brand-red" }
          ].map((feeling, index) => (
            <button
              key={index}
              onClick={() => window.location.href = `/categories?search=${encodeURIComponent(feeling.search)}`}
              className={`px-6 py-3 text-sm font-medium text-white bg-gradient-to-r ${feeling.gradient} rounded-full hover-lift shadow-premium transition-all duration-300 hover:shadow-glow border-gradient`}
            >
              {feeling.text}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};