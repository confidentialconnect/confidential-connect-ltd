import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  FileText, 
  Shield, 
  Clock, 
  Users, 
  CheckCircle,
  Phone,
  Globe,
  Award,
  CreditCard,
  BookOpen,
  UserCheck
} from "lucide-react";

const services = [
  {
    icon: GraduationCap,
    title: "Educational Registration",
    description: "Complete support for university, polytechnic, and college registration processes.",
    features: ["Application assistance", "Document verification", "Deadline tracking", "Success guarantee"],
    badge: "Most Popular"
  },
  {
    icon: FileText,
    title: "Result Verification",
    description: "Fast and reliable result checking services for WAEC, NECO, NABTEB, and GCE examinations.",
    features: ["Instant verification", "Multiple exam types", "24/7 availability", "Secure access"],
    badge: "Instant"
  },
  {
    icon: Shield,
    title: "Document Authentication",
    description: "Professional document verification and authentication services with legal backing.",
    features: ["Certificate verification", "Legal authentication", "Fast processing", "Secure handling"],
    badge: "Trusted"
  },
  {
    icon: UserCheck,
    title: "Identity Services",
    description: "NIN retrieval, BVN services, and other identity verification solutions.",
    features: ["NIN retrieval", "BVN verification", "Identity confirmation", "Privacy protection"],
    badge: "Secure"
  },
  {
    icon: CreditCard,
    title: "Payment Solutions",
    description: "Convenient payment services for school fees, application fees, and other educational expenses.",
    features: ["Multiple payment options", "Instant confirmation", "Receipt generation", "Fee tracking"],
    badge: "Convenient"
  },
  {
    icon: BookOpen,
    title: "Academic Support",
    description: "Comprehensive academic guidance including course selection and career counseling.",
    features: ["Course guidance", "Career counseling", "Academic planning", "Success strategies"],
    badge: "Expert"
  }
];

const stats = [
  { number: "10,000+", label: "Students Served", icon: Users },
  { number: "99.5%", label: "Success Rate", icon: Award },
  { number: "24/7", label: "Support Available", icon: Clock },
  { number: "50+", label: "Partner Institutions", icon: Globe }
];

export const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4 text-gradient">Our Comprehensive Services</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We provide end-to-end educational services designed to simplify your academic journey. 
            From examination result checking to university enrollment, we've got you covered.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 animate-slide-up">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="text-center p-6 hover-lift bg-white border-border/50">
                <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            );
          })}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index} 
                className="hover-lift bg-white border-border/50 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="h-12 w-12 text-primary" />
                    {service.badge && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {service.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-success mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full hover-lift">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-white rounded-2xl p-8 md:p-12 animate-fade-in">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-gradient">Why Choose Confidential Connect?</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Shield className="h-6 w-6 text-primary mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-2">Trusted & Secure</h4>
                    <p className="text-muted-foreground">Our platform is built with security and trust at its core. We protect your personal information and ensure secure transactions.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-primary mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-2">Fast & Reliable</h4>
                    <p className="text-muted-foreground">We deliver our services quickly without compromising quality. Most services are completed within 24 hours.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-primary mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-2">24/7 Support</h4>
                    <p className="text-muted-foreground">Our dedicated support team is available around the clock to assist you with any questions or concerns.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-hero rounded-xl p-8 text-white">
              <h4 className="text-2xl font-bold mb-4">Ready to Get Started?</h4>
              <p className="text-white/90 mb-6">
                Join thousands of satisfied students who trust us with their educational needs. Get started today and experience the difference.
              </p>
              <div className="space-y-4">
                <Button size="lg" className="w-full bg-white text-nigeria-green hover:bg-white/90 hover-lift">
                  Start Your Journey
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full border-white text-white hover:bg-white hover:text-nigeria-green hover-lift"
                >
                  Contact Our Team
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};