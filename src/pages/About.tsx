import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Users, 
  Award, 
  Target, 
  Globe, 
  Code,
  CheckCircle,
  Star,
  Building2
} from "lucide-react";
import cacCertificate from "@/assets/cac-certificate.jpg";
import ceoPhoto from "@/assets/ceo-photo.jpg";

const About = () => {
  const stats = [
    { label: "Years of Experience", value: "10+", icon: Award },
    { label: "Projects Completed", value: "500+", icon: CheckCircle },
    { label: "Happy Clients", value: "200+", icon: Users },
    { label: "Countries Served", value: "15+", icon: Globe },
  ];

  const values = [
    {
      icon: Shield,
      title: "Security First",
      description: "We prioritize the security and confidentiality of your business data in everything we do."
    },
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for excellence in every project, delivering solutions that exceed expectations."
    },
    {
      icon: Users,
      title: "Client Focus",
      description: "Our clients are at the center of everything we do. Their success is our success."
    },
    {
      icon: Code,
      title: "Innovation",
      description: "We stay ahead of technology trends to provide cutting-edge solutions for our clients."
    }
  ];

  const team = [
    {
      name: "Dr. Emmanuel Okoro",
      role: "Founder & CEO",
      specialization: "Cybersecurity & Software Architecture",
      experience: "15+ years",
      image: ceoPhoto
    },
    {
      name: "Sarah Johnson",
      role: "CTO",
      specialization: "Cloud Solutions & DevOps",
      experience: "12+ years",
      image: "/placeholder.svg"
    },
    {
      name: "Michael Chen",
      role: "Lead Developer",
      specialization: "Full-Stack Development",
      experience: "8+ years",
      image: "/placeholder.svg"
    },
    {
      name: "Aisha Muhammad",
      role: "Security Analyst",
      specialization: "Penetration Testing & Audits",
      experience: "6+ years",
      image: "/placeholder.svg"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20 pb-12">
        {/* Hero Section */}
        <section className="py-16 gradient-hero text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Confidential Connect Ltd
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Your trusted partner in technology solutions, cybersecurity, and digital transformation
            </p>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8 text-gradient">Our Story</h2>
              <div className="prose prose-lg mx-auto text-muted-foreground">
                <p className="text-lg leading-relaxed mb-6">
                  Founded in 2014, Confidential Connect Ltd emerged from a vision to bridge the gap between 
                  businesses and cutting-edge technology solutions. What started as a small cybersecurity 
                  consultancy has evolved into a comprehensive technology service provider, serving clients 
                  across Nigeria and beyond.
                </p>
                <p className="text-lg leading-relaxed mb-6">
                  Our journey began when our founder, Dr. Emmanuel Okoro, recognized the growing need for 
                  reliable, secure, and innovative technology solutions in the Nigerian market. With a 
                  background in cybersecurity and software engineering, he assembled a team of passionate 
                  experts dedicated to protecting and empowering businesses through technology.
                </p>
                <p className="text-lg leading-relaxed">
                  Today, we continue to uphold our founding principles: excellence, integrity, and 
                  innovation. Every project we undertake is a testament to our commitment to delivering 
                  solutions that not only meet but exceed our clients' expectations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Company Registration Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 mb-4">
                  <Building2 className="h-6 w-6 text-primary" />
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    Officially Registered
                  </Badge>
                </div>
                <h2 className="text-3xl font-bold mb-4 text-gradient">
                  CAC Registered Company
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Confidential Connect Ltd is a legally registered private company under the 
                  Companies and Allied Matters Act 2020 of the Federal Republic of Nigeria.
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Certificate Image */}
                <Card className="hover-lift overflow-hidden border-2 border-primary/20">
                  <CardContent className="p-4">
                    <img 
                      src={cacCertificate} 
                      alt="CAC Certificate of Incorporation - Confidential Connect Ltd" 
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                  </CardContent>
                </Card>
                
                {/* Company Details */}
                <div className="space-y-6">
                  <Card className="hover-lift">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4 text-gradient">Company Details</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-success mt-0.5 shrink-0" />
                          <div>
                            <p className="font-medium">Company Name</p>
                            <p className="text-muted-foreground">CONFIDENTIAL CONNECT LTD</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-success mt-0.5 shrink-0" />
                          <div>
                            <p className="font-medium">Registration Number</p>
                            <p className="text-muted-foreground">RC 9081270</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-success mt-0.5 shrink-0" />
                          <div>
                            <p className="font-medium">Company Type</p>
                            <p className="text-muted-foreground">Private Company Limited by Shares</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-success mt-0.5 shrink-0" />
                          <div>
                            <p className="font-medium">Date of Incorporation</p>
                            <p className="text-muted-foreground">16th December, 2025</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-success mt-0.5 shrink-0" />
                          <div>
                            <p className="font-medium">Registered Under</p>
                            <p className="text-muted-foreground">Companies and Allied Matters Act 2020</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center gap-2 text-success">
                      <Shield className="h-5 w-5" />
                      <span className="font-semibold">Verified & Trusted</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Our company is duly registered with the Corporate Affairs Commission (CAC) 
                      of Nigeria, ensuring legal compliance and trustworthiness.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gradient">Our Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Card className="hover-lift">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">Our Mission</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    To empower businesses with secure, innovative, and reliable technology solutions 
                    that drive growth, efficiency, and competitive advantage. We are committed to 
                    maintaining the highest standards of service delivery while fostering long-term 
                    partnerships with our clients.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-education-blue/10 rounded-lg">
                      <Star className="h-6 w-6 text-education-blue" />
                    </div>
                    <h3 className="text-2xl font-bold">Our Vision</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    To be the leading technology solutions provider in West Africa, recognized for 
                    our expertise in cybersecurity, software development, and digital transformation. 
                    We envision a future where businesses can leverage technology fearlessly and 
                    confidently.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gradient">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <Card key={index} className="hover-lift">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg shrink-0">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                          <p className="text-muted-foreground">{value.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gradient">Our Leadership Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="hover-lift">
                  <CardContent className="p-6 text-center">
                    <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-2">{member.role}</p>
                    <p className="text-sm text-muted-foreground mb-3">{member.specialization}</p>
                    <Badge variant="secondary">{member.experience}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 gradient-hero text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join hundreds of satisfied clients who trust Confidential Connect Ltd for their technology needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => {
                  const whatsappMessage = `Hello Confidential Connect Ltd! I'm ready to transform my business with your technology solutions. Can you help me get started?`;
                  const whatsappUrl = `https://wa.me/2347040294858?text=${encodeURIComponent(whatsappMessage)}`;
                  window.open(whatsappUrl, '_blank');
                }}
              >
                Get Started Today
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary"
                onClick={() => {
                  const whatsappMessage = `Hello Confidential Connect Ltd! I would like to learn more about your services. Can we schedule a consultation?`;
                  const whatsappUrl = `https://wa.me/2347040294858?text=${encodeURIComponent(whatsappMessage)}`;
                  window.open(whatsappUrl, '_blank');
                }}
              >
                Learn More
              </Button>
              <a 
                href="/categories" 
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-medium rounded-md hover:bg-white/90 transition-colors"
              >
                Explore Our Services
              </a>
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 border border-white/20 text-white font-medium rounded-md hover:bg-white/10 transition-colors"
              >
                Contact Us Today
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;