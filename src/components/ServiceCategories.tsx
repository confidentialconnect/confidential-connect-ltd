import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import {
    GraduationCap, BookOpen, Radio,
    Briefcase, Globe, Laptop, Award, Users,
    FileText, Shield, Fingerprint, Scale, CreditCard, Building2,
    Megaphone, TrendingUp, Store, ArrowRight
} from "lucide-react";

const categories = [
    {
        title: "Student Support",
        icon: GraduationCap,
        color: "bg-blue-500/10 text-blue-600",
        items: [
            { icon: BookOpen, label: "JAMB Updates" },
            { icon: GraduationCap, label: "Admission Guidance" },
            { icon: Radio, label: "Campus Updates" },
        ],
    },
    {
        title: "Job Opportunities",
        icon: Briefcase,
        color: "bg-emerald-500/10 text-emerald-600",
        items: [
            { icon: Globe, label: "Remote Jobs" },
            { icon: Laptop, label: "Internships & Freelance" },
            { icon: Award, label: "Graduate Roles" },
        ],
    },
    {
        title: "Document Services",
        icon: FileText,
        color: "bg-amber-500/10 text-amber-600",
        items: [
            { icon: FileText, label: "Birth & State of Origin Cert." },
            { icon: Fingerprint, label: "NIN Modification" },
            { icon: Shield, label: "WAEC / NECO / NABTEB Pins" },
            { icon: Scale, label: "Court Affidavit & CAC Reg." },
        ],
    },
    {
        title: "Business Promotion",
        icon: Megaphone,
        color: "bg-purple-500/10 text-purple-600",
        items: [
            { icon: Store, label: "Promote Products & Services" },
            { icon: TrendingUp, label: "Brand Visibility" },
            { icon: Users, label: "Reach Student Network" },
        ],
    },
];

export const ServiceCategories = () => {
    return (
        <section id="services" className="py-24 bg-secondary/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4 font-body">Our Services</p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-display">
                        Everything You Need, One Platform
                    </h2>
                    <div className="line-gold mx-auto mb-6" />
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-body leading-relaxed">
                        From student support to business promotion, we offer a comprehensive suite of services 
                        designed to empower your journey.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {categories.map((cat, idx) => {
                        const CatIcon = cat.icon;
                        return (
                            <Card key={idx} className="bg-card border-border hover-gold transition-all duration-300 group overflow-hidden">
                                <CardContent className="p-7">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${cat.color}`}>
                                            <CatIcon className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground font-display">{cat.title}</h3>
                                    </div>

                                    <div className="space-y-3">
                                        {cat.items.map((item, i) => {
                                            const ItemIcon = item.icon;
                                            return (
                                                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/60 hover:bg-secondary transition-colors">
                                                    <ItemIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                                                    <span className="text-sm font-medium text-foreground/80 font-body">{item.label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="text-center">
                    <Button size="lg" className="gradient-brand text-white shadow-brand font-body font-semibold" asChild>
                        <Link to="/categories">
                            View All Services
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};
