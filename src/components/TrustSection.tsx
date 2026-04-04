import { Shield, Users, Award, Clock, CheckCircle, BadgeCheck } from "lucide-react";

const trustItems = [
    {
        icon: Shield,
        label: "CAC Registered",
        value: "RC 9081270",
        desc: "Legally registered company",
    },
    {
        icon: Users,
        label: "Clients Served",
        value: "10,000+",
        desc: "Across Nigeria",
    },
    {
        icon: Award,
        label: "Success Rate",
        value: "99.5%",
        desc: "Service completion",
    },
    {
        icon: Clock,
        label: "Support",
        value: "24/7",
        desc: "Always available",
    },
];

export const TrustSection = () => {
    return (
        <section className="py-20 bg-background border-b border-border">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 border border-primary/20 bg-accent px-5 py-2 rounded-full text-sm font-medium mb-6 font-body">
                        <BadgeCheck className="h-4 w-4 text-primary" />
                        <span className="text-foreground">Verified & Trusted</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 font-display">
                        Why Clients Trust Us
                    </h2>
                    <div className="line-gold mx-auto mb-6" />
                    <p className="text-muted-foreground max-w-2xl mx-auto font-body leading-relaxed">
                        CONFIDENTIAL CONNECT LTD is a verified, CAC-registered company with a proven 
                        track record of serving thousands of satisfied clients across Nigeria.
                    </p>
                </div>

                {/* Trust Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
                    {trustItems.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={idx}
                                className="text-center p-7 bg-card border border-border rounded-xl hover-gold transition-all duration-300 group"
                            >
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent mb-4 group-hover:bg-primary/10 transition-colors">
                                    <Icon className="h-6 w-6 text-primary" />
                                </div>
                                <div className="text-3xl font-bold text-foreground mb-1 font-display">{item.value}</div>
                                <div className="text-sm font-semibold text-foreground/80 font-body">{item.label}</div>
                                <div className="text-xs text-muted-foreground mt-1 font-body">{item.desc}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Verification Badges */}
                <div className="flex flex-wrap justify-center gap-3">
                    {[
                        "CAC Registered Company",
                        "SSL Encrypted",
                        "reCAPTCHA Protected",
                        "Secure Payments",
                    ].map((badge) => (
                        <div
                            key={badge}
                            className="flex items-center gap-2 bg-accent border border-primary/10 px-4 py-2 rounded-full"
                        >
                            <CheckCircle className="h-3.5 w-3.5 text-primary" />
                            <span className="text-xs font-medium text-foreground font-body">{badge}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
