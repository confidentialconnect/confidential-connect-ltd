import { useState, useEffect } from "react";
import { X, Rocket } from "lucide-react";
import { Button } from "./ui/button";

export const WhatsAppChannelPopup = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const dismissed = sessionStorage.getItem("wa_popup_dismissed");
        if (!dismissed) {
            const timer = setTimeout(() => setIsVisible(true), 5000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        sessionStorage.setItem("wa_popup_dismissed", "true");
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-8 text-center space-y-5">
                <button
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mx-auto">
                    <Rocket className="h-8 w-8 text-primary" />
                </div>

                <h3 className="text-xl font-bold text-foreground font-display">
                    🚀 Stay Updated!
                </h3>

                <p className="text-sm text-muted-foreground font-body leading-relaxed">
                    Join our WhatsApp Channel to receive real-time updates on jobs,
                    opportunities, and promotions from Confidential Connect Ltd.
                </p>

                <div className="flex flex-col gap-3">
                    <Button
                        className="w-full gradient-brand text-white font-body font-semibold h-12"
                        asChild
                    >
                        <a
                            href="https://whatsapp.com/channel/0029Vb7C1k61yT24qg7Ip427"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleDismiss}
                        >
                            Join Now
                        </a>
                    </Button>
                    <button
                        onClick={handleDismiss}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors font-body"
                    >
                        Maybe later
                    </button>
                </div>
            </div>
        </div>
    );
};
