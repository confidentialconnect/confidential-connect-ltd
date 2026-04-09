import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
    Phone, Mail, MapPin, Clock, Send, MessageSquare, Smartphone
} from "lucide-react";

export const ContactSectionNew = () => {
    return (
        <section id="contact" className="py-24 bg-secondary/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4 font-body">Contact Us</p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-display">Get in Touch</h2>
                    <div className="line-gold mx-auto mb-6" />
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body leading-relaxed">
                        Have a question or need help? Our team is ready to assist you.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    {/* Contact Form */}
                    <Card className="border-border hover-gold">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-accent rounded-xl">
                                    <MessageSquare className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-display">Send us a Message</CardTitle>
                                    <CardDescription className="font-body">We'll respond within 24 hours</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="c-fname" className="font-body text-sm">First Name</Label>
                                    <Input id="c-fname" placeholder="Your first name" className="font-body" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="c-lname" className="font-body text-sm">Last Name</Label>
                                    <Input id="c-lname" placeholder="Your last name" className="font-body" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="c-email" className="font-body text-sm">Email</Label>
                                <Input id="c-email" type="email" placeholder="you@example.com" className="font-body" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="c-phone" className="font-body text-sm">Phone</Label>
                                <Input id="c-phone" type="tel" placeholder="+234 800 000 0000" className="font-body" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="c-msg" className="font-body text-sm">Message</Label>
                                <Textarea id="c-msg" placeholder="How can we help you?" className="min-h-[100px] font-body" />
                            </div>
                            <Button
                                className="w-full gradient-brand text-white shadow-brand font-body font-semibold"
                                size="lg"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const fn = (document.getElementById('c-fname') as HTMLInputElement)?.value || '';
                                    const ln = (document.getElementById('c-lname') as HTMLInputElement)?.value || '';
                                    const em = (document.getElementById('c-email') as HTMLInputElement)?.value || '';
                                    const ph = (document.getElementById('c-phone') as HTMLInputElement)?.value || '';
                                    const msg = (document.getElementById('c-msg') as HTMLTextAreaElement)?.value || '';
                                    const text = `Hello Confidential Connect Ltd!\n\n*Name:* ${fn} ${ln}\n*Email:* ${em}\n*Phone:* ${ph}\n*Message:* ${msg}`;
                                    window.open(`https://wa.me/2347040294858?text=${encodeURIComponent(text)}`, '_blank');
                                }}
                            >
                                <Send className="h-4 w-4 mr-2" />
                                Send Message
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <Card className="border-border hover-gold">
                            <CardContent className="p-7 space-y-6">
                                <h3 className="text-lg font-bold text-foreground font-display">Contact Information</h3>
                                {[
                                    { icon: Phone, title: "Phone", lines: ["07040294858", "09065253996"] },
                                    { icon: Mail, title: "Email", lines: ["confidentialconnectltd@gmail.com"] },
                                    { icon: MapPin, title: "Location", lines: ["Abuja, Nigeria"] },
                                    { icon: Clock, title: "Hours", lines: ["Mon-Fri: 8AM - 6PM", "Sat: 9AM - 4PM"] },
                                ].map((item, i) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={i} className="flex items-start gap-4">
                                            <div className="p-2.5 bg-accent rounded-xl shrink-0">
                                                <Icon className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-foreground text-sm font-body">{item.title}</div>
                                                {item.lines.map((line, j) => (
                                                    <div key={j} className="text-sm text-muted-foreground font-body">{line}</div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-3">
                            <Button asChild size="lg" className="w-full gradient-brand text-white font-body font-semibold">
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
                    </div>
                </div>
            </div>
        </section>
    );
};
