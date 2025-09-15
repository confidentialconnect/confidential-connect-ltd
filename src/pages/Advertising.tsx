import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Sparkles, LineChart, Users } from "lucide-react";

const Advertising = () => {
  useEffect(() => {
    document.title = "Advertising Services | Confidential Connect";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "Advertising and promotions – grow your brand with targeted campaigns, social reach, and conversion-optimized creatives.");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="py-16 gradient-hero text-white animate-fade-in">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="secondary" className="mb-4">New</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Advertising That Delivers Results</h1>
            <p className="text-white/90 max-w-2xl mx-auto mb-6">
              Reach the right people, boost engagement, and convert clicks to customers with our premium ad solutions.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button size="lg" className="hover-lift" asChild>
                <a href="#plans" aria-label="View advertising plans">View Plans</a>
              </Button>
              <Button 
                size="lg" 
                variant="secondary" 
                className="hover-lift" 
                onClick={() => {
                  const whatsappMessage = `Hello Confidential Connect! I'm interested in your advertising services and would like to speak with your sales team about growing my business.`;
                  const whatsappUrl = `https://wa.me/2347040294858?text=${encodeURIComponent(whatsappMessage)}`;
                  window.open(whatsappUrl, '_blank');
                }}
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[{
                title: "Social Media Ads",
                icon: Megaphone,
                desc: "Targeted campaigns on Facebook, Instagram, and TikTok to grow your reach fast."
              },{
                title: "Conversion Optimization",
                icon: LineChart,
                desc: "Landing pages and creatives built to turn clicks into customers."
              },{
                title: "Community Growth",
                icon: Users,
                desc: "Engage your audience with content and retention strategies."
              }].map((f, i) => {
                const Icon = f.icon;
                return (
                  <Card key={i} className="hover-lift">
                    <CardContent className="p-6">
                      <Icon className="h-8 w-8 text-primary mb-4" />
                      <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                      <p className="text-muted-foreground">{f.desc}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section id="plans" className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[{
                name: "Starter",
                price: "50,000",
                perks: ["1-week campaign", "1 creative set", "Basic targeting"]
              },{
                name: "Growth",
                price: "120,000",
                perks: ["2-week campaign", "3 creative sets", "Advanced targeting"]
              },{
                name: "Premium",
                price: "250,000",
                perks: ["1-month campaign", "Unlimited creatives", "Full funnel optimization"]
              }].map((plan, i) => (
                <Card key={i} className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold">{plan.name}</h3>
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-4">₦{plan.price}</div>
                    <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                      {plan.perks.map((p, idx) => (
                        <li key={idx}>• {p}</li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full"
                      onClick={() => {
                        const whatsappMessage = `Hello Confidential Connect! I'm interested in the ${plan.name} advertising plan (₦${plan.price}). Can you help me get started?`;
                        const whatsappUrl = `https://wa.me/2347040294858?text=${encodeURIComponent(whatsappMessage)}`;
                        window.open(whatsappUrl, '_blank');
                      }}
                    >
                      Start Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Advertising;
