import { Header } from "@/components/Header";
import { GoogleInspiredHero } from "@/components/GoogleInspiredHero";
import { ProductGrid } from "@/components/ProductGrid";
import { ServicesSection } from "@/components/ServicesSection";
import { ContactSection } from "@/components/ContactSection";
import { GoogleInspiredFooter } from "@/components/GoogleInspiredFooter";
import { SupportWidget } from "@/components/SupportWidget";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <GoogleInspiredHero />
        <ProductGrid />
        <ServicesSection />
        <ContactSection />
      </main>
      <GoogleInspiredFooter />
      <SupportWidget />
    </div>
  );
};

export default Index;
