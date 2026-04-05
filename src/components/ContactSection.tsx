import { useState } from "react";
import { useNavigate } from "react-router-dom";
import whatsappQrCode from "@/assets/whatsapp-qr-code.jpg";
import { BankPaymentModal } from "@/components/BankPaymentModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
    Phone, Mail, MapPin, Clock, Send, MessageSquare,
    CreditCard, Smartphone, Building2, Banknote, Shield,
    Facebook, Instagram, Linkedin, ArrowRight
} from "lucide-react";

export const ContactSection = () => {
    const navigate = useNavigate();
    const [showCashDialog, setShowCashDialog] = useState(false);

    const paymentMethods = [
        { name: "Bank Transfer", icon: Building2, description: "All Nigerian banks", action: "bank" },
        { name: "Card Payment", icon: CreditCard, description: "Visa, Mastercard, Verve", action: "card" },
        { name: "Mobile Money", icon: Smartphone, description: "Opay, PalmPay, Kuda", action: "mobile" },
        { name: "Cash Payment", icon: Banknote, description: "Office location only", action: "cash" }
    ];

    return (
        <section id="contact" className="py-24 bg-secondary/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4 font-body">Contact Us</p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-foreground font-display">Get in Touch</h2>
                    <div className="line-gold mx-auto mb-6" />
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body leading-relaxed">
                        Have a question or need assistance? Our team is ready to help you with any service or inquiry.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 mb-16">
                    {/* Contact Form */}
                    <Card className="border-border hover-gold">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-accent rounded-xl">
                                    <MessageSquare className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-display">Send us a Message</CardTitle>
                                    <CardDescription className="font-body">We respond within 24 hours</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="contact-firstName" className="text-sm font-medium font-body">First Name</Label>
                                    <Input id="contact-firstName" placeholder="Your first name" className="font-body" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="contact-lastName" className="text-sm font-medium font-body">Last Name</Label>
                                    <Input id="contact-lastName" placeholder="Your last name" className="font-body" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="contact-email" className="text-sm font-medium font-body">Email Address</Label>
                                <Input id="contact-email" type="email" placeholder="your.email@example.com" className="font-body" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="contact-phone" className="text-sm font-medium font-body">Phone Number</Label>
                                <Input id="contact-phone" type="tel" placeholder="+234 800 000 0000" className="font-body" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="contact-service" className="text-sm font-medium font-body">Service Interested In</Label>
                                <Input id="contact-service" placeholder="e.g., WAEC Result Checker, NIN Retrieval" className="font-body" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="contact-message" className="text-sm font-medium font-body">Message</Label>
                                <Textarea id="contact-message" placeholder="Tell us how we can help you..." className="min-h-[100px] font-body" />
                            </div>
                            <Button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    const firstName = (document.getElementById('contact-firstName') as HTMLInputElement)?.value || '';
                                    const lastName = (document.getElementById('contact-lastName') as HTMLInputElement)?.value || '';
                                    const email = (document.getElementById('contact-email') as HTMLInputElement)?.value || '';
                                    const phone = (document.getElementById('contact-phone') as HTMLInputElement)?.value || '';
                                    const service = (document.getElementById('contact-service') as HTMLInputElement)?.value || '';
                                    const message = (document.getElementById('contact-message') as HTMLTextAreaElement)?.value || '';
                                    const whatsappMessage = `Hello Confidential Connect Ltd!\n\n*Name:* ${firstName} ${lastName}\n*Email:* ${email}\n*Phone:* ${phone}\n*Service:* ${service}\n*Message:* ${message}\n\nPlease respond to this inquiry. Thank you!`;
                                    window.open(`https://wa.me/2347040294858?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
                                }}
                                className="w-full gradient-gold text-primary-foreground shadow-gold font-body font-semibold"
                                size="lg"
                            >
                                <Send className="h-4 w-4 mr-2" />
                                Send Message
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <div className="space-y-6">
                        <Card className="border-border hover-gold">
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2 font-display">
                                    <Shield className="h-5 w-5 text-primary" />
                                    Contact Information
                                </CardTitle>
                                <CardDescription className="font-body">Multiple channels for your convenience</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                {[
                                    { icon: Phone, title: "Phone Support", lines: ["+234 704 029 4858", "+234 911 715 0406"], note: "Available Mon-Sat" },
                                    { icon: Mail, title: "Email", lines: ["confidentialconnectltd@gmail.com"], note: "Response within 24 hours" },
                                    { icon: MapPin, title: "Office Location", lines: ["Close to KCE Villa, Iddo Sarki", "Airport Road, Abuja, Nigeria"], note: "" },
                                    { icon: Clock, title: "Working Hours", lines: ["Mon-Fri: 8:00 AM - 6:00 PM", "Saturday: 9:00 AM - 4:00 PM", "Sunday: Closed"], note: "" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="p-2.5 bg-accent rounded-xl shrink-0 mt-0.5">
                                            <item.icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-foreground text-sm font-body">{item.title}</div>
                                            {item.lines.map((line, j) => (
                                                <div key={j} className="text-sm text-muted-foreground font-body">{line}</div>
                                            ))}
                                            {item.note && <div className="text-xs text-primary mt-0.5 font-body">{item.note}</div>}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Payment Methods */}
                        <Card className="border-border hover-gold">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2 font-display">
                                    <CreditCard className="h-5 w-5 text-primary" />
                                    Payment Methods
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    {paymentMethods.map((method, index) => {
                                        const IconComponent = method.icon;
                                        const cardContent = (
                                            <div 
                                                key={index}
                                                className="p-3 rounded-lg border border-border hover:border-primary/30 transition-all cursor-pointer hover:bg-accent/50"
                                                onClick={() => {
                                                    if (method.action === 'card') navigate('/checkout');
                                                    if (method.action === 'mobile') window.open('https://wa.me/2347040294858?text=Hello%2C%20I%20want%20to%20make%20a%20mobile%20money%20payment.', '_blank');
                                                    if (method.action === 'cash') setShowCashDialog(true);
                                                }}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <div className="p-1.5 bg-accent rounded-md">
                                                        <IconComponent className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-foreground font-body">{method.name}</div>
                                                        <div className="text-xs text-muted-foreground font-body">{method.description}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                        if (method.action === 'bank') return <BankPaymentModal key={index}>{cardContent}</BankPaymentModal>;
                                        return cardContent;
                                    })}
                                </div>

                                {/* Cash Payment Dialog */}
                                <Dialog open={showCashDialog} onOpenChange={setShowCashDialog}>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-2 font-display">
                                                <Banknote className="h-5 w-5 text-primary" />
                                                Cash Payment
                                            </DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div className="bg-accent p-4 rounded-lg space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-primary" />
                                                    <span className="font-semibold text-sm font-body">Office Location</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground font-body">Visit our office in Abuja, Nigeria for cash payments.</p>
                                            </div>
                                            <div className="bg-accent p-4 rounded-lg space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-primary" />
                                                    <span className="font-semibold text-sm font-body">Working Hours</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground font-body">Monday - Saturday: 8:00 AM - 6:00 PM</p>
                                            </div>
                                            <Button className="w-full gradient-gold text-primary-foreground font-body font-semibold" asChild>
                                                <a href="https://wa.me/2347040294858?text=Hello%2C%20I%20want%20to%20make%20a%20cash%20payment%20at%20your%20office." target="_blank" rel="noopener noreferrer">
                                                    Contact on WhatsApp
                                                </a>
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                {/* Bank Details */}
                                <div className="p-4 rounded-lg bg-accent border border-primary/10">
                                    <div className="text-center mb-3">
                                        <div className="text-sm font-semibold text-foreground font-body">Bank Transfer Details</div>
                                    </div>
                                    <div className="space-y-1.5 text-sm font-body">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Account Name:</span>
                                            <span className="font-medium text-foreground">Confidential Connect Ltd</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Account Number:</span>
                                            <span className="font-medium text-foreground">6919053477</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Bank:</span>
                                            <span className="font-medium text-foreground">Moniepoint MFB</span>
                                        </div>
                                    </div>
                                    <div className="mt-3 text-center">
                                        <p className="text-xs text-muted-foreground font-body">📲 Send receipt to WhatsApp: +234 704 029 4858</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-3">
                            <Button asChild size="lg" className="w-full gradient-gold text-primary-foreground font-body font-semibold">
                                <a href="tel:+2347040294858">
                                    <Phone className="h-4 w-4 mr-2" /> Call Us
                                </a>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="w-full font-body">
                                <a href="https://wa.me/2347040294858" target="_blank" rel="noopener noreferrer">
                                    <Smartphone className="h-4 w-4 mr-2" /> WhatsApp
                                </a>
                            </Button>
                        </div>

                        {/* WhatsApp QR */}
                        <Card className="border-border">
                            <CardContent className="p-4 flex items-center gap-4">
                                <img src={whatsappQrCode} alt="WhatsApp QR Code" className="w-20 h-20 rounded-lg" loading="lazy" />
                                <div>
                                    <p className="text-sm font-medium text-foreground font-body">Scan to chat on WhatsApp</p>
                                    <p className="text-xs text-muted-foreground font-body">Quick access to our support team</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Social Media */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground font-body">Follow us:</span>
                            {[
                                { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61580159132745", label: "Facebook" },
                                { icon: Instagram, href: "https://instagram.com/ConfidentialConnect", label: "Instagram" },
                                { icon: Linkedin, href: "https://www.linkedin.com/in/okpo-confidence-oko-74ba152a5", label: "LinkedIn" },
                            ].map((social, i) => (
                                <Button key={i} variant="outline" size="icon" className="h-9 w-9 hover:border-primary/30" asChild>
                                    <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                                        <social.icon className="h-4 w-4" />
                                    </a>
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <Card className="border-border max-w-4xl mx-auto hover-gold">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl text-foreground font-display">Frequently Asked Questions</CardTitle>
                        <CardDescription className="font-body">Quick answers to common questions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="space-y-2">
                            {[
                                { q: "How quickly can I get my WAEC results?", a: "WAEC result checking is instant. You'll receive the PIN immediately after payment, with 24/7 support if needed." },
                                { q: "Do you assist with university applications?", a: "Yes, we provide complete university registration support including form filling, document submission, and application tracking." },
                                { q: "Is my personal information secure?", a: "Absolutely. We use industry-standard encryption and secure processing. Your data is never shared with third parties." },
                                { q: "What payment methods do you accept?", a: "We accept bank transfers (all Nigerian banks), cards (Visa, Mastercard, Verve), mobile money (Opay, PalmPay, Kuda), and cash at our office." },
                                { q: "Can you help with NIN retrieval?", a: "Yes, we offer fast and secure NIN retrieval services with full identity verification support and privacy protection." },
                            ].map((faq, i) => (
                                <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-lg px-4">
                                    <AccordionTrigger className="hover:no-underline text-left text-sm font-medium font-body">
                                        {faq.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-muted-foreground pb-4 font-body">
                                        {faq.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
};
