import { Header } from "@/components/Header";
import { GoogleInspiredHero } from "@/components/GoogleInspiredHero";
import { PremiumFeatures } from "@/components/PremiumFeatures";
import { Testimonials } from "@/components/Testimonials";
import { ProductGrid } from "@/components/ProductGrid";
import { ServicesSection } from "@/components/ServicesSection";
import { ContactSection } from "@/components/ContactSection";
import { GoogleInspiredFooter } from "@/components/GoogleInspiredFooter";
import { AIChatWidget } from "@/components/AIChatWidget";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useEffect } from "react";

const Index = () => {
    useEffect(() => {
        document.title = "Confidential Connect Ltd - Professional Documentation & Digital Services";
        
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'CONFIDENTIAL CONNECT LTD — Your trusted partner for document processing, school registration, result verification, and digital services in Nigeria. In partnership with All Campus Connect TV.');
        } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = 'CONFIDENTIAL CONNECT LTD — Your trusted partner for document processing, school registration, result verification, and digital services in Nigeria. In partnership with All Campus Connect TV.';
            document.head.appendChild(meta);
        }

        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            const meta = document.createElement('meta');
            meta.name = 'keywords';
            meta.content = 'document processing, school registration, WAEC result checker, birth certificate, digital services, Nigeria, All Campus Connect TV, Confidential Connect Ltd';
            document.head.appendChild(meta);
        }
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <KeyboardShortcuts />
            <Header />
            <main>
                <GoogleInspiredHero />
                <PremiumFeatures />
                <ProductGrid />
                <Testimonials />
                <ServicesSection />
                <ContactSection />
            </main>
            <GoogleInspiredFooter />
            <AIChatWidget />
            <ScrollToTop />
        </div>
    );
};

export default Index;
