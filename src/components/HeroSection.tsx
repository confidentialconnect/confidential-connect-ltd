import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight, Rocket, Users, Briefcase } from "lucide-react";

export const HeroSection = () => {
    return (
        <section className="relative min-h-[95vh] flex items-center overflow-hidden gradient-hero">
            {/* Animated background orbs */}
            <div className="absolute top-20 right-[10%] w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px]" style={{ animation: 'pulse-glow 6s ease-in-out infinite' }} />
            <div className="absolute bottom-20 left-[5%] w-[400px] h-[400px] rounded-full bg-[hsl(280_70%_55%_/_0.06)] blur-[100px]" style={{ animation: 'pulse-glow 8s ease-in-out infinite 2s' }} />
            <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-[hsl(170_60%_45%_/_0.04)] blur-[80px]" />

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)',
                backgroundSize: '60px 60px'
            }} />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24 lg:py-32">
                <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 rounded-full px-5 py-2.5">
                        <Rocket className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary/90 font-body tracking-wide">
                            In partnership with All Campus Connect TV
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.08] tracking-tight text-white">
                        Empowering Students.{" "}
                        <span className="block text-gradient-brand bg-clip-text" style={{
                            background: 'linear-gradient(135deg, hsl(246 80% 70%), hsl(280 70% 65%), hsl(170 60% 55%))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Connecting Opportunities.
                        </span>
                        <span className="block text-white/90">Building Futures.</span>
                    </h1>

                    {/* Subtext */}
                    <p className="text-lg sm:text-xl text-white/55 leading-relaxed max-w-2xl mx-auto font-body font-light">
                        We connect students, graduates, and business owners with verified opportunities, 
                        essential services, and growth platforms across Nigeria.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 pt-4">
                        <Button
                            size="lg"
                            className="gradient-brand text-white shadow-brand-lg text-base px-8 font-body font-semibold tracking-wide hover:opacity-90 transition-opacity h-13"
                            asChild
                        >
                            <Link to="/auth">
                                <Users className="h-5 w-5 mr-2" />
                                Join Now
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="text-base px-8 border-white/20 text-white hover:bg-white/10 font-body h-13"
                            asChild
                        >
                            <Link to="/categories">
                                Explore Opportunities
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="ghost"
                            className="text-base px-6 text-white/60 hover:text-white hover:bg-white/5 font-body h-13"
                            asChild
                        >
                            <Link to="/request-service">
                                <Briefcase className="h-4 w-4 mr-2" />
                                Post a Service
                            </Link>
                        </Button>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-6 pt-8 max-w-xl mx-auto">
                        {[
                            { value: "10K+", label: "Students Connected" },
                            { value: "500+", label: "Opportunities Shared" },
                            { value: "36+", label: "States Covered" },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-2xl sm:text-3xl font-bold text-white font-display">{stat.value}</div>
                                <div className="text-xs sm:text-sm text-white/40 font-body mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </section>
    );
};
