import { usePageSEO } from "@/hooks/usePageSEO";
import { Header } from "@/components/Header";
import { GoogleInspiredFooter } from "@/components/GoogleInspiredFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    Shield, 
    Users, 
    Award, 
    Target, 
    Globe, 
    Heart,
    CheckCircle,
    Star,
    Building2,
    ArrowRight,
    Smartphone
} from "lucide-react";
import cacCertificate from "@/assets/cac-certificate.jpg";
import ceoPhoto from "@/assets/ceo-photo.jpg";
import { Link } from "react-router-dom";

const About = () => {
    const stats = [
        { label: "Clients Served", value: "10,000+", icon: Users },
        { label: "Success Rate", value: "99.5%", icon: Award },
        { label: "Support Available", value: "24/7", icon: Globe },
        { label: "Partner Institutions", value: "50+", icon: Building2 },
    ];

    const values = [
        {
            icon: Shield,
            title: "Trust & Security",
            description: "We protect your personal information and ensure secure handling of all documents and transactions."
        },
        {
            icon: Target,
            title: "Excellence",
            description: "We strive for the highest quality in every service, delivering results that exceed expectations."
        },
        {
            icon: Users,
            title: "Client Focus",
            description: "Our clients are at the center of everything we do. Their success and satisfaction drive our work."
        },
        {
            icon: Heart,
            title: "Integrity",
            description: "We operate with honesty, transparency, and ethical standards in every interaction."
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Header />
            
            <main className="pt-20 pb-12">
                {/* Hero Section */}
                <section className="py-16 bg-primary/5">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <Badge className="bg-primary/10 text-primary border-primary/20 mb-6">
                            CAC Registered — RC 9081270
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                            About Confidential Connect Ltd
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-2">
                            Your trusted partner for professional documentation, school services, and digital processing.
                        </p>
                        <p className="text-base text-muted-foreground">
                            In partnership with <strong className="text-foreground">All Campus Connect TV</strong>
                        </p>
                    </div>
                </section>

                {/* Company Story */}
                <section className="py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Our Story</h2>
                            <div className="space-y-5 text-muted-foreground">
                                <p className="text-lg leading-relaxed">
                                    <strong className="text-foreground">CONFIDENTIAL CONNECT LTD</strong> was established 
                                    to bridge the gap between individuals, students, and institutions who need reliable, 
                                    fast, and secure documentation and digital services. What started as a commitment to 
                                    helping students navigate academic processes has grown into a comprehensive service 
                                    platform trusted by thousands across Nigeria.
                                </p>
                                <p className="text-lg leading-relaxed">
                                    Operating <strong className="text-foreground">in partnership with All Campus Connect TV</strong>, 
                                    we combine local expertise with a wide reach to deliver services including document 
                                    processing, school registrations, result verification, professional CV writing, 
                                    and digital services — all with a focus on speed, accuracy, and client satisfaction.
                                </p>
                                <p className="text-lg leading-relaxed">
                                    Founded by <strong className="text-foreground">Mr. Okpo Confidence Oko</strong>, our 
                                    company is built on the principles of trust, integrity, and service excellence. Every 
                                    client interaction reflects our dedication to making complex documentation processes 
                                    simple and accessible.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Company Registration Section */}
                <section className="py-16 bg-muted/20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-5xl mx-auto">
                            <div className="text-center mb-12">
                                <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                                    <Building2 className="h-3.5 w-3.5 mr-1.5" />
                                    Officially Registered
                                </Badge>
                                <h2 className="text-3xl font-bold mb-4 text-foreground">
                                    CAC Registered Company
                                </h2>
                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                    Legally registered under the Companies and Allied Matters Act 2020 
                                    of the Federal Republic of Nigeria.
                                </p>
                            </div>
                            
                            <div className="grid lg:grid-cols-2 gap-8 items-center">
                                <Card className="overflow-hidden border-border">
                                    <CardContent className="p-4">
                                        <img 
                                            src={cacCertificate} 
                                            alt="CAC Certificate of Incorporation - Confidential Connect Ltd" 
                                            className="w-full h-auto rounded-lg"
                                            loading="lazy"
                                        />
                                    </CardContent>
                                </Card>
                                
                                <div className="space-y-6">
                                    <Card className="border-border">
                                        <CardContent className="p-6">
                                            <h3 className="text-xl font-bold mb-4 text-foreground">Company Details</h3>
                                            <div className="space-y-4">
                                                {[
                                                    { label: "Company Name", value: "CONFIDENTIAL CONNECT LTD" },
                                                    { label: "Registration Number", value: "RC 9081270" },
                                                    { label: "Company Type", value: "Private Company Limited by Shares" },
                                                    { label: "Date of Incorporation", value: "16th December, 2025" },
                                                    { label: "Registered Under", value: "Companies and Allied Matters Act 2020" },
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-start gap-3">
                                                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                                        <div>
                                                            <p className="font-medium text-foreground">{item.label}</p>
                                                            <p className="text-muted-foreground text-sm">{item.value}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {stats.map((stat, index) => {
                                const IconComponent = stat.icon;
                                return (
                                    <div key={index} className="text-center p-6 bg-card border border-border rounded-xl">
                                        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3">
                                            <IconComponent className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="py-16 bg-muted/20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card className="border-border">
                                <CardContent className="p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2.5 bg-primary/10 rounded-lg">
                                            <Target className="h-5 w-5 text-primary" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed">
                                        To empower individuals, students, and institutions with reliable, fast, and 
                                        secure documentation and digital services. We are committed to simplifying 
                                        complex processes so our clients can focus on what matters most — their 
                                        education, careers, and personal goals.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-border">
                                <CardContent className="p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2.5 bg-primary/10 rounded-lg">
                                            <Star className="h-5 w-5 text-primary" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-foreground">Our Vision</h3>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed">
                                        To be Nigeria's most trusted service platform for documentation processing 
                                        and academic support — recognized for our speed, reliability, and unwavering 
                                        commitment to client satisfaction. Together with <strong>All Campus Connect TV</strong>, 
                                        we aim to reach every student and professional who needs our help.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-center mb-10 text-foreground">Our Values</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {values.map((value, index) => {
                                const IconComponent = value.icon;
                                return (
                                    <Card key={index} className="border-border hover:border-primary/20 transition-colors">
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4">
                                                <div className="p-2.5 bg-primary/10 rounded-lg shrink-0">
                                                    <IconComponent className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold mb-2 text-foreground">{value.title}</h3>
                                                    <p className="text-sm text-muted-foreground">{value.description}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* CEO Section */}
                <section className="py-16 bg-muted/20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl font-bold mb-8 text-foreground">Leadership</h2>
                            <Card className="border-border">
                                <CardContent className="p-8">
                                    <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-2 border-primary/20">
                                        <img
                                            src={ceoPhoto}
                                            alt="Mr. Okpo Confidence Oko - CEO"
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground">Mr. Okpo Confidence Oko</h3>
                                    <p className="text-primary font-medium mb-3">Founder & CEO</p>
                                    <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                                        Passionate about making documentation and digital services accessible to 
                                        everyone. Leading Confidential Connect Ltd with a vision to simplify 
                                        processes for students and professionals across Nigeria.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-primary/5">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold mb-4 text-foreground">Ready to Get Started?</h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Join thousands of satisfied clients who trust <strong className="text-foreground">CONFIDENTIAL CONNECT LTD</strong> for 
                            their documentation and service needs.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button size="lg" className="px-8" asChild>
                                <Link to="/categories">
                                    Browse Services
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="px-8" asChild>
                                <Link to="/contact">
                                    Contact Us
                                </Link>
                            </Button>
                            <Button 
                                size="lg" 
                                variant="ghost" 
                                className="px-6"
                                onClick={() => {
                                    const msg = `Hello Confidential Connect Ltd! I'd like to learn more about your services.`;
                                    window.open(`https://wa.me/2347040294858?text=${encodeURIComponent(msg)}`, '_blank');
                                }}
                            >
                                <Smartphone className="h-4 w-4 mr-2" />
                                WhatsApp Us
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <GoogleInspiredFooter />
        </div>
    );
};

export default About;
