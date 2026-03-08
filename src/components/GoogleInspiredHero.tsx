import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
    FileText, 
    GraduationCap, 
    Shield, 
    Smartphone,
    ArrowRight,
    CheckCircle,
    Users,
    Clock,
    Award
} from "lucide-react";
import officialLogo from "@/assets/official-logo.png";

export const GoogleInspiredHero = () => {
    const quickStats = [
        { icon: Users, value: "10,000+", label: "Clients Served" },
        { icon: Award, value: "99.5%", label: "Success Rate" },
        { icon: Clock, value: "24/7", label: "Support Available" },
        { icon: Shield, value: "CAC", label: "Registered Company" },
    ];

    const highlights = [
        "Document processing & authentication",
        "School registration & result checking",
        "Digital services & online processing",
        "Professional CV & documentation",
    ];

    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl translate-y-1/2 -translate-x-1/4" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left Column - Content */}
                    <div className="space-y-8 animate-fade-in">
                        {/* Partnership Badge */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-sm font-medium">
                                <Shield className="h-3.5 w-3.5 mr-1.5" />
                                CAC Registered — RC 9081270
                            </Badge>
                            <Badge variant="outline" className="px-4 py-1.5 text-sm text-muted-foreground">
                                In partnership with All Campus Connect TV
                            </Badge>
                        </div>

                        {/* Main Headline */}
                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                                <span className="text-foreground">Your Trusted Partner for </span>
                                <span className="text-gradient">Professional Documentation</span>
                                <span className="text-foreground"> & Digital Services</span>
                            </h1>
                            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
                                We help individuals and institutions process important documentation,
                                school registrations, and digital services — quickly, securely, and reliably.
                            </p>
                        </div>

                        {/* Highlights */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {highlights.map((item, i) => (
                                <div key={i} className="flex items-center gap-2.5 text-sm text-foreground/80">
                                    <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <Button 
                                size="lg" 
                                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 text-base px-8"
                                asChild
                            >
                                <Link to="/categories">
                                    Apply for Service
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Link>
                            </Button>
                            <Button 
                                size="lg" 
                                variant="outline"
                                className="text-base px-8"
                                asChild
                            >
                                <Link to="/contact">
                                    Contact Us
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="ghost"
                                className="text-base px-6"
                                onClick={() => {
                                    const msg = `Hello Confidential Connect Ltd! I'd like to get started with your services.`;
                                    window.open(`https://wa.me/2347040294858?text=${encodeURIComponent(msg)}`, '_blank');
                                }}
                            >
                                <Smartphone className="h-4 w-4 mr-2" />
                                WhatsApp Us
                            </Button>
                        </div>
                    </div>

                    {/* Right Column - Stats & Trust */}
                    <div className="space-y-6 animate-slide-up">
                        {/* Logo Card */}
                        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 text-center">
                            <img 
                                src={officialLogo} 
                                alt="Confidential Connect LTD Logo" 
                                className="h-20 w-auto mx-auto mb-4"
                            />
                            <h2 className="text-2xl font-bold text-foreground mb-1">
                                CONFIDENTIAL CONNECT LTD
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                In partnership with <strong>All Campus Connect TV</strong>
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {quickStats.map((stat, index) => {
                                const IconComponent = stat.icon;
                                return (
                                    <div 
                                        key={index} 
                                        className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-5 text-center hover:border-primary/30 transition-colors duration-300"
                                    >
                                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mb-3">
                                            <IconComponent className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                                        <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Service Quick Links */}
                        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Popular Services</h3>
                            <div className="space-y-3">
                                {[
                                    { icon: FileText, label: "WAEC Result Checker", price: "₦4,200" },
                                    { icon: GraduationCap, label: "Post-UTME Registration", price: "₦6,000" },
                                    { icon: Shield, label: "Birth Certificate", price: "₦5,000" },
                                ].map((service, i) => (
                                    <Link 
                                        key={i}
                                        to="/categories"
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <service.icon className="h-4 w-4 text-primary" />
                                            <span className="text-sm font-medium">{service.label}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-primary">{service.price}</span>
                                            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
