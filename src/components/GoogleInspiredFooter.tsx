import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import officialLogo from "@/assets/official-logo.png";

export const GoogleInspiredFooter = () => {
    const serviceLinks = [
        { name: "Result Checking", href: "/categories" },
        { name: "Document Processing", href: "/categories" },
        { name: "School Registration", href: "/categories" },
        { name: "NIN Services", href: "/categories" },
        { name: "All Services", href: "/products" },
    ];

    const companyLinks = [
        { name: "About Us", href: "/about" },
        { name: "Pricing", href: "/pricing" },
        { name: "FAQ", href: "/faq" },
        { name: "Contact", href: "/contact" },
        { name: "Payments", href: "/payment-info" },
    ];

    const legalLinks = [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms & Conditions", href: "/terms" },
    ];

    return (
        <footer className="bg-foreground border-t border-primary/20">
            {/* Gold accent line */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-1 space-y-5">
                        <div className="flex items-center gap-3">
                            <img src={officialLogo} alt="Confidential Connect LTD Logo" className="h-10 w-auto" />
                            <div>
                                <div className="text-sm font-bold text-background tracking-wide font-body">
                                    CONFIDENTIAL CONNECT
                                </div>
                                <div className="text-xs text-primary font-body font-medium">
                                    RC 9081270
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-background/50 font-body leading-relaxed">
                            In partnership with <strong className="text-primary">All Campus Connect TV</strong>
                        </p>
                        <p className="text-sm text-background/40 font-body leading-relaxed">
                            Your trusted partner for professional documentation, school services, and digital processing across Nigeria.
                        </p>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-5 font-body">Services</h3>
                        <ul className="space-y-3">
                            {serviceLinks.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.href} className="text-sm text-background/50 hover:text-primary transition-colors font-body">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-5 font-body">Company</h3>
                        <ul className="space-y-3">
                            {companyLinks.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.href} className="text-sm text-background/50 hover:text-primary transition-colors font-body">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-5 font-body">Contact</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-background/50 font-body">
                                <Phone className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                                <div>
                                    <div>+234 704 029 4858</div>
                                    <div>+234 911 715 0406</div>
                                </div>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-background/50 font-body">
                                <Mail className="h-4 w-4 text-primary shrink-0" />
                                <span>confidentialconnectltd@gmail.com</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-background/50 font-body">
                                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                                <span>Airport Road, close to University of Abuja, Nigeria</span>
                            </li>
                        </ul>
                        <div className="mt-5 flex items-center gap-4">
                            <a href="https://www.tiktok.com/@confidential.connect.ltd" target="_blank" rel="noopener noreferrer" className="text-sm text-background/40 hover:text-primary transition-colors font-body">TikTok</a>
                            <span className="text-background/10">•</span>
                            <a href="https://wa.me/2347040294858" target="_blank" rel="noopener noreferrer" className="text-sm text-background/40 hover:text-primary transition-colors font-body">WhatsApp</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-background/10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                        <p className="text-xs text-background/40 text-center sm:text-left font-body">
                            © {new Date().getFullYear()} <strong className="text-primary">CONFIDENTIAL CONNECT LTD</strong>. All rights reserved.
                        </p>
                        <div className="flex items-center gap-5">
                            {legalLinks.map((link) => (
                                <Link key={link.name} to={link.href} className="text-xs text-background/40 hover:text-primary transition-colors font-body">
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
