import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Phone, ShoppingCart, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, profile, signOut } = useAuth();

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
              <span>07040294858</span>
            </div>
            <Button variant="outline" asChild>
              <Link to="/cart" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Cart ({totalItems})
              </Link>
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {profile?.full_name || user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {profile?.is_admin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
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
                    <span>07040294858</span>
                  </div>
                  
                  <Button variant="outline" asChild className="w-full justify-start">
                    <Link to="/cart" onClick={() => setIsOpen(false)}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Cart ({totalItems})
                    </Link>
                  </Button>
                  
                  {user ? (
                    <div className="space-y-2">
                      <div className="px-2 py-1 text-sm text-muted-foreground">
                        Signed in as {profile?.full_name || user.email}
                      </div>
                      {profile?.is_admin && (
                        <Button variant="outline" asChild className="w-full justify-start">
                          <Link to="/admin" onClick={() => setIsOpen(false)}>
                            <User className="mr-2 h-4 w-4" />
                            Admin Panel
                          </Link>
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          signOut();
                          setIsOpen(false);
                        }}
                        className="w-full justify-start"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Button asChild className="w-full">
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};