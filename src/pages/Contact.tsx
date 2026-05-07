import { useState } from "react";
import { usePageSEO } from "@/hooks/usePageSEO";
import { Header } from "@/components/Header";
import { GoogleInspiredFooter } from "@/components/GoogleInspiredFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
    Phone, 
    Mail, 
    MapPin, 
    Clock, 
    Send,
    MessageSquare,
    Shield,
    Smartphone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
    const { toast } = useToast();
    usePageSEO({
        title: 'Contact Us',
        description: 'Contact CONFIDENTIAL CONNECT LTD for document processing, school registration, and digital services. Reach us via phone, WhatsApp, or email.',
        keywords: 'contact confidential connect ltd, customer support Nigeria, digital services contact',
        canonical: 'https://confidential-connect-ltd.lovable.app/contact',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: ""
    });

    const contactInfo = [
        {
            icon: Phone,
            title: "Phone",
            details: "+234 704 029 4858",
            secondLine: "+234 911 715 0406",
            description: "Mon-Sat, 8AM-6PM"
        },
        {
            icon: Mail,
            title: "Email",
            details: "confidentialconnectltd@gmail.com",
            description: "Response within 24 hours"
        },
        {
            icon: MapPin,
            title: "Office",
            details: "Airport Road, Abuja",
            description: "Near University of Abuja"
        },
        {
            icon: Clock,
            title: "Working Hours",
            details: "Mon-Fri: 8AM-6PM",
            description: "Saturday: 9AM-4PM"
        }
    ];

    const services = [
        "WAEC Result Checking",
        "NECO/NABTEB Verification",
        "University Registration",
        "Post-UTME Registration",
        "Document Processing",
        "Birth Certificate",
        "State of Origin Certificate",
        "NIN Retrieval",
        "School Fees Payment",
        "Hostel Booking",
        "Other"
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            toast({
                title: "Missing information",
                description: "Please fill in all required fields.",
                variant: "destructive"
            });
            return;
        }

        const whatsappMessage = `Hello Confidential Connect Ltd!\n\n*Name:* ${formData.name}\n*Email:* ${formData.email}\n*Phone:* ${formData.phone}\n*Service:* ${formData.service}\n*Message:* ${formData.message}\n\nPlease respond to this inquiry. Thank you!`;
        
        window.open(`https://wa.me/2347040294858?text=${encodeURIComponent(whatsappMessage)}`, '_blank');

        toast({
            title: "Message sent!",
            description: "We'll get back to you within 24 hours.",
        });

        setFormData({ name: "", email: "", phone: "", service: "", message: "" });
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            
            <main className="pt-20 pb-12">
                {/* Hero */}
                <section className="py-14 bg-primary/5">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                            <Shield className="h-3.5 w-3.5 mr-1.5" />
                            24/7 Support Available
                        </Badge>
                        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
                            Get In Touch
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Have a question or need help with a service? Our team at <strong className="text-foreground">CONFIDENTIAL CONNECT LTD</strong> is here for you.
                        </p>
                    </div>
                </section>

                {/* Contact Form & Info */}
                <section className="py-14">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Contact Form */}
                            <Card className="border-border">
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5 text-primary" />
                                        Send us a Message
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="page-name">Full Name *</Label>
                                                <Input
                                                    id="page-name"
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                                    required
                                                    placeholder="Your full name"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="page-email">Email *</Label>
                                                <Input
                                                    id="page-email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                                    required
                                                    placeholder="your.email@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="page-phone">Phone Number</Label>
                                            <Input
                                                id="page-phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                                placeholder="+234 xxx xxx xxxx"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="page-service">Service of Interest</Label>
                                            <Select onValueChange={(value) => handleInputChange("service", value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a service" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {services.map((service) => (
                                                        <SelectItem key={service} value={service}>
                                                            {service}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="page-message">Message *</Label>
                                            <Textarea
                                                id="page-message"
                                                value={formData.message}
                                                onChange={(e) => handleInputChange("message", e.target.value)}
                                                required
                                                placeholder="Tell us about your needs..."
                                                rows={5}
                                            />
                                        </div>

                                        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                                            <Send className="mr-2 h-4 w-4" />
                                            Send Message
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Contact Information */}
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold mb-2 text-foreground">Contact Information</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Reach out through any of the channels below. We're always happy to help.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {contactInfo.map((info, index) => {
                                        const IconComponent = info.icon;
                                        return (
                                            <Card key={index} className="border-border">
                                                <CardContent className="p-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                                                            <IconComponent className="h-4 w-4 text-primary" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-medium text-sm text-foreground mb-0.5">{info.title}</h3>
                                                            <p className="text-sm text-primary">{info.details}</p>
                                                            {info.secondLine && <p className="text-sm text-primary">{info.secondLine}</p>}
                                                            <p className="text-xs text-muted-foreground">{info.description}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>

                                {/* Quick Contact */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Button asChild size="lg" className="w-full">
                                        <a href="tel:+2347040294858">
                                            <Phone className="h-4 w-4 mr-2" />
                                            Call Us
                                        </a>
                                    </Button>
                                    <Button asChild size="lg" variant="outline" className="w-full">
                                        <a href="https://wa.me/2347040294858" target="_blank" rel="noopener noreferrer">
                                            <Smartphone className="h-4 w-4 mr-2" />
                                            WhatsApp
                                        </a>
                                    </Button>
                                </div>

                                {/* FAQ */}
                                <Card className="border-border">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg">Common Questions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {[
                                            { q: "How quickly do you respond?", a: "We aim to respond to all inquiries within 24 hours. WhatsApp messages are typically answered much faster." },
                                            { q: "Do you offer bulk service discounts?", a: "Yes, we offer tiered pricing for bulk orders of scratch cards and verification tokens for institutions." },
                                            { q: "Can I visit your office?", a: "Yes! Our office is on Airport Road, Abuja, near the University of Abuja. We're open Mon-Sat." },
                                        ].map((faq, i) => (
                                            <div key={i}>
                                                <h3 className="text-sm font-medium text-foreground mb-1">{faq.q}</h3>
                                                <p className="text-xs text-muted-foreground">{faq.a}</p>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <GoogleInspiredFooter />
        </div>
    );
};

export default Contact;
