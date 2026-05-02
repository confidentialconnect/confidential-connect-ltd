import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";
import {
    Megaphone, Briefcase, FileCheck, Crown, CreditCard,
    ArrowRight, Check, Zap, Star
} from "lucide-react";

const pricingPlans = [
    {
        name: "Starter",
        price: "₦2,000",
        period: "/day",
        duration: "1 Day Promotion",
        description: "Quick daily visibility",
        features: ["2 posts daily (Morning & Evening)", "Quick and affordable visibility"],
        popular: false,
        emoji: "",
        slug: "starter",
    },
    {
        name: "Weekly",
        price: "₦10,500",
        period: "",
        duration: "7 Days Promotion",
        description: "Consistent weekly visibility",
        features: ["Consistent daily promotion", "Better reach and engagement"],
        popular: false,
        emoji: "",
        slug: "weekly",
    },
    {
        name: "Growth",
        price: "₦18,200",
        period: "",
        duration: "14 Days Promotion",
        description: "Best value for business growth",
        features: ["Extended promotion period", "Strong audience reach", "Higher engagement"],
        popular: true,
        emoji: "🔥",
        slug: "growth",
    },
    {
        name: "Premium",
        price: "₦36,000",
        period: "",
        duration: "30 Days Promotion",
        description: "Maximum visibility & results",
        features: ["Maximum visibility", "Priority placement", "Long-term promotion"],
        popular: false,
        emoji: "💎",
        slug: "premium",
    },
];

const revenueFeatures = [
    {
        icon: Megaphone,
        title: "Paid Promotions",
        description: "Users can pay to promote their business, products, or ads to our growing student network.",
        cta: "Promote Now",
        link: "/advertising",
    },
    {
        icon: Briefcase,
        title: "Job Posting System",
        description: "Employers can post jobs, internships, and freelance gigs. Paid listings get premium placement.",
        cta: "Post a Job",
        link: "/request-service",
    },
    {
        icon: FileCheck,
        title: "Service Requests",
        description: "Users can request document processing, certificate services, and more through our platform.",
        cta: "Request Now",
        link: "/request-service",
    },
    {
        icon: Crown,
        title: "Premium Membership",
        description: "Exclusive access to verified opportunities, early job alerts, and priority service processing.",
        cta: "Go Premium",
        link: "/pricing",
    },
];

export const MoneyMakingFeatures = () => {
    return (
        <section id="pricing" className="py-24 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4 font-body">Grow With Us</p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-display">
                        Your Platform for Growth
                    </h2>
                    <div className="line-gold mx-auto mb-6" />
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-body leading-relaxed">
                        Whether you're promoting a business, hiring talent, or accessing services — 
                        our platform helps you achieve more.
                    </p>
                </div>

                {/* Revenue features grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {revenueFeatures.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <Card key={idx} className="bg-card border-border hover-gold transition-all duration-300 hover:-translate-y-1 group">
                                <CardContent className="p-6 space-y-4">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent group-hover:bg-primary/10 transition-colors">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground font-display">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground font-body leading-relaxed">{feature.description}</p>
                                    <Button variant="outline" size="sm" className="w-full font-body" asChild>
                                        <Link to={feature.link}>
                                            {feature.cta}
                                            <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Pricing Plans */}
                <div className="text-center mb-12">
                    <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 font-display">
                        Promotion Plans
                    </h3>
                    <p className="text-muted-foreground max-w-xl mx-auto font-body">
                        Choose a plan that fits your business goals and budget.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-8">
                    {pricingPlans.map((plan, idx) => (
                        <Card key={idx} className={`relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                            plan.popular 
                                ? 'border-primary shadow-brand-lg scale-[1.02]' 
                                : 'bg-card border-border hover-gold'
                        }`}>
                            {plan.popular && (
                                <div className="absolute top-0 left-0 right-0 h-1 gradient-brand" />
                            )}
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-display">
                                        {plan.emoji && <span className="mr-1">{plan.emoji}</span>}
                                        {plan.name}
                                    </CardTitle>
                                    {plan.popular && (
                                        <Badge className="gradient-brand text-white border-0 font-body">
                                            <Star className="h-3 w-3 mr-1" />
                                            Most Popular
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground font-body">{plan.description}</p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-extrabold text-foreground font-display">{plan.price}</span>
                                        {plan.period && (
                                            <span className="text-sm text-muted-foreground font-body">{plan.period}</span>
                                        )}
                                    </div>
                                    <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 rounded-full px-2.5 py-1 font-body">
                                        <Zap className="h-3 w-3" />
                                        {plan.duration}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2.5 text-sm font-body">
                                            <Check className="h-4 w-4 text-primary shrink-0" />
                                            <span className="text-foreground/70">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    className={`w-full font-body font-semibold ${plan.popular ? 'gradient-brand text-white shadow-brand' : ''}`}
                                    variant={plan.popular ? "default" : "outline"}
                                    asChild
                                >
                                    <Link to={`/promote/${plan.slug}`}>
                                        Start Now
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Payment & urgency notes */}
                <div className="text-center space-y-4 mb-8">
                    <p className="text-sm text-muted-foreground font-body">
                        All plans require payment before activation.
                    </p>
                    <p className="text-sm font-medium text-primary font-body">
                        ⚠ Limited promotion slots available daily to ensure quality exposure.
                    </p>
                    <p className="text-xs text-muted-foreground font-body max-w-lg mx-auto">
                        After making payment, kindly send your payment evidence and promotion details via WhatsApp.
                    </p>
                </div>

                {/* Payment Integration note */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-accent border border-primary/10 rounded-full px-5 py-2.5">
                        <CreditCard className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground font-body">
                            Secure payments via Paystack, Bank Transfer & USSD accepted
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};
