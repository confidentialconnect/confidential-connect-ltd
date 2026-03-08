import { Link } from "react-router-dom";
import { Globe, Phone, Mail, MapPin } from "lucide-react";
import officialLogo from "@/assets/official-logo.png";

export const GoogleInspiredFooter = () => {
    const serviceLinks = [
        { name: "Result Checking", href: "/categories" },
        { name: "Document Processing", href: "/categories" },
        { name: "School Registration", href: "/categories" },
        { name: "Digital Services", href: "/categories" },
        { name: "All Services", href: "/products" },
    ];

    const companyLinks = [
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "Payments", href: "/payment-info" },
        { name: "Advertising", href: "/advertising" },
    ];

    const legalLinks = [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms & Conditions", href: "/terms" },
    ];

    return (
        <footer className="bg-card border-t border-border">
            {/* Main Footer */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand Column */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <img 
                                src={officialLogo} 
                                alt="Confidential Connect LTD Logo" 
                                className="h-10 w-auto"
                            />
                            <div>
                                <div className="text-sm font-bold text-foreground leading-tight">
                                    CONFIDENTIAL CONNECT LTD
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    RC 9081270
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            In partnership with <strong className="text-foreground">All Campus Connect TV</strong>
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Your trusted partner for professional documentation, school services, and digital processing.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Globe className="h-4 w-4" />
                            <span>Abuja, Nigeria</span>
                        </div>
                    </div>

                    {/* Services Column */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Services</h3>
                        <ul className="space-y-3">
                            {serviceLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Company</h3>
                        <ul className="space-y-3">
                            {companyLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Contact</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4 mt-0.5 shrink-0" />
                                <div>
                                    <div>+234 704 029 4858</div>
                                    <div>+234 911 715 0406</div>
                                </div>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4 shrink-0" />
                                <span>confidentialconnectltd@gmail.com</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                                <span>Airport Road, close to University of Abuja, Abuja, Nigeria</span>
                            </li>
                        </ul>
                        {/* Social Links */}
                        <div className="mt-4 flex items-center gap-3">
                            <a 
                                href="https://www.tiktok.com/@confidential.connect.ltd" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="TikTok"
                            >
                                TikTok
                            </a>
                            <span className="text-muted-foreground/30">•</span>
                            <a 
                                href="https://wa.me/2347040294858" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="WhatsApp"
                            >
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-border">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                        <p className="text-xs text-muted-foreground text-center sm:text-left">
                            © {new Date().getFullYear()} <strong className="text-foreground">CONFIDENTIAL CONNECT LTD</strong>. All rights reserved.
                            In partnership with <strong className="text-foreground">All Campus Connect TV</strong>.
                        </p>
                        <div className="flex items-center gap-4">
                            {legalLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
