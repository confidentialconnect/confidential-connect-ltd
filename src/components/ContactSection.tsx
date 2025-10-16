import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  CreditCard,
  Smartphone,
  Building2,
  Banknote,
  Shield,
  Zap,
  Star
} from "lucide-react";

export const ContactSection = () => {
  const paymentMethods = [
    { name: "Bank Transfer", icon: Building2, description: "All Nigerian banks supported", color: "from-brand-blue to-brand-purple" },
    { name: "Card Payment", icon: CreditCard, description: "Visa, Mastercard, Verve", color: "from-brand-green to-brand-blue" },
    { name: "Mobile Money", icon: Smartphone, description: "Opay, PalmPay, Kuda", color: "from-brand-orange to-brand-red" },
    { name: "Cash Payment", icon: Banknote, description: "Office location only", color: "from-brand-purple to-brand-pink" }
  ];

  return (
    <section id="contact" className="py-24 bg-gradient-mesh relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-brand-blue/10 animate-float blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-brand-purple/10 animate-float delay-1000 blur-xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-brand-pink/5 animate-pulse-glow blur-2xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Premium Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-6">
            <Star className="h-6 w-6 text-brand-orange animate-pulse-glow" />
            <Badge className="bg-gradient-to-r from-brand-blue to-brand-purple text-white border-0 px-4 py-2">
              24/7 Premium Support
            </Badge>
            <Star className="h-6 w-6 text-brand-orange animate-pulse-glow" />
          </div>
          <h2 className="text-6xl font-black mb-6 text-gradient leading-tight">Get in Touch</h2>
          <div className="w-32 h-1 bg-gradient-to-r from-brand-blue to-brand-purple rounded-full mx-auto mb-6"></div>
          <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Experience world-class support with lightning-fast responses and premium service quality
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          {/* Premium Contact Form */}
          <Card className="border-gradient glass hover-lift shadow-premium">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-brand-purple/5 rounded-lg"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-gradient-to-br from-brand-blue to-brand-purple">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-gradient">Send us a Message</CardTitle>
                  <CardDescription className="text-lg">
                    Premium support with guaranteed 24-hour response
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-semibold">First Name</Label>
                  <Input id="firstName" placeholder="Enter your first name" className="border-gradient" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-semibold">Last Name</Label>
                  <Input id="lastName" placeholder="Enter your last name" className="border-gradient" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                <Input id="email" type="email" placeholder="Enter your email address" className="border-gradient" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+234 800 000 0000" className="border-gradient" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="service" className="text-sm font-semibold">Service Interested In</Label>
                <Input id="service" placeholder="e.g., WAEC Result Checker, University Registration" className="border-gradient" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-semibold">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us how we can help you..."
                  className="min-h-[120px] border-gradient"
                />
              </div>
              
              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  const firstName = (document.getElementById('firstName') as HTMLInputElement)?.value || '';
                  const lastName = (document.getElementById('lastName') as HTMLInputElement)?.value || '';
                  const email = (document.getElementById('email') as HTMLInputElement)?.value || '';
                  const phone = (document.getElementById('phone') as HTMLInputElement)?.value || '';
                  const service = (document.getElementById('service') as HTMLInputElement)?.value || '';
                  const message = (document.getElementById('message') as HTMLTextAreaElement)?.value || '';
                  
                  const whatsappMessage = `Hello Confidential Connect! 
*New Message from Contact Form*

*Name:* ${firstName} ${lastName}
*Email:* ${email}
*Phone:* ${phone}
*Service Interest:* ${service}
*Message:* ${message}

Please respond to this inquiry. Thank you!`;
                  
                  const whatsappUrl = `https://wa.me/2347040294858?text=${encodeURIComponent(whatsappMessage)}`;
                  window.open(whatsappUrl, '_blank');
                }}
                className="w-full bg-gradient-to-r from-brand-blue to-brand-purple text-white border-0 hover-lift shadow-premium text-lg py-6"
              >
                <Send className="h-5 w-5 mr-3" />
                Send Premium Message
                <Zap className="h-5 w-5 ml-3" />
              </Button>
            </CardContent>
          </Card>

          {/* Premium Contact Information */}
          <div className="space-y-8 animate-slide-up" style={{animationDelay: "0.2s"}}>
            {/* Contact Details */}
            <Card className="border-gradient glass hover-lift shadow-premium">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-green/5 to-brand-blue/5 rounded-lg"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-2xl text-gradient flex items-center gap-3">
                  <Shield className="h-6 w-6" />
                  Premium Contact Information
                </CardTitle>
                <CardDescription className="text-lg">
                  Multiple channels for instant premium support
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 relative z-10">
                <div className="flex items-center group">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-purple mr-6 group-hover:scale-110 transition-transform shadow-premium">
                    <Phone className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-gradient">Premium Phone Support</div>
                    <div className="text-muted-foreground font-medium">+234 704 029 4858</div>
                    <div className="text-muted-foreground font-medium">+234 901 171 50406</div>
                    <div className="text-xs text-brand-blue">24/7 Emergency Support Available</div>
                  </div>
                </div>
                
                <div className="flex items-center group">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-brand-green to-brand-blue mr-6 group-hover:scale-110 transition-transform shadow-premium">
                    <Mail className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-gradient">Priority Email</div>
                    <div className="text-muted-foreground font-medium">faceofconfidentialconnect@gmail.com</div>
                    <div className="text-xs text-brand-green">Response within 2 hours</div>
                  </div>
                </div>
                
                <div className="flex items-center group">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-brand-orange to-brand-red mr-6 group-hover:scale-110 transition-transform shadow-premium">
                    <MapPin className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-gradient">Premium Office Location</div>
                    <div className="text-muted-foreground font-medium">
                      Assembly of God Church Iddo Sarki<br />
                      Airport Road, close to University of Abuja P/Site<br />
                      Abuja, Nigeria
                    </div>
                    <div className="text-xs text-brand-orange">VIP appointments available</div>
                  </div>
                </div>
                
                <div className="flex items-center group">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-pink mr-6 group-hover:scale-110 transition-transform shadow-premium">
                    <Clock className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-gradient">Premium Hours</div>
                    <div className="text-muted-foreground font-medium">
                      Monday - Friday: 8:00 AM - 6:00 PM<br />
                      Saturday: 9:00 AM - 4:00 PM<br />
                      Sunday: Emergency support only
                    </div>
                    <div className="text-xs text-brand-purple">Extended hours for VIP clients</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Premium Payment Methods */}
            <Card className="border-gradient glass hover-lift shadow-premium overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 to-brand-red/5 rounded-lg"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-2xl text-gradient flex items-center gap-3">
                  <CreditCard className="h-6 w-6" />
                  Premium Payment Methods
                </CardTitle>
                <CardDescription className="text-lg">
                  We accept all major payment methods including bank transfers (all Nigerian banks), international cards (Visa, Mastercard, Verve), mobile money (Opay, PalmPay, Kuda), cryptocurrency, and cash payments at our premium office location.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {paymentMethods.map((method, index) => {
                    const IconComponent = method.icon;
                    return (
                      <div 
                        key={index}
                        className="p-4 rounded-2xl glass border-gradient hover-lift group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl bg-gradient-to-br ${method.color} group-hover:scale-110 transition-transform`}>
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{method.name}</div>
                            <div className="text-xs text-muted-foreground">{method.description}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-green to-brand-blue text-white">
                  <div className="text-center mb-4">
                    <Shield className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-bold">Bank Account Details</div>
                    <div className="text-xs opacity-90">For direct bank transfers</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="opacity-90">Account Name:</span>
                      <span className="font-semibold">Confidential Connect</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-90">Account Number:</span>
                      <span className="font-semibold">1234567890</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-90">Bank:</span>
                      <span className="font-semibold">First Bank Nigeria</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white/10 rounded-xl text-center">
                    <div className="text-xs font-semibold">📲 Send payment receipt to WhatsApp</div>
                    <div className="text-xs opacity-90 mt-1">+234 704 029 4858</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Premium Quick Actions */}
            <Card className="border-gradient glass hover-lift shadow-premium overflow-hidden">
              <div className="absolute inset-0 gradient-hero rounded-lg"></div>
              <CardContent className="p-8 text-white relative z-10">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-black mb-2">Instant Premium Support</h3>
                  <p className="opacity-90">Get immediate assistance from our expert team</p>
                </div>
                <div className="space-y-4">
                  <Button asChild className="w-full bg-white text-brand-blue hover:bg-white/90 hover-lift shadow-premium font-bold py-4 text-lg">
                    <a href="tel:+2347040294858" aria-label="Call us now">
                      <Phone className="h-5 w-5 mr-3" />
                      Call Premium Support
                      <Zap className="h-5 w-5 ml-3" />
                    </a>
                  </Button>
                  <Button 
                    asChild
                    variant="outline" 
                    className="w-full border-white text-white hover:bg-white hover:text-brand-blue hover-lift font-bold py-4 text-lg"
                  >
                    <a href="https://wa.me/2347040294858?text=Hello%20Confidential%20Connect%2C%20I%20need%20premium%20support%20with..." target="_blank" rel="noopener noreferrer" aria-label="Live chat support on WhatsApp">
                      <Globe className="h-5 w-5 mr-3" />
                      Premium WhatsApp Chat
                      <Star className="h-5 w-5 ml-3" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Premium WhatsApp QR */}
            <Card className="border-gradient glass hover-lift shadow-premium">
              <CardHeader>
                <CardTitle className="text-gradient flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Premium WhatsApp Access
                </CardTitle>
                <CardDescription>
                  Scan for instant VIP support access
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="relative inline-block">
                  <img 
                    src="/lovable-uploads/844d6332-7434-4200-93de-bb9fa92f86e9.png" 
                    alt="WhatsApp QR Code for Premium CONFIDENTIAL CONNECT Support" 
                    className="w-full max-w-[240px] mx-auto rounded-2xl shadow-premium border-gradient"
                  />
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-gradient-to-r from-brand-orange to-brand-red text-white border-0 animate-pulse-glow">
                      VIP Access
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Premium Social Media */}
            <Card className="border-gradient glass hover-lift shadow-premium">
              <CardHeader>
                <CardTitle className="text-gradient flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Follow Our Premium Updates
                </CardTitle>
                <CardDescription>
                  Exclusive content and VIP announcements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="hover-lift hover-glow border-gradient h-12 w-12"
                    asChild
                  >
                    <a 
                      href="https://www.facebook.com/profile.php?id=61580159132745" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="Follow us on Facebook"
                    >
                      <Facebook className="h-6 w-6" />
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="hover-lift hover-glow border-gradient h-12 w-12"
                    asChild
                  >
                    <a 
                      href="https://twitter.com/ConfidentialConnect" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="Follow us on Twitter"
                    >
                      <Twitter className="h-6 w-6" />
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="hover-lift hover-glow border-gradient h-12 w-12"
                    asChild
                  >
                    <a 
                      href="https://instagram.com/ConfidentialConnect" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="Follow us on Instagram"
                    >
                      <Instagram className="h-6 w-6" />
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="hover-lift hover-glow border-gradient h-12 w-12"
                    asChild
                  >
                    <a 
                      href="https://www.linkedin.com/in/okpo-confidence-oko-74ba152a5?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="Follow us on LinkedIn"
                    >
                      <Linkedin className="h-6 w-6" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Premium FAQ Section with Accordion */}
        <Card className="border-gradient glass shadow-premium animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-brand-purple/5 rounded-lg"></div>
          <CardHeader className="text-center relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="h-6 w-6 text-brand-orange animate-pulse-glow" />
              <Badge className="bg-gradient-to-r from-brand-blue to-brand-purple text-white border-0">
                Premium FAQ
              </Badge>
              <Star className="h-6 w-6 text-brand-orange animate-pulse-glow" />
            </div>
            <CardTitle className="text-4xl font-bold text-gradient">Frequently Asked Questions</CardTitle>
            <CardDescription className="text-lg">
              Quick answers to common questions about our premium services
            </CardDescription>
            <div className="w-24 h-1 bg-gradient-to-r from-brand-blue to-brand-purple rounded-full mx-auto mt-4"></div>
          </CardHeader>
          <CardContent className="relative z-10">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border-gradient rounded-2xl px-6">
                <AccordionTrigger className="hover:no-underline text-left text-lg font-semibold text-gradient hover:text-shimmer">
                  How quickly can I get my WAEC results?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-4">
                  WAEC result checking is instant with our premium service. You'll receive the PIN immediately after payment, with 24/7 technical support to assist if needed. Our premium clients also get priority access during peak periods.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-gradient rounded-2xl px-6">
                <AccordionTrigger className="hover:no-underline text-left text-lg font-semibold text-gradient hover:text-shimmer">
                  Do you assist with university applications?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-4">
                  Yes, we provide comprehensive premium university registration support including personal consultation, form filling assistance, document submission, application tracking, and guaranteed admission guidance. Our success rate is 99.8%.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-gradient rounded-2xl px-6">
                <AccordionTrigger className="hover:no-underline text-left text-lg font-semibold text-gradient hover:text-shimmer">
                  Is my personal information secure?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-4">
                  Absolutely. We use military-grade encryption, bank-level security measures, and are PCI DSS compliant. Your data is protected with multi-layer security protocols and we never share personal information with third parties.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-gradient rounded-2xl px-6">
                <AccordionTrigger className="hover:no-underline text-left text-lg font-semibold text-gradient hover:text-shimmer">
                  What premium payment methods do you accept?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-4">
                  We accept all major payment methods including bank transfers (all Nigerian banks), international cards (Visa, Mastercard, Verve), mobile money (Opay, PalmPay, Kuda), cryptocurrency, and cash payments at our premium office location.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-gradient rounded-2xl px-6">
                <AccordionTrigger className="hover:no-underline text-left text-lg font-semibold text-gradient hover:text-shimmer">
                  Can you help with hostel booking and accommodation?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-4">
                  Yes, we offer premium hostel booking services for universities and polytechnics with room selection, virtual tours, booking confirmation, and move-in assistance. We also provide luxury private accommodation options.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border-gradient rounded-2xl px-6">
                <AccordionTrigger className="hover:no-underline text-left text-lg font-semibold text-gradient hover:text-shimmer">
                  Do you deliver food products nationwide?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-4">
                  Yes, we deliver premium fresh chinchin and soya milk nationwide with same-day delivery in Lagos, next-day delivery in major cities, and 2-3 day delivery to other locations. All products are freshly made and packaged with care.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};