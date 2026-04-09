import { ShieldCheck, Zap, Heart, Network, Headphones } from "lucide-react";

const reasons = [
    {
        icon: ShieldCheck,
        title: "Verified Opportunities",
        description: "Every opportunity and service is vetted for authenticity before being shared on our platform.",
    },
    {
        icon: Zap,
        title: "Fast Updates",
        description: "Get real-time alerts on JAMB, admissions, jobs, and more — never miss a deadline.",
    },
    {
        icon: Heart,
        title: "Trusted Platform",
        description: "CAC Registered (RC 9081270) with thousands of satisfied users across Nigeria.",
    },
    {
        icon: Network,
        title: "Wide Student Network",
        description: "Connected to students and graduates across 36+ states and hundreds of institutions.",
    },
    {
        icon: Headphones,
        title: "Reliable Services",
        description: "24/7 WhatsApp support, fast document processing, and guaranteed service delivery.",
    },
];

export const WhyChooseUs = () => {
    return (
        <section className="py-24 bg-secondary/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4 font-body">Why Us</p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-display">
                        Why Choose Confidential Connect?
                    </h2>
                    <div className="line-gold mx-auto mb-6" />
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
                    {reasons.map((reason, idx) => {
                        const Icon = reason.icon;
                        return (
                            <div
                                key={idx}
                                className="text-center p-6 bg-card border border-border rounded-2xl hover-gold transition-all duration-300 group"
                            >
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent group-hover:bg-primary/10 transition-colors mb-4">
                                    <Icon className="h-7 w-7 text-primary" />
                                </div>
                                <h3 className="text-sm font-bold text-foreground mb-2 font-display">{reason.title}</h3>
                                <p className="text-xs text-muted-foreground font-body leading-relaxed">{reason.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
