import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Phone, ShoppingCart, User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import officialLogo from "@/assets/official-logo.png";

export const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { totalItems } = useCart();
    const { user, profile, isAdmin, signOut } = useAuth();

    const navigation = [
        { name: "Home", href: "/" },
        { name: "Services", href: "/categories" },
        { name: "Pricing", href: "/pricing" },
        { name: "About", href: "/about" },
        { name: "FAQ", href: "/faq" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <header className="fixed top-0 w-full bg-background/95 backdrop-blur-md border-b border-border z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 shrink-0">
                        <img 
                            src={officialLogo} 
                            alt="Confidential Connect LTD Logo" 
                            className="h-9 w-auto"
                        />
                        <div className="hidden sm:block">
                            <div className="text-sm font-bold text-foreground leading-tight">
                                CONFIDENTIAL CONNECT LTD
                            </div>
                            <div className="text-[10px] text-muted-foreground leading-tight">
                                In partnership with All Campus Connect TV
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link
                            to="/payment-info"
                            className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
                        >
                            Payments
                        </Link>
                    </nav>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2">
                        {/* Phone - Desktop */}
                        <a 
                            href="tel:+2347040294858" 
                            className="hidden lg:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
                        >
                            <Phone className="h-4 w-4" />
                            <span>07040294858</span>
                        </a>

                        {/* Cart */}
                        <Button variant="ghost" size="icon" asChild className="relative">
                            <Link to="/cart">
                                <ShoppingCart className="h-5 w-5" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        </Button>

                        {/* User Account */}
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="gap-2">
                                        <div className="w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-semibold">
                                            {(profile?.full_name || user.email)?.charAt(0).toUpperCase()}
                                        </div>
                                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <div className="px-3 py-2">
                                        <p className="text-sm font-medium">{profile?.full_name || "User"}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link to="/dashboard">My Dashboard</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link to="/request-service">Request Service</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link to="/profile">Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link to="/orders">My Orders</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link to="/wishlist">Wishlist</Link>
                                    </DropdownMenuItem>
                                    {isAdmin && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link to="/admin">Admin Panel</Link>
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={signOut}>
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button size="sm" asChild>
                                <Link to="/auth">Sign In</Link>
                            </Button>
                        )}

                        {/* Mobile Menu */}
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild className="lg:hidden">
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[280px]">
                                <div className="flex flex-col mt-6">
                                    {/* Logo */}
                                    <div className="flex items-center gap-2.5 mb-6 pb-6 border-b border-border">
                                        <img 
                                            src={officialLogo} 
                                            alt="Logo" 
                                            className="h-8 w-auto"
                                        />
                                        <div>
                                            <div className="text-xs font-bold text-foreground leading-tight">
                                                CONFIDENTIAL CONNECT LTD
                                            </div>
                                            <div className="text-[10px] text-muted-foreground">
                                                All Campus Connect TV
                                            </div>
                                        </div>
                                    </div>

                                    {/* Nav Links */}
                                    <nav className="flex flex-col gap-1">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                onClick={() => setIsOpen(false)}
                                                className="px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted/50 rounded-md transition-colors"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                        <Link
                                            to="/payment-info"
                                            onClick={() => setIsOpen(false)}
                                            className="px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted/50 rounded-md transition-colors"
                                        >
                                            Payments
                                        </Link>
                                    </nav>

                                    {/* Divider */}
                                    <div className="border-t border-border my-4" />

                                    {/* Actions */}
                                    <div className="space-y-2">
                                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                                            <Link to="/cart" onClick={() => setIsOpen(false)}>
                                                <ShoppingCart className="mr-2 h-4 w-4" />
                                                Cart ({totalItems})
                                            </Link>
                                        </Button>

                                        {user ? (
                                            <>
                                                <div className="px-3 py-1.5 text-xs text-muted-foreground">
                                                    {profile?.full_name || user.email}
                                                </div>
                                                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                                                    <Link to="/profile" onClick={() => setIsOpen(false)}>
                                                        <User className="mr-2 h-4 w-4" />
                                                        Profile
                                                    </Link>
                                                </Button>
                                                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                                                    <Link to="/orders" onClick={() => setIsOpen(false)}>
                                                        My Orders
                                                    </Link>
                                                </Button>
                                                {isAdmin && (
                                                    <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                                                        <Link to="/admin" onClick={() => setIsOpen(false)}>
                                                            Admin Panel
                                                        </Link>
                                                    </Button>
                                                )}
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    className="w-full justify-start"
                                                    onClick={() => { signOut(); setIsOpen(false); }}
                                                >
                                                    <LogOut className="mr-2 h-4 w-4" />
                                                    Sign Out
                                                </Button>
                                            </>
                                        ) : (
                                            <Button size="sm" className="w-full" asChild>
                                                <Link to="/auth" onClick={() => setIsOpen(false)}>
                                                    Sign In
                                                </Link>
                                            </Button>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div className="border-t border-border mt-4 pt-4">
                                        <a 
                                            href="tel:+2347040294858" 
                                            className="flex items-center gap-2 text-sm text-muted-foreground"
                                        >
                                            <Phone className="h-4 w-4" />
                                            07040294858
                                        </a>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
};
