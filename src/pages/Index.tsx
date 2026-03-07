import { Header } from "@/components/Header";
import { GoogleInspiredHero } from "@/components/GoogleInspiredHero";
import { PremiumFeatures } from "@/components/PremiumFeatures";
import { InteractiveBackground } from "@/components/InteractiveBackground";
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
    // Set SEO meta tags
    document.title = "Confidential Connect Ltd - Your Trusted Technology Partner";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Comprehensive technology solutions including cybersecurity, software development, cloud services, and technical support. Your trusted partner for secure, innovative digital transformation.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Comprehensive technology solutions including cybersecurity, software development, cloud services, and technical support. Your trusted partner for secure, innovative digital transformation.';
      document.head.appendChild(meta);
    }

    // Add keywords meta tag
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = 'cybersecurity, software development, cloud services, technical support, Nigeria, technology solutions, digital transformation';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen relative bg-background">
      <InteractiveBackground />
      <div className="relative z-10">
        <KeyboardShortcuts />
        <Header />
        <main>
          <GoogleInspiredHero />
          <PremiumFeatures />
          <ProductGrid />
          <ServicesSection />
          <ContactSection />
        </main>
        <GoogleInspiredFooter />
        <SupportWidget />
        <ScrollToTop />
      </div>
    </div>
  );
};

export default Index;
