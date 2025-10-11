import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Phone, ShoppingCart, User, LogOut, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { GoogleAppsMenu } from "./GoogleAppsMenu";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, profile, signOut } = useAuth();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Categories", href: "/categories" },
    { name: "Payments", href: "/payment-info" },
    { name: "Advertising", href: "/advertising" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
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
              <Link
                key={item.name}
                to={item.href}
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Google-style Right Side */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Contact Info */}
            <div className="flex items-center space-x-4 mr-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@confidentialconnect.ng</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>07040294858</span>
              </div>
            </div>

            {/* Cart */}
            <Button variant="ghost" size="sm" asChild className="relative">
              <Link to="/cart" className="flex items-center gap-1">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </Button>

            {/* Google Apps Menu */}
            <GoogleAppsMenu />
            
            {/* User Account */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {(profile?.full_name || user.email)?.charAt(0).toUpperCase()}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium">{profile?.full_name || "User"}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist">Wishlist</Link>
                  </DropdownMenuItem>
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
              <Button asChild size="sm">
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
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-foreground hover:text-primary transition-colors duration-200 font-medium text-lg"
                    >
                      {item.name}
                    </Link>
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
                      <Button variant="outline" asChild className="w-full justify-start">
                        <Link to="/profile" onClick={() => setIsOpen(false)}>
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="w-full justify-start">
                        <Link to="/orders" onClick={() => setIsOpen(false)}>
                          <User className="mr-2 h-4 w-4" />
                          My Orders
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="w-full justify-start">
                        <Link to="/wishlist" onClick={() => setIsOpen(false)}>
                          <User className="mr-2 h-4 w-4" />
                          Wishlist
                        </Link>
                      </Button>
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