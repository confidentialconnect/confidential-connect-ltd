import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Shield, Clock, Star } from "lucide-react";

export const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-16 gradient-hero relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white animate-fade-in">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Shield className="h-4 w-4 mr-2" />
              Trusted Educational Services
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Your Gateway to 
              <span className="block text-white/90">Educational Success</span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              We provide comprehensive educational services including WAEC, NECO, NABTEB result checking, university enrollment support, and much more. Your success is our priority.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button asChild size="lg" className="bg-white text-nigeria-green hover:bg-white/90 hover-lift">
                <a href="#services" aria-label="Explore our services">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Explore Our Services
                </a>
              </Button>
              <Button 
                asChild
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-nigeria-green hover-lift"
              >
                <a href="#contact" aria-label="Contact us today">Contact Us Today</a>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">5000+</div>
                <div className="text-white/80 text-sm">Happy Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">98%</div>
                <div className="text-white/80 text-sm">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-white/80 text-sm">Support</div>
              </div>
            </div>
          </div>

          {/* Right Content - Services Preview */}
          <div className="animate-slide-up">
            <Card className="p-8 bg-white/95 backdrop-blur-sm border-0 shadow-2xl hover-lift">
              <div className="flex items-center mb-6">
                <img 
                  src="/lovable-uploads/3657742a-fb6a-4c1a-a6c1-7bf4cf61cd8e.png" 
                  alt="Confidential Connect Ltd Logo" 
                  className="h-12 w-auto mr-4"
                />
                <div>
                  <h3 className="text-2xl font-bold text-gradient">Quick Services</h3>
                  <p className="text-muted-foreground">Get started in minutes</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary rounded-lg hover-lift cursor-pointer" onClick={() => { window.location.hash = 'products'; }}>
                  <div className="flex items-center">
                    <GraduationCap className="h-8 w-8 text-primary mr-3" />
                    <div>
                      <div className="font-semibold">WAEC Result Checker</div>
                      <div className="text-sm text-muted-foreground">Check your results instantly</div>
                    </div>
                  </div>
                  <Badge variant="secondary">₦4,500</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary rounded-lg hover-lift cursor-pointer" onClick={() => { window.location.hash = 'products'; }}>
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-primary mr-3" />
                    <div>
                      <div className="font-semibold">University Registration</div>
                      <div className="text-sm text-muted-foreground">Complete enrollment support</div>
                    </div>
                  </div>
                  <Badge variant="secondary">₦7,000</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary rounded-lg hover-lift cursor-pointer" onClick={() => { window.location.hash = 'products'; }}>
                  <div className="flex items-center">
                    <Star className="h-8 w-8 text-primary mr-3" />
                    <div>
                      <div className="font-semibold">NIN Retrieval</div>
                      <div className="text-sm text-muted-foreground">Fast and secure</div>
                    </div>
                  </div>
                  <Badge variant="secondary">₦3,500</Badge>
                </div>
              </div>

              <Button asChild className="w-full mt-6 hover-lift">
                <a href="#products" aria-label="View all services">View All Services</a>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};