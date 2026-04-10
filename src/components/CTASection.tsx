import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Megaphone, Rocket } from "lucide-react";

export const CTASection = () => {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl gradient-hero p-12 sm:p-16 lg:p-20 text-center">
                    {/* Background effects */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[hsl(280_70%_55%_/_0.08)] blur-[80px]" />

                    <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                        <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 rounded-full px-5 py-2">
                            <Rocket className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary/90 font-body">Don't miss out</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-display leading-tight">
                            Ready to Unlock Your Next Opportunity?
                        </h2>

                        <p className="text-lg text-white/50 font-body max-w-xl mx-auto">
                            Join thousands of students, graduates, and entrepreneurs who are already 
                            growing with Confidential Connect Ltd.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button
                                size="lg"
                                className="gradient-brand text-white shadow-brand-lg text-base px-8 font-body font-semibold h-13"
                                asChild
                            >
                                <a href="https://whatsapp.com/channel/0029Vb7C1k61yT24qg7Ip427" target="_blank" rel="noopener noreferrer">
                                    Join Now
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </a>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="text-base px-8 border-white/20 text-white hover:bg-white/10 font-body h-13"
                                asChild
                            >
                                <Link to="/advertising">
                                    <Megaphone className="h-4 w-4 mr-2" />
                                    Promote Your Business
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="ghost"
                                className="text-base px-6 text-white/60 hover:text-white hover:bg-white/5 font-body h-13"
                                asChild
                            >
                                <Link to="/categories">
                                    Get Started
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
