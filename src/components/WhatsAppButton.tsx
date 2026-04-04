import { MessageCircle } from "lucide-react";

export const WhatsAppButton = () => {
    return (
        <a
            href="https://wa.me/2347040294858?text=Hello%2C%20I%20need%20assistance%20from%20Confidential%20Connect%20LTD."
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white px-5 py-3.5 rounded-full shadow-lg transition-all duration-300 hover:scale-105 group font-body"
        >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-semibold hidden sm:inline group-hover:inline tracking-wide">
                Chat with us
            </span>
        </a>
    );
};
