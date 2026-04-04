import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { 
    ArrowRight,
    CheckCircle,
    Shield,
    Users,
    Clock,
    Award,
    Smartphone,
    Star
} from "lucide-react";
import officialLogo from "@/assets/official-logo.png";

export const GoogleInspiredHero = () => {
    const stats = [
        { icon: Users, value: "10,000+", label: "Clients Served" },
        { icon: Award, value: "99.5%", label: "Success Rate" },
        { icon: Clock, value: "24hrs", label: "Fast Delivery" },
        { icon: Shield, value: "CAC", label: "Registered" },
    ];

    return (
        <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-foreground">
            {/* Subtle gold accents */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px] -translate-y-1/3 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-primary/3 blur-[100px] translate-y-1/3 -translate-x-1/4" />
            
            {/* Decorative gold line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24 lg:py-32">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
                    {/* Left — Content */}
                    <div className="space-y-8 animate-fade-in">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 rounded-full px-5 py-2">
                            <Shield className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary font-body tracking-wide">CAC Registered — RC 9081270</span>
                        </div>

                        {/* Headline */}
                        <div className="space-y-6">
                            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold leading-[1.1] tracking-tight text-background">
                                Your Trusted Partner for{" "}
                                <span className="text-gradient-gold">Professional Services</span>
                            </h1>
                            <p className="text-lg sm:text-xl text-background/60 leading-relaxed max-w-xl font-body font-light">
                                We deliver fast, secure, and reliable documentation processing, 
                                WAEC result verification, NIN assistance, and student support services 
                                across Nigeria.
                            </p>
                        </div>

                        {/* Trust points */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                "WAEC & NECO result checking",
                                "Certificate processing",
                                "NIN verification assistance",
                                "Student support services",
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2.5 text-sm text-background/70 font-body">
                                    <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-4 pt-2">
                            <Button 
                                size="lg" 
                                className="gradient-gold text-primary-foreground shadow-gold-lg text-base px-8 font-body font-semibold tracking-wide hover:opacity-90 transition-opacity"
                                asChild
                            >
                                <Link to="/categories">
                                    Get Started
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Link>
                            </Button>
                            <Button 
                                size="lg" 
                                variant="outline"
                                className="text-base px-8 border-background/20 text-background hover:bg-background/10 hover:text-background font-body"
                                asChild
                            >
                                <Link to="/contact">Contact Us</Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="ghost"
                                className="text-base px-6 text-background/70 hover:text-primary hover:bg-transparent font-body"
                                onClick={() => {
                                    window.open(`https://wa.me/2347040294858?text=${encodeURIComponent("Hello Confidential Connect Ltd! I'd like to get started with your services.")}`, '_blank');
                                }}
                            >
                                <Smartphone className="h-4 w-4 mr-2" />
                                WhatsApp
                            </Button>
                        </div>

                        {/* Social proof */}
                        <div className="flex items-center gap-3 pt-4">
                            <div className="flex -space-x-2">
                                {["A", "B", "C", "D", "E"].map((l, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-foreground bg-primary/20 flex items-center justify-center text-xs font-bold text-primary font-body">
                                        {l}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className="h-3.5 w-3.5 text-primary fill-primary" />
                                    ))}
                                </div>
                                <p className="text-xs text-background/50 font-body">Trusted by 10,000+ clients</p>
                            </div>
                        </div>
                    </div>

                    {/* Right — Visual */}
                    <div className="space-y-6 animate-slide-up">
                        {/* Logo showcase */}
                        <div className="bg-background/5 backdrop-blur-sm border border-background/10 rounded-2xl p-10 text-center">
                            <img 
                                src={officialLogo} 
                                alt="Confidential Connect LTD Official Logo" 
                                className="h-24 w-auto mx-auto mb-6"
                            />
                            <h2 className="text-2xl font-bold text-background font-display mb-2">
                                CONFIDENTIAL CONNECT LTD
                            </h2>
                            <p className="text-sm text-primary font-body font-medium tracking-wider">
                                In partnership with All Campus Connect TV
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            {stats.map((stat, i) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={i} className="bg-background/5 backdrop-blur-sm border border-background/10 rounded-xl p-5 text-center hover:border-primary/30 transition-all duration-300">
                                        <Icon className="h-5 w-5 text-primary mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-background font-display">{stat.value}</div>
                                        <div className="text-xs text-background/50 mt-1 font-body">{stat.label}</div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Popular services quick access */}
                        <div className="bg-background/5 backdrop-blur-sm border border-background/10 rounded-2xl p-6">
                            <h3 className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4 font-body">Popular Services</h3>
                            <div className="space-y-3">
                                {[
                                    { label: "WAEC Result Checker", price: "₦4,200" },
                                    { label: "Post-UTME Registration", price: "₦6,000" },
                                    { label: "Birth Certificate", price: "₦5,000" },
                                ].map((s, i) => (
                                    <Link key={i} to="/categories" className="flex items-center justify-between p-3 rounded-lg hover:bg-background/5 transition-colors group">
                                        <span className="text-sm font-medium text-background/80 font-body">{s.label}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-primary font-body">{s.price}</span>
                                            <ArrowRight className="h-3.5 w-3.5 text-background/30 group-hover:text-primary transition-colors" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom decorative line */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </section>
    );
};
