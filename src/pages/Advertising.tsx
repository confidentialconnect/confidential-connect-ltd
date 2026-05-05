import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Megaphone, Sparkles, LineChart, Users, Star, Zap, Check, ArrowRight } from "lucide-react";

const Advertising = () => {
  useEffect(() => {
    document.title = "Advertising Services | Confidential Connect Ltd";
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
                  const whatsappMessage = `Hello Confidential Connect Ltd! I'm interested in your advertising services and would like to speak with your sales team about growing my business.`;
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
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-2">Promotion Plans</h2>
              <p className="text-muted-foreground">Simple, affordable pricing for students and small business owners.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[{
                name: "Starter", price: "₦2,000", period: "/day", duration: "1 Day Promotion",
                perks: ["2 posts daily (Morning & Evening)", "Quick and affordable visibility"],
                slug: "starter", popular: false,
              },{
                name: "Weekly", price: "₦10,500", period: "", duration: "7 Days Promotion",
                perks: ["Consistent daily promotion", "Better reach and engagement"],
                slug: "weekly", popular: false,
              },{
                name: "Growth", price: "₦18,200", period: "", duration: "14 Days Promotion",
                perks: ["Extended promotion period", "Strong audience reach", "Higher engagement"],
                slug: "growth", popular: true,
              },{
                name: "Premium", price: "₦36,000", period: "", duration: "30 Days Promotion",
                perks: ["Maximum visibility", "Priority placement", "Long-term promotion"],
                slug: "premium", popular: false,
              }].map((plan, i) => (
                <Card key={i} className={`relative overflow-hidden hover-lift ${plan.popular ? 'border-primary shadow-lg scale-[1.02]' : ''}`}>
                  {plan.popular && (
                    <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                      <Star className="h-3 w-3 mr-1" /> Most Popular
                    </Badge>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-3xl font-extrabold text-foreground">{plan.price}</span>
                      {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 rounded-full px-2.5 py-1 mb-4">
                      <Zap className="h-3 w-3" /> {plan.duration}
                    </div>
                    <ul className="space-y-2 text-sm mb-6">
                      {plan.perks.map((p, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span className="text-foreground/80">{p}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
                      <Link to={`/promote/${plan.slug}`}>
                        Start Now <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-8 max-w-lg mx-auto">
              After payment, send your proof and promotion details via WhatsApp for admin approval.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Advertising;
