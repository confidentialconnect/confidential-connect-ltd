import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  Sparkles, 
  Zap, 
  Shield, 
  Rocket, 
  Crown, 
  Star,
  ArrowRight,
  Check
} from "lucide-react";

export const PremiumFeatures = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: Crown,
      title: "Enterprise Grade Security",
      description: "Military-grade encryption and advanced threat protection for your most sensitive data",
      features: ["Zero-trust architecture", "End-to-end encryption", "AI-powered threat detection"],
      color: "from-brand-red to-brand-pink",
      badge: "Premium"
    },
    {
      icon: Rocket,
      title: "Lightning Fast Performance",
      description: "Optimized infrastructure delivering 99.99% uptime with global edge networks",
      features: ["Global CDN", "Auto-scaling", "Sub-second response times"],
      color: "from-brand-blue to-brand-purple",
      badge: "Pro"
    },
    {
      icon: Sparkles,
      title: "AI-Powered Innovation",
      description: "Cutting-edge artificial intelligence integration for smarter business solutions",
      features: ["Machine learning models", "Predictive analytics", "Automated workflows"],
      color: "from-brand-green to-brand-blue",
      badge: "AI Enhanced"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Dynamic background elements */}
      <div 
        className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl transition-all duration-1000"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--brand-blue)), hsl(var(--brand-purple)))',
          left: mousePosition.x / 10,
          top: mousePosition.y / 10,
        }}
      ></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-brand-blue animate-pulse-glow" />
            <Badge className="bg-gradient-to-r from-brand-blue to-brand-purple text-white border-0">
              Premium Features
            </Badge>
            <Sparkles className="h-6 w-6 text-brand-purple animate-pulse-glow" />
          </div>
          <h2 className="text-5xl font-black text-gradient mb-6">
            Experience Excellence
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Unlock the full potential of your business with our premium technology solutions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="border-gradient glass hover-lift group relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${feature.color} shadow-premium group-hover:shadow-glow transition-all duration-500`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <Badge className={`bg-gradient-to-r ${feature.color} text-white border-0 animate-pulse-glow`}>
                      {feature.badge}
                    </Badge>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 text-gradient">{feature.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{feature.description}</p>
                  
                  <div className="space-y-3">
                    {feature.features.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-brand-green" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full mt-6 bg-gradient-to-r ${feature.color} text-white border-0 hover-lift group/btn`}
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Premium CTA */}
        <div className="text-center glass rounded-3xl p-12 border-gradient">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Star className="h-6 w-6 text-brand-orange animate-pulse-glow" />
              <Star className="h-8 w-8 text-brand-orange animate-pulse-glow delay-300" />
              <Star className="h-6 w-6 text-brand-orange animate-pulse-glow delay-600" />
            </div>
            <h3 className="text-3xl font-bold text-gradient mb-4">
              Ready to Transform Your Business?
            </h3>
            <p className="text-muted-foreground mb-8 text-lg">
              Join thousands of companies already experiencing the premium difference
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-brand-blue to-brand-purple text-white border-0 hover-lift shadow-premium text-lg px-8 py-4"
                onClick={() => {
                  const whatsappMessage = `Hello Confidential Connect! I'm ready to get started with your premium technology solutions. Can you help me transform my business?`;
                  const whatsappUrl = `https://wa.me/2347040294858?text=${encodeURIComponent(whatsappMessage)}`;
                  window.open(whatsappUrl, '_blank');
                }}
              >
                <Zap className="h-5 w-5 mr-2" />
                Get Started Now
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-gradient hover-lift text-lg px-8 py-4"
                onClick={() => {
                  const whatsappMessage = `Hello Confidential Connect! I would like to schedule a demo of your technology solutions to see how they can benefit my business.`;
                  const whatsappUrl = `https://wa.me/2347040294858?text=${encodeURIComponent(whatsappMessage)}`;
                  window.open(whatsappUrl, '_blank');
                }}
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};