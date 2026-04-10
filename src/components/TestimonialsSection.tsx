import { Card, CardContent } from "./ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        name: "Adebayo Ogunlesi",
        role: "University Student, Abuja",
        content: "Confidential Connect Ltd helped me check my WAEC result and register for Post-UTME within hours. The platform is incredibly fast and the team guided me every step of the way. I'm now in 200 level!",
        rating: 5,
    },
    {
        name: "Fatima Ibrahim",
        role: "Small Business Owner",
        content: "I promoted my fashion brand through their platform and got over 200 inquiries in the first week. The pricing is affordable and the reach to students is massive. Best investment I've made.",
        rating: 5,
    },
    {
        name: "Chukwuemeka Nwosu",
        role: "Fresh Graduate, Lagos",
        content: "Through their job opportunities section, I landed a remote internship that turned into a full-time role. This platform is a game-changer for young Nigerians looking for real opportunities.",
        rating: 5,
    },
];

export const TestimonialsSection = () => {
    return (
        <section className="py-24 bg-secondary/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4 font-body">Testimonials</p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-display">
                        What Our Users Say
                    </h2>
                    <div className="line-gold mx-auto mb-6" />
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {testimonials.map((t, idx) => (
                        <Card key={idx} className="bg-card border-border hover-gold transition-all duration-300 hover:-translate-y-1">
                            <CardContent className="p-7 space-y-5">
                                <Quote className="h-8 w-8 text-primary/25" />

                                <p className="text-foreground/75 leading-relaxed text-sm font-body italic">
                                    "{t.content}"
                                </p>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className={`h-4 w-4 ${i < t.rating ? 'text-primary fill-primary' : 'text-muted-foreground/20'}`} />
                                    ))}
                                </div>

                                <div className="pt-4 border-t border-border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center">
                                            <span className="text-sm font-bold text-white font-body">
                                                {t.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground font-body">{t.name}</p>
                                            <p className="text-xs text-muted-foreground font-body">{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};
