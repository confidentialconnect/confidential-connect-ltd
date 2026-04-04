import { Card, CardContent } from "./ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        name: "Adebayo Ogunlesi",
        role: "University Student",
        content: "Confidential Connect made my WAEC result checking and university registration seamless. Their team guided me through every step. Highly recommended!",
        rating: 5,
    },
    {
        name: "Fatima Ibrahim",
        role: "Parent",
        content: "I needed a birth certificate processed urgently for my child's school enrollment. They delivered within the promised timeframe. Very professional service.",
        rating: 5,
    },
    {
        name: "Chukwuemeka Nwosu",
        role: "School Administrator",
        content: "We purchase bulk scratch cards from Confidential Connect for our students. The pricing is competitive and delivery is always prompt. Great business partner.",
        rating: 5,
    },
    {
        name: "Amina Yusuf",
        role: "Graduate",
        content: "They helped me with my State of Origin certificate and WAEC certificate collection. The process was smooth and their customer support via WhatsApp is excellent.",
        rating: 4,
    },
    {
        name: "Oluwaseun Adeyemi",
        role: "Polytechnic Student",
        content: "Post-UTME registration was stressful until I found Confidential Connect. They handled everything professionally and I got admitted successfully!",
        rating: 5,
    },
    {
        name: "Grace Eze",
        role: "Business Owner",
        content: "I've been using their digital services for my business documentation needs. Their attention to detail and fast turnaround time sets them apart from others.",
        rating: 5,
    },
];

export const Testimonials = () => {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4 font-body">Testimonials</p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-display">
                        Trusted by Thousands
                    </h2>
                    <div className="line-gold mx-auto mb-6" />
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body leading-relaxed">
                        Hear from students, parents, and institutions who rely on our services for their documentation and academic needs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <Card 
                            key={index} 
                            className="bg-card border-border hover-gold transition-all duration-300 hover:-translate-y-1"
                        >
                            <CardContent className="p-7 space-y-5">
                                <Quote className="h-8 w-8 text-primary/30" />
                                
                                <p className="text-foreground/80 leading-relaxed text-sm font-body italic">
                                    "{testimonial.content}"
                                </p>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star 
                                            key={i} 
                                            className={`h-4 w-4 ${i < testimonial.rating ? 'text-primary fill-primary' : 'text-muted-foreground/20'}`} 
                                        />
                                    ))}
                                </div>

                                <div className="pt-4 border-t border-border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
                                            <span className="text-sm font-bold text-primary-foreground font-body">
                                                {testimonial.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground font-body">{testimonial.name}</p>
                                            <p className="text-xs text-muted-foreground font-body">{testimonial.role}</p>
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
