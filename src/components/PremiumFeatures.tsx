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
            title: "Digital Services",
            description: "Online registrations, NIN retrieval, identity verification, and other essential digital processing services.",
            features: ["Secure process", "Online access", "24/7 availability"],
        },
        {
            icon: Smartphone,
            title: "Café & Support Services",
            description: "Cyber café services, printing, photocopying, scanning, and on-site technical assistance.",
            features: ["Walk-in service", "Affordable pricing", "Expert staff"],
        },
    ];

    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-14">
                    <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">What We Offer</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                        Comprehensive Service Solutions
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        From document processing to school registrations, we provide end-to-end services 
                        that simplify your academic and professional documentation needs.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
                    {services.map((service, index) => {
                        const IconComponent = service.icon;
                        return (
                            <Card 
                                key={index} 
                                className="bg-card border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 group"
                            >
                                <CardContent className="p-6 space-y-4">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
                                        <IconComponent className="h-6 w-6 text-primary" />
                                    </div>
                                    
                                    <h3 className="text-xl font-semibold text-foreground">{service.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                                    
                                    <div className="space-y-2 pt-2">
                                        {service.features.map((feature, i) => (
                                            <div key={i} className="flex items-center gap-2.5 text-sm">
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
                <div className="text-center bg-card border border-border rounded-2xl p-10 max-w-3xl mx-auto">
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                        Ready to Get Started?
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                        Join thousands of clients who trust <strong>CONFIDENTIAL CONNECT LTD</strong> for their 
                        documentation and service needs.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" className="px-8" asChild>
                            <Link to="/categories">
                                Browse Services
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                        </Button>
                        <Button 
                            size="lg" 
                            variant="outline"
                            className="px-8"
                            onClick={() => {
                                const msg = `Hello Confidential Connect Ltd! I'd like to learn more about your services.`;
                                window.open(`https://wa.me/2347040294858?text=${encodeURIComponent(msg)}`, '_blank');
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
