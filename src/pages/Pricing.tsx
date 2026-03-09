import { usePageSEO } from "@/hooks/usePageSEO";
import { Header } from "@/components/Header";
import { GoogleInspiredFooter } from "@/components/GoogleInspiredFooter";
import { ScrollToTop } from "@/components/ScrollToTop";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
    FileText,
    GraduationCap,
    CheckCircle,
    CreditCard,
    Utensils,
    Monitor,
    Tag,
} from "lucide-react";

const pricingCategories = [
    {
        title: "Result Checking",
        icon: GraduationCap,
        color: "text-primary",
        items: [
            { name: "WAEC Scratch Card", price: "₦4,200" },
            { name: "NECO Token", price: "₦1,600" },
            { name: "NABTEB Scratch Card", price: "₦1,600" },
            { name: "NABTEB Token", price: "₦1,600" },
            { name: "Result Checker", price: "₦500" },
            { name: "G.C.E. Result Checker", price: "₦500" },
        ],
    },
    {
        title: "Document Processing",
        icon: FileText,
        color: "text-primary",
        items: [
            { name: "Birth Certificate", price: "₦5,000" },
            { name: "State of Origin Certificate", price: "₦12,000" },
            { name: "WAEC Certificate Collection", price: "₦12,000" },
        ],
    },
    {
        title: "School Services",
        icon: GraduationCap,
        color: "text-primary",
        items: [
            { name: "Post UTME Registration", price: "₦6,000" },
            { name: "Hostel Booking", price: "₦20,000" },
            { name: "Course Registration Assistance", price: "From ₦2,000" },
        ],
    },
    {
        title: "Digital Services",
        icon: Monitor,
        color: "text-primary",
        items: [
            { name: "Professional CV Preparation", price: "From ₦3,000" },
            { name: "Graphic Design", price: "From ₦2,000" },
            { name: "Data Entry / Form Filling", price: "From ₦1,000" },
            { name: "Printing & Scanning", price: "From ₦100" },
        ],
    },
    {
        title: "Cyber Cafe Services",
        icon: Monitor,
        color: "text-primary",
        items: [
            { name: "Internet Browsing (per hour)", price: "₦200" },
            { name: "Typing & Printing", price: "From ₦100" },
            { name: "Photocopying", price: "From ₦20" },
        ],
    },
    {
        title: "Food & Refreshments",
        icon: Utensils,
        color: "text-primary",
        items: [
            { name: "Meals (Rice, Beans, etc.)", price: "From ₦500" },
            { name: "Snacks & Drinks", price: "From ₦200" },
        ],
    },
];

const Pricing = () => {
    usePageSEO({
        title: 'Pricing',
        description: 'View transparent pricing for document processing, WAEC/NECO result checking, birth certificates, and other services at CONFIDENTIAL CONNECT LTD.',
        keywords: 'pricing confidential connect, WAEC result checker price, birth certificate cost Nigeria, document processing fees',
        canonical: 'https://confidential-connect-ltd.lovable.app/pricing',
    });

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <ScrollToTop />

            {/* Hero */}
            <section className="bg-primary/5 border-b border-border py-16 mt-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <Tag className="h-4 w-4" />
                        Transparent Pricing
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                        Service Pricing
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Clear, upfront pricing for all our services. No hidden fees. 
                        All prices are in Nigerian Naira (₦).
                    </p>
                </div>
            </section>

            {/* Pricing Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pricingCategories.map((category, idx) => {
                            const Icon = category.icon;
                            return (
                                <Card key={idx} className="bg-card border-border">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <Icon className="h-5 w-5 text-primary" />
                                            </div>
                                            <CardTitle className="text-lg">{category.title}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {category.items.map((item, itemIdx) => (
                                                <div
                                                    key={itemIdx}
                                                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                                                >
                                                    <span className="text-sm text-foreground/80">{item.name}</span>
                                                    <Badge variant="secondary" className="bg-primary/10 text-primary font-semibold text-xs shrink-0 ml-2">
                                                        {item.price}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Note */}
                    <div className="mt-12 bg-muted/30 border border-border rounded-xl p-6 text-center">
                        <p className="text-sm text-muted-foreground mb-1">
                            <strong className="text-foreground">Note:</strong> Prices may be subject to change. 
                            Some services marked "From" have variable pricing based on complexity.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Contact us for a custom quote on bulk orders or special requests.
                        </p>
                    </div>

                    {/* CTA */}
                    <div className="mt-10 text-center">
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button asChild size="lg">
                                <Link to="/products">Order a Service</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline">
                                <Link to="/contact">Get a Custom Quote</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Payment Methods */}
            <section className="py-12 bg-muted/20 border-t border-border">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold text-foreground">Accepted Payment Methods</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">
                        We accept bank transfers and secure online payments via Paystack.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {["Bank Transfer", "Paystack (Card)", "USSD"].map((method) => (
                            <div key={method} className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span className="text-sm text-foreground">{method}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6">
                        <Button asChild variant="link" className="text-primary">
                            <Link to="/payment-info">View Full Payment Details →</Link>
                        </Button>
                    </div>
                </div>
            </section>

            <GoogleInspiredFooter />
            <WhatsAppButton />
        </div>
    );
};

export default Pricing;
