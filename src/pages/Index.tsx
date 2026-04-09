import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ServiceCategories } from "@/components/ServiceCategories";
import { MoneyMakingFeatures } from "@/components/MoneyMakingFeatures";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { ImpactSection } from "@/components/ImpactSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CTASection } from "@/components/CTASection";
import { ContactSectionNew } from "@/components/ContactSectionNew";
import { FooterNew } from "@/components/FooterNew";
import { ProductGrid } from "@/components/ProductGrid";
import { AIChatWidget } from "@/components/AIChatWidget";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { ScrollToTop } from "@/components/ScrollToTop";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useEffect } from "react";

const Index = () => {
    useEffect(() => {
        document.title = "Confidential Connect Ltd — Empowering Students, Connecting Opportunities";
        
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Confidential Connect Ltd — Your trusted platform for student empowerment, job opportunities, document services, and business promotion across Nigeria. In partnership with All Campus Connect TV.');
        } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = 'Confidential Connect Ltd — Your trusted platform for student empowerment, job opportunities, document services, and business promotion across Nigeria. In partnership with All Campus Connect TV.';
            document.head.appendChild(meta);
        }

        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            const meta = document.createElement('meta');
            meta.name = 'keywords';
            meta.content = 'student opportunities, job listings Nigeria, document services, WAEC result checker, business promotion, student empowerment, Confidential Connect Ltd, All Campus Connect TV';
            document.head.appendChild(meta);
        }
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <KeyboardShortcuts />
            <Header />
            <main>
                <HeroSection />
                <AboutSection />
                <ServiceCategories />
                <ProductGrid />
                <MoneyMakingFeatures />
                <WhyChooseUs />
                <ImpactSection />
                <TestimonialsSection />
                <CTASection />
                <ContactSectionNew />
            </main>
            <FooterNew />
            <AIChatWidget />
            <WhatsAppButton />
            <ScrollToTop />
        </div>
    );
};

export default Index;
