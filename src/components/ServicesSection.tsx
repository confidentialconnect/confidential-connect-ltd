import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BankPaymentModal } from "@/components/BankPaymentModal";
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
    UserCheck,
    ArrowRight
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
        description: "Fast and reliable result checking for WAEC, NECO, NABTEB, and GCE examinations.",
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
        <section id="services" className="py-24 bg-secondary/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4 font-body">Our Services</p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-foreground font-display">
                        Comprehensive Service Solutions
                    </h2>
                    <div className="line-gold mx-auto mb-6" />
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-body leading-relaxed">
                        We provide end-to-end educational and documentation services designed to simplify your journey. 
                        From examination result checking to university enrollment, we've got you covered.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="text-center p-6 bg-card border border-border rounded-xl hover-gold transition-all duration-300">
                                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent mb-3">
                                    <Icon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="text-2xl font-bold text-foreground mb-1 font-display">{stat.number}</div>
                                <div className="text-xs text-muted-foreground font-body">{stat.label}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <Card key={index} className="bg-card border-border hover-gold transition-all duration-300 group">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-accent rounded-xl group-hover:bg-primary/10 transition-colors duration-300">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                        {service.badge && (
                                            <Badge variant="secondary" className="bg-accent text-primary text-xs border border-primary/10 font-body">
                                                {service.badge}
                                            </Badge>
                                        )}
                                    </div>
                                    <CardTitle className="text-lg font-display">{service.title}</CardTitle>
                                    <CardDescription className="font-body">{service.description}</CardDescription>
                                </CardHeader>
                                
                                <CardContent>
                                    <div className="space-y-2.5 mb-5">
                                        {service.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center text-sm font-body">
                                                <CheckCircle className="h-4 w-4 text-primary mr-2.5 shrink-0" />
                                                <span className="text-foreground/70">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {service.title === "Payment Solutions" ? (
                                        <BankPaymentModal>
                                            <Button className="w-full font-body" variant="outline">
                                                View Payment Options
                                            </Button>
                                        </BankPaymentModal>
                                    ) : (
                                        <Button asChild className="w-full font-body" variant="outline">
                                            <a href="/request-service">
                                                Request Service
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                            </a>
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Why Choose Us */}
                <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="text-2xl lg:text-3xl font-bold mb-8 text-foreground font-display">
                                Why Choose Confidential Connect Ltd?
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { icon: Shield, title: "Trusted & Secure", desc: "CAC registered company (RC 9081270). We protect your personal information and ensure secure transactions." },
                                    { icon: Clock, title: "Fast & Reliable", desc: "Most services completed within 24 hours. We deliver quickly without compromising quality." },
                                    { icon: Phone, title: "24/7 Support", desc: "Reach us anytime via WhatsApp, phone, or email. Our dedicated team is always available." },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="p-3 bg-accent rounded-xl shrink-0">
                                            <item.icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-foreground mb-1 font-display">{item.title}</h4>
                                            <p className="text-sm text-muted-foreground font-body leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="bg-foreground rounded-xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
                            <h4 className="text-xl font-bold mb-3 text-background font-display">Ready to Get Started?</h4>
                            <p className="text-background/60 mb-6 text-sm font-body leading-relaxed">
                                Join thousands of satisfied clients who trust us. Get started today and experience the difference.
                            </p>
                            <div className="space-y-3">
                                <Button asChild size="lg" className="w-full gradient-gold text-primary-foreground shadow-gold font-body font-semibold">
                                    <a href="/categories">
                                        Browse Our Services
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </a>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="w-full border-background/20 text-background hover:bg-background/10 font-body">
                                    <a href="/contact">Contact Our Team</a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
