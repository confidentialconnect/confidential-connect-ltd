import { Users, TrendingUp, MapPin, Award } from "lucide-react";

const stats = [
    { icon: Users, value: "10,000+", label: "Students Connected", description: "Across universities & polytechnics" },
    { icon: TrendingUp, value: "500+", label: "Opportunities Shared", description: "Jobs, internships & scholarships" },
    { icon: MapPin, value: "36+", label: "States Reached", description: "Growing across Nigeria" },
    { icon: Award, value: "99.5%", label: "Satisfaction Rate", description: "From verified users" },
];

export const ImpactSection = () => {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 gradient-hero opacity-[0.03]" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4 font-body">Our Impact</p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-display">
                        Numbers That Speak
                    </h2>
                    <div className="line-gold mx-auto mb-6" />
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body leading-relaxed">
                        We're on a mission to connect every Nigerian student and graduate with the opportunities they deserve.
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={idx}
                                className="text-center p-8 bg-card border border-border rounded-2xl hover-gold transition-all duration-300 group"
                            >
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent group-hover:bg-primary/10 transition-colors mb-4">
                                    <Icon className="h-7 w-7 text-primary" />
                                </div>
                                <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1 font-display">{stat.value}</div>
                                <div className="text-sm font-semibold text-foreground/80 font-body">{stat.label}</div>
                                <div className="text-xs text-muted-foreground mt-1 font-body">{stat.description}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
