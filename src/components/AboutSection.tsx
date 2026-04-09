import { Target, Eye, Handshake } from "lucide-react";

export const AboutSection = () => {
    return (
        <section id="about" className="py-24 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4 font-body">About Us</p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-display">
                        Who We Are
                    </h2>
                    <div className="line-gold mx-auto mb-6" />
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-body leading-relaxed">
                        <strong className="text-foreground">Confidential Connect Ltd</strong> is a platform that connects individuals to 
                        opportunities, services, and business growth. In partnership with{" "}
                        <strong className="text-primary">All Campus Connect TV</strong>, we bridge the gap between 
                        ambition and achievement for students, graduates, and entrepreneurs across Nigeria.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Mission */}
                    <div className="bg-card border border-border rounded-2xl p-8 hover-gold transition-all duration-300">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent mb-6">
                            <Target className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3 font-display">Our Mission</h3>
                        <p className="text-muted-foreground font-body leading-relaxed">
                            To connect individuals with the right opportunities, accurate information, 
                            and reliable services — empowering them to make informed decisions and 
                            achieve their goals.
                        </p>
                    </div>

                    {/* Vision */}
                    <div className="bg-card border border-border rounded-2xl p-8 hover-gold transition-all duration-300">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent mb-6">
                            <Eye className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3 font-display">Our Vision</h3>
                        <p className="text-muted-foreground font-body leading-relaxed">
                            To become one of Africa's leading platforms for student empowerment, 
                            opportunity access, and business promotion — shaping a future where 
                            no potential goes untapped.
                        </p>
                    </div>
                </div>

                {/* Partnership highlight */}
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-3 bg-accent border border-primary/10 rounded-full px-6 py-3">
                        <Handshake className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium text-foreground font-body">
                            Proudly in partnership with <strong className="text-primary">All Campus Connect TV</strong>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};
