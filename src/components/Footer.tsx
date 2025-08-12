import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  GraduationCap,
  Shield,
  Clock,
  Send
} from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated with Educational News</h3>
            <p className="text-primary-foreground/80 mb-8">
              Subscribe to our newsletter for the latest updates on exam dates, registration deadlines, and educational opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                placeholder="Enter your email address" 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
              />
              <Button variant="secondary" className="hover-lift">
                <Send className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/lovable-uploads/3657742a-fb6a-4c1a-a6c1-7bf4cf61cd8e.png" 
                alt="Confidential Connect Logo" 
                className="h-10 w-auto"
              />
              <div className="text-xl font-bold">
                Confidential Connect
              </div>
            </div>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              Your trusted partner in educational success. We provide comprehensive services to support your academic journey from examination to graduation.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:bg-white/10 hover-lift">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-white/10 hover-lift">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-white/10 hover-lift">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-white/10 hover-lift">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-primary-foreground/80 hover:text-white transition-colors duration-200">
                  Home
                </a>
              </li>
              <li>
                <a href="#products" className="text-primary-foreground/80 hover:text-white transition-colors duration-200">
                  Products
                </a>
              </li>
              <li>
                <a href="#services" className="text-primary-foreground/80 hover:text-white transition-colors duration-200">
                  Services
                </a>
              </li>
              <li>
                <a href="#contact" className="text-primary-foreground/80 hover:text-white transition-colors duration-200">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-white transition-colors duration-200">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Our Services</h4>
            <ul className="space-y-3">
              <li className="flex items-center">
                <GraduationCap className="h-4 w-4 mr-2 text-primary-foreground/60" />
                <span className="text-primary-foreground/80">Exam Result Checking</span>
              </li>
              <li className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-primary-foreground/60" />
                <span className="text-primary-foreground/80">University Registration</span>
              </li>
              <li className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-primary-foreground/60" />
                <span className="text-primary-foreground/80">NIN Retrieval</span>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-white transition-colors duration-200">
                  School Fees Payment
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-white transition-colors duration-200">
                  Hostel Booking
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-white transition-colors duration-200">
                  Document Verification
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-3 text-primary-foreground/60 mt-1" />
                <div>
                  <div className="text-primary-foreground/80">07040294858</div>
                  <div className="text-primary-foreground/60 text-sm">Primary (WhatsApp)</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-3 text-primary-foreground/60 mt-1" />
                <div>
                  <div className="text-primary-foreground/80">princejuniorokpo@gmail.com</div>
                  <div className="text-primary-foreground/60 text-sm">General Inquiries</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-primary-foreground/60 mt-1" />
                <div>
                  <div className="text-primary-foreground/80">Assembly of God Church Iddo Sarki</div>
                  <div className="text-primary-foreground/80">Airport Road, close to University of Abuja P/Site</div>
                  <div className="text-primary-foreground/60 text-sm">Nigeria</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-primary-foreground/60 text-sm mb-4 md:mb-0">
              © {currentYear} Confidential Connect. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#" className="text-primary-foreground/60 hover:text-white transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-white transition-colors duration-200">
                Cookie Policy
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-white transition-colors duration-200">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};