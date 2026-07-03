import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Zap, ShieldCheck } from "lucide-react";

export const InstantPinsBanner = () => {
  return (
    <section className="py-12 bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto rounded-2xl border border-primary/20 bg-card p-8 md:p-10 shadow-sm">
          <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-wide">
                <GraduationCap className="h-5 w-5" /> Instant Result PINs
              </div>
              <h2 className="mt-2 text-2xl md:text-3xl font-bold">
                Buy WAEC, NECO &amp; NABTEB PINs — delivered in seconds
              </h2>
              <p className="mt-3 text-muted-foreground max-w-2xl">
                Pay securely with Paystack and receive your Result Checker PIN and Serial on-screen and by email immediately. Available 24/7.
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Zap className="h-4 w-4 text-primary" /> Instant delivery</span>
                <span className="inline-flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-primary" /> Secure payment</span>
              </div>
            </div>
            <div className="flex md:justify-end">
              <Button asChild size="lg" className="w-full md:w-auto">
                <Link to="/buy-pin">Buy a PIN now</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};