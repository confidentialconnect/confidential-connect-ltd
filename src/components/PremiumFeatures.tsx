import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { 
    FileText, 
    GraduationCap, 
    Shield, 
    Smartphone,
    Monitor,
    Briefcase,
    ArrowRight,
    Check
} from "lucide-react";
import { Link } from "react-router-dom";

export const PremiumFeatures = () => {
    const services = [
        {
            icon: FileText,
            title: "Document Processing",
            description: "Birth certificates, state of origin certificates, WAEC certificates, and other official documentation with authentication guarantee.",
            features: ["Fast processing", "Government endorsed", "Secure handling"],
        },
        {
            icon: GraduationCap,
            title: "School Services",
            description: "University & polytechnic registration, Post-UTME, hostel booking, school fees payment, and academic support.",
            features: ["Expert guidance", "Multiple institutions", "End-to-end support"],
        },
        {
            icon: Shield,
            title: "Result Verification",
            description: "WAEC, NECO, NABTEB, and GCE result checking with instant delivery of scratch cards and verification tokens.",
            features: ["Instant delivery", "All exam types", "Bulk orders available"],
        },
        {
            icon: Briefcase,
            title: "Professional Documentation",
            description: "CV writing, professional profiles, business documentation, and corporate paperwork services.",
            features: ["Professional quality", "Quick turnaround", "Revisions included"],
        },
        {
            icon: Monitor,
            title: "NIN & Identity Services",
            description: "NIN retrieval, identity verification, and other essential digital processing services with full privacy protection.",
            features: ["Secure process", "Online access", "Privacy guaranteed"],
        },
        {
            icon: Smartphone,
            title: "Café & Support Services",
            description: "Cyber café services, printing, photocopying, scanning, and on-site technical assistance.",
            features: ["Walk-in service", "Affordable pricing", "Expert staff"],
        },
    ];

    return (
        <section className="py-24 bg-secondary/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4 font-body">What We Offer</p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-display">
                        Comprehensive Service Solutions
                    </h2>
                    <div className="line-gold mx-auto mb-6" />
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-body leading-relaxed">
                        From document processing to school registrations, we provide end-to-end services 
                        that simplify your academic and professional documentation needs.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {services.map((service, index) => {
                        const IconComponent = service.icon;
                        return (
                            <Card 
                                key={index} 
                                className="bg-card border-border hover-gold transition-all duration-300 hover:-translate-y-1 group"
                            >
                                <CardContent className="p-7 space-y-5">
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent group-hover:bg-primary/10 transition-colors duration-300">
                                        <IconComponent className="h-7 w-7 text-primary" />
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-foreground font-display">{service.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed font-body">{service.description}</p>
                                    
                                    <div className="space-y-2.5 pt-2">
                                        {service.features.map((feature, i) => (
                                            <div key={i} className="flex items-center gap-2.5 text-sm font-body">
                                                <Check className="h-4 w-4 text-primary shrink-0" />
                                                <span className="text-foreground/70">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="text-center bg-foreground rounded-2xl p-12 max-w-3xl mx-auto relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
                    <h3 className="text-2xl lg:text-3xl font-bold text-background mb-4 font-display">
                        Ready to Get Started?
                    </h3>
                    <p className="text-background/60 mb-8 max-w-lg mx-auto font-body">
                        Join thousands of clients who trust <strong className="text-primary">CONFIDENTIAL CONNECT LTD</strong> for their 
                        documentation and service needs.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" className="gradient-gold text-primary-foreground px-8 shadow-gold font-body font-semibold tracking-wide" asChild>
                            <Link to="/categories">
                                Browse Services
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                        </Button>
                        <Button 
                            size="lg" 
                            variant="outline"
                            className="px-8 border-background/20 text-background hover:bg-background/10 font-body"
                            onClick={() => {
                                window.open(`https://wa.me/2347040294858?text=${encodeURIComponent("Hello Confidential Connect Ltd! I'd like to learn more about your services.")}`, '_blank');
                            }}
                        >
                            <Smartphone className="h-4 w-4 mr-2" />
                            Chat on WhatsApp
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};
