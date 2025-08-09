import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, Mail, ShoppingCart } from "lucide-react";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "#home" },
    { name: "Products", href: "#products" },
    { name: "Services", href: "#services" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50 animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/3657742a-fb6a-4c1a-a6c1-7bf4cf61cd8e.png" 
              alt="Confidential Connect Logo" 
              className="h-10 w-auto"
            />
            <div className="text-lg font-bold text-gradient">
              Confidential Connect
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Contact Info & Cart */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>+234 800 123 4567</span>
            </div>
            <Button variant="outline" size="sm" className="hover-lift">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-6 mt-8">
                <div className="flex items-center space-x-3">
                  <img 
                    src="/lovable-uploads/3657742a-fb6a-4c1a-a6c1-7bf4cf61cd8e.png" 
                    alt="Confidential Connect Logo" 
                    className="h-8 w-auto"
                  />
                  <span className="text-lg font-bold text-gradient">
                    Confidential Connect
                  </span>
                </div>
                <nav className="flex flex-col space-y-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-foreground hover:text-primary transition-colors duration-200 font-medium text-lg"
                    >
                      {item.name}
                    </a>
                  ))}
                </nav>
                <div className="border-t pt-6 space-y-4">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>+234 800 123 4567</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>info@confidentialconnect.ng</span>
                  </div>
                  <Button className="w-full hover-lift">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    View Cart
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};