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
        <section className="py-16 bg-card border-y border-border">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <BadgeCheck className="h-4 w-4" />
                        Verified & Trusted
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                        Why Clients Trust Us
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto text-sm">
                        CONFIDENTIAL CONNECT LTD is a verified, CAC-registered company with a proven 
                        track record of serving thousands of satisfied clients.
                    </p>
                </div>

                {/* Trust Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {trustItems.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={idx}
                                className="text-center p-6 bg-background border border-border rounded-xl hover:border-primary/20 transition-colors"
                            >
                                <Icon className="h-7 w-7 text-primary mx-auto mb-3" />
                                <div className="text-2xl font-bold text-foreground mb-1">{item.value}</div>
                                <div className="text-sm font-medium text-foreground/80">{item.label}</div>
                                <div className="text-xs text-muted-foreground mt-1">{item.desc}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Verification Badges */}
                <div className="flex flex-wrap justify-center gap-4">
                    {[
                        "CAC Registered Company",
                        "SSL Encrypted",
                        "reCAPTCHA Protected",
                        "Secure Payments",
                    ].map((badge) => (
                        <div
                            key={badge}
                            className="flex items-center gap-2 bg-primary/5 border border-primary/10 px-4 py-2 rounded-full"
                        >
                            <CheckCircle className="h-4 w-4 text-primary" />
                            <span className="text-xs font-medium text-foreground">{badge}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
