import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Linkedin
} from "lucide-react";

export const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4 text-gradient">Get in Touch</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about our services? Need assistance with your educational journey? 
            We're here to help you every step of the way.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <Card className="animate-slide-up hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-6 w-6 mr-3 text-primary" />
                Send us a Message
              </CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Enter your first name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Enter your last name" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="Enter your email address" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+234 800 000 0000" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="service">Service Interested In</Label>
                <Input id="service" placeholder="e.g., WAEC Result Checker, University Registration" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us how we can help you..."
                  className="min-h-[120px]"
                />
              </div>
              
              <Button className="w-full hover-lift">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8 animate-slide-up" style={{animationDelay: "0.2s"}}>
            {/* Contact Details */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Reach out to us through any of these channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center">
                  <Phone className="h-6 w-6 text-primary mr-4" />
                  <div>
                    <div className="font-semibold">Phone</div>
                    <div className="text-muted-foreground">+234 704 029 4858</div>
                    <div className="text-muted-foreground">+234 901 171 50406</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-6 w-6 text-primary mr-4" />
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-muted-foreground">princejuniorokpo@gmail.com</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-6 w-6 text-primary mr-4" />
                  <div>
                    <div className="font-semibold">Address</div>
                    <div className="text-muted-foreground">
                      Assembly of God Church Iddo Sarki<br />
                      Airport Road, close to University of Abuja P/Site<br />
                      Nigeria
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-6 w-6 text-primary mr-4" />
                  <div>
                    <div className="font-semibold">Business Hours</div>
                    <div className="text-muted-foreground">
                      Monday - Friday: 8:00 AM - 6:00 PM<br />
                      Saturday: 9:00 AM - 4:00 PM<br />
                      Sunday: Emergency support only
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="hover-lift gradient-hero">
              <CardContent className="p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full bg-white text-nigeria-green hover:bg-white/90 hover-lift">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Us Now
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-white text-white hover:bg-white hover:text-nigeria-green hover-lift"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Live Chat Support
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
                <CardDescription>
                  Stay connected for updates and educational tips
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Button variant="outline" size="icon" className="hover-lift">
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="hover-lift">
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="hover-lift">
                    <Instagram className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="hover-lift">
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
            <CardDescription>
              Quick answers to common questions about our services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">How quickly can I get my WAEC results?</h4>
                  <p className="text-muted-foreground text-sm">
                    WAEC result checking is instant once you purchase our scratch card. You'll receive the PIN immediately after payment.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Do you assist with university applications?</h4>
                  <p className="text-muted-foreground text-sm">
                    Yes, we provide comprehensive university registration support including form filling, document submission, and application tracking.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Is my personal information secure?</h4>
                  <p className="text-muted-foreground text-sm">
                    Absolutely. We use industry-standard encryption and security measures to protect all personal information and transactions.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
                  <p className="text-muted-foreground text-sm">
                    We accept bank transfers, card payments, mobile money, and other popular Nigerian payment methods.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Can you help with hostel booking?</h4>
                  <p className="text-muted-foreground text-sm">
                    Yes, we offer hostel booking services for universities and polytechnics with room selection and booking confirmation.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Do you deliver food products?</h4>
                  <p className="text-muted-foreground text-sm">
                    Yes, we deliver fresh chinchin and soya milk within Lagos and surrounding areas. Contact us for delivery details.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};