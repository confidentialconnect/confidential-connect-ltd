import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { FooterNew } from "@/components/FooterNew";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
    ArrowLeft, Check, Copy, Building2,
    ShieldCheck, Star, AlertTriangle, ArrowRight,
} from "lucide-react";
import { PromotionProofForm } from "@/components/PromotionProofForm";

type PlanKey = "starter" | "weekly" | "growth" | "premium";

const plans: Record<PlanKey, {
    name: string;
    price: string;
    amount: string;
    period: string;
    description: string;
    features: string[];
    popular?: boolean;
    emoji?: string;
}> = {
    starter: {
        name: "Starter",
        price: "₦2,000",
        amount: "2000",
        period: "1 Day Promotion",
        description: "Quick daily visibility — Morning & Evening promotion.",
        features: [
            "2 posts daily (Morning & Evening)",
            "Quick and affordable visibility",
        ],
    },
    weekly: {
        name: "Weekly",
        price: "₦10,500",
        amount: "10500",
        period: "7 Days Promotion",
        description: "Consistent weekly visibility for better reach.",
        features: [
            "Consistent daily promotion",
            "Better reach and engagement",
        ],
    },
    growth: {
        name: "Growth",
        price: "₦18,200",
        amount: "18200",
        period: "14 Days Promotion",
        description: "Best value for business growth.",
        features: [
            "Extended promotion period",
            "Strong audience reach",
            "Higher engagement",
        ],
        popular: true,
        emoji: "🔥",
    },
    premium: {
        name: "Premium",
        price: "₦36,000",
        amount: "36000",
        period: "30 Days Promotion",
        description: "Maximum visibility with priority placement.",
        features: [
            "Maximum visibility",
            "Priority placement",
            "Long-term promotion",
        ],
        emoji: "💎",
    },
};

const BANK = {
    bank: "Moniepoint MFB",
    accountName: "Confidential Connect Ltd",
    accountNumber: "6919053477",
};

const PromotionPayment = () => {
    const { plan: planParam } = useParams<{ plan: string }>();
    const planKey = (planParam ?? "").toLowerCase() as PlanKey;
    const plan = plans[planKey];
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!plan) return;
        document.title = `${plan.name} Plan Payment — Confidential Connect Ltd`;
        const desc = `Complete your ${plan.name} promotion payment (${plan.price} ${plan.period}) on Confidential Connect Ltd. Bank transfer details and WhatsApp proof submission.`;
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
            meta = document.createElement("meta");
            meta.setAttribute("name", "description");
            document.head.appendChild(meta);
        }
        meta.setAttribute("content", desc);
        window.scrollTo(0, 0);
    }, [plan]);

    if (!plan) {
        return <Navigate to="/" replace />;
    }

    const copyAccount = async () => {
        try {
            await navigator.clipboard.writeText(BANK.accountNumber);
            setCopied(true);
            toast({ title: "Account number copied", description: BANK.accountNumber });
            setTimeout(() => setCopied(false), 2500);
        } catch {
            toast({ title: "Copy failed", description: "Please copy manually.", variant: "destructive" });
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-5xl">
                <Button variant="ghost" size="sm" asChild className="mb-6">
                    <Link to="/#pricing">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Plans
                    </Link>
                </Button>

                <div className="text-center mb-10">
                    <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3 font-body">
                        Complete Your Promotion Payment
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-bold font-display mb-3">
                        {plan.emoji && <span className="mr-2">{plan.emoji}</span>}
                        {plan.name} Plan
                    </h1>
                    <p className="text-muted-foreground font-body max-w-xl mx-auto">{plan.description}</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Plan summary */}
                    <Card className={plan.popular ? "border-primary shadow-brand-lg" : "border-border"}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="font-display text-xl">Plan Summary</CardTitle>
                                {plan.popular && (
                                    <Badge className="gradient-brand text-white border-0 font-body">
                                        <Star className="h-3 w-3 mr-1" /> Most Popular
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-foreground font-display">{plan.price}</span>
                                <span className="text-muted-foreground font-body">{plan.period}</span>
                            </div>
                            <Separator />
                            <div className="space-y-3">
                                {plan.features.map((f, i) => (
                                    <div key={i} className="flex items-start gap-2.5 text-sm font-body">
                                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                        <span className="text-foreground/80">{f}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="rounded-lg bg-accent/60 border border-primary/10 p-3 text-xs text-muted-foreground font-body flex gap-2">
                                <AlertTriangle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <span>Limited promotion slots daily. Payment is required before activation.</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bank transfer */}
                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle className="font-display text-xl flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-primary" />
                                Bank Transfer Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="rounded-lg border border-dashed p-4 space-y-3">
                                <div>
                                    <div className="text-xs text-muted-foreground font-body uppercase tracking-wide">Bank</div>
                                    <div className="font-semibold font-body">{BANK.bank}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground font-body uppercase tracking-wide">Account Name</div>
                                    <div className="font-semibold font-body">{BANK.accountName}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground font-body uppercase tracking-wide">Account Number</div>
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="font-mono text-xl font-bold tracking-wider">{BANK.accountNumber}</div>
                                        <Button size="sm" variant="outline" onClick={copyAccount}>
                                            {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                                            {copied ? "Copied" : "Copy"}
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground font-body uppercase tracking-wide">Amount</div>
                                    <div className="font-bold text-primary font-display text-lg">
                                        {plan.price} <span className="text-sm text-muted-foreground font-body font-normal">({plan.period})</span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-sm text-foreground/80 font-body">
                                After making payment, kindly send your payment evidence and promotion details via WhatsApp.
                            </div>

                            <p className="text-xs text-center text-muted-foreground font-body flex items-center justify-center gap-1.5">
                                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                                Your promotion will be reviewed and activated after payment confirmation.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Payment proof submission form */}
                <Card className="mt-8 border-primary/30">
                    <CardHeader>
                        <CardTitle className="font-display text-xl">Submit Payment Proof</CardTitle>
                        <p className="text-sm text-muted-foreground font-body">
                            Fill in your details and upload your payment screenshot. We'll save your submission and open WhatsApp so you can attach the receipt.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <PromotionProofForm plan={plan} />
                    </CardContent>
                </Card>

                {/* How it works */}
                <div className="mt-12 rounded-xl border bg-card p-6">
                    <h2 className="text-lg font-bold font-display mb-4 text-center">How It Works</h2>
                    <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm font-body">
                        {[
                            "Transfer the exact amount to the account above",
                            "Take a screenshot of your payment receipt",
                            "Fill the form below & submit your proof",
                            "Get admin approval — your promotion goes live",
                        ].map((step, i) => (
                            <li key={i} className="flex gap-3">
                                <span className="shrink-0 w-7 h-7 rounded-full gradient-brand text-white flex items-center justify-center font-bold text-xs">
                                    {i + 1}
                                </span>
                                <span className="text-foreground/80">{step}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </main>
            <FooterNew />
        </div>
    );
};

export default PromotionPayment;