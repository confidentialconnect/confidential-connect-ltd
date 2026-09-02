import { useEffect, useState } from "react";
import { usePageSEO } from "@/hooks/usePageSEO";
import { Header } from "@/components/Header";
import { GoogleInspiredFooter } from "@/components/GoogleInspiredFooter";
import { ScrollToTop } from "@/components/ScrollToTop";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CatalogProduct, PublicProductCard } from "@/components/PublicProductCard";
import {
    CheckCircle,
    CreditCard,
    Tag,
    Loader2,
} from "lucide-react";

const Pricing = () => {
    const [products, setProducts] = useState<CatalogProduct[]>([]);
    const [loading, setLoading] = useState(true);

    usePageSEO({
        title: 'Pricing',
        description: 'View transparent pricing for document processing, WAEC/NECO result checking, birth certificates, and other services at CONFIDENTIAL CONNECT LTD.',
        keywords: 'pricing confidential connect ltd, WAEC result checker price, birth certificate cost Nigeria, document processing fees',
        canonical: 'https://confidential-connect-ltd.lovable.app/pricing',
    });

    useEffect(() => {
        void (async () => {
            const { data } = await supabase.functions.invoke("public-catalog");
            setProducts(((data as any)?.products as CatalogProduct[]) || []);
            setLoading(false);
        })();
    }, []);

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
                    {loading ? (
                        <div className="flex justify-center py-16">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <PublicProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <Card className="border-border">
                            <CardContent className="py-16 text-center text-muted-foreground">
                                Our current service catalog is being updated. Please check back shortly.
                            </CardContent>
                        </Card>
                    )}
                    </div>

                    {/* Note */}
                    <div className="mt-12 bg-muted/30 border border-border rounded-xl p-6 text-center">
                        <p className="text-sm text-muted-foreground mb-1">
                            <strong className="text-foreground">Note:</strong> Prices are managed from the live product catalog and may change.
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
