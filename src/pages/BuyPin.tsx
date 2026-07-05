import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, GraduationCap, ShieldCheck, Ticket, Plus, Minus } from "lucide-react";

type PinProduct = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  retail_price: number;
  is_active: boolean;
  sort_order: number;
};

const NGN = (n: number) => `₦${Number(n).toLocaleString()}`;

export default function BuyPin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<PinProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [paying, setPaying] = useState(false);
  const [result, setResult] = useState<{ tokens: { pin: string; serial: string }[]; product: string; reference: string } | null>(null);

  useEffect(() => {
    document.title = "Buy WAEC, NECO, NABTEB Result Checker PINs — Confidential Connect";
    (async () => {
      const { data, error } = await supabase
        .from("pin_products")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) toast({ title: "Failed to load products", description: error.message, variant: "destructive" });
      setProducts((data as PinProduct[]) || []);
      if (data && data.length && !selectedSlug) setSelectedSlug((data[0] as PinProduct).slug);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (user?.email && !customerEmail) setCustomerEmail(user.email);
  }, [user]);

  const selected = useMemo(() => products.find((p) => p.slug === selectedSlug) || null, [products, selectedSlug]);
  const total = useMemo(() => (selected ? Number(selected.retail_price) * quantity : 0), [selected, quantity]);

  const handlePay = async () => {
    if (!user) { navigate("/auth?redirect=/buy-pin"); return; }
    if (!selected) return;
    if (!customerName.trim() || !customerEmail.trim()) {
      toast({ title: "Fill in your details", description: "Name and email are required.", variant: "destructive" });
      return;
    }
    const PaystackPop = (window as any).PaystackPop;
    if (!PaystackPop) {
      toast({ title: "Paystack not loaded", description: "Please refresh and try again.", variant: "destructive" });
      return;
    }
    const key = (import.meta as any).env?.VITE_PAYSTACK_PUBLIC_KEY || "pk_live_258b0e0fcab902ea3361ef5affa8110b925badc1";
    const reference = `PIN-${Date.now()}-${Math.random().toString(36).slice(2, 9).toUpperCase()}`;

    setPaying(true);
    const handler = PaystackPop.setup({
      key,
      email: customerEmail.trim(),
      amount: Math.round(total * 100),
      currency: "NGN",
      ref: reference,
      metadata: {
        product_slug: selected.slug,
        product_name: selected.name,
        quantity,
        customer_name: customerName.trim(),
      },
      callback: (response: any) => {
        (async () => {
          try {
            const { data, error } = await supabase.functions.invoke("purchase-pin", {
              body: {
                reference: response.reference,
                product_slug: selected.slug,
                quantity,
                customer_name: customerName.trim(),
                customer_email: customerEmail.trim(),
              },
            });
            if (error) throw error;
            if (!data?.success) {
              toast({
                title: "Delivery failed",
                description: data?.error || "Please contact support with your reference.",
                variant: "destructive",
              });
              return;
            }
            const tokens = Array.isArray(data.tokens) && data.tokens.length
              ? data.tokens
              : [{ pin: data.pin, serial: data.serial }];
            setResult({ tokens, product: data.product || selected.name, reference: response.reference });
            toast({ title: "PIN delivered", description: "Check your email for a copy." });
          } catch (e: any) {
            toast({ title: "Verification error", description: e.message || "Please contact support.", variant: "destructive" });
          } finally {
            setPaying(false);
          }
        })();
      },
      onClose: () => setPaying(false),
    });
    handler.openIframe();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-5xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 text-primary">
            <GraduationCap className="h-6 w-6" />
            <span className="text-sm font-semibold uppercase tracking-wide">Instant Result PINs</span>
          </div>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold">Buy WAEC · NECO · NABTEB PINs</h1>
          <p className="mt-3 text-muted-foreground">Instant delivery to your screen and email after payment. 24/7.</p>
        </div>

        {result ? (
          <Card className="p-8 max-w-xl mx-auto text-center border-primary">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h2 className="text-2xl font-bold mb-2">{result.product} delivered</h2>
            <p className="text-sm text-muted-foreground mb-6">A copy has also been sent to {customerEmail}.</p>
            <div className="space-y-3 text-left">
              {result.tokens.map((t, i) => (
                <div key={i} className="rounded-lg bg-muted p-4 font-mono">
                  <div className="text-xs uppercase text-muted-foreground mb-1">Token {i + 1}</div>
                  <div><span className="text-xs uppercase text-muted-foreground">PIN</span><div className="text-lg font-bold">{t.pin}</div></div>
                  <div className="mt-1"><span className="text-xs uppercase text-muted-foreground">Serial</span><div className="text-lg font-bold">{t.serial}</div></div>
                </div>
              ))}
              <div className="rounded-lg border p-3 font-mono">
                <span className="text-xs uppercase text-muted-foreground">Reference</span>
                <div className="text-sm">{result.reference}</div>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => { setResult(null); setQuantity(1); }}>Buy another</Button>
              <Button variant="outline" asChild><Link to="/dashboard">View my orders</Link></Button>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h2 className="font-semibold text-lg">1. Choose a PIN</h2>
              {loading ? (
                <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
              ) : products.length === 0 ? (
                <p className="text-muted-foreground">No products available right now.</p>
              ) : (
                products.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedSlug(p.slug)}
                    className={`w-full text-left border rounded-lg p-4 transition ${selectedSlug === p.slug ? "border-primary bg-primary/5 ring-2 ring-primary/30" : "hover:border-primary/50"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold">{p.name}</div>
                        {p.description && <div className="text-sm text-muted-foreground mt-1">{p.description}</div>}
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">{NGN(p.retail_price)}</div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            <Card className="p-6 h-fit sticky top-24">
              <h2 className="font-semibold text-lg mb-4">2. Your details</h2>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Jane Doe" />
                </div>
                <div>
                  <Label htmlFor="email">Email (PIN delivery)</Label>
                  <Input id="email" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="you@example.com" />
                </div>
              </div>

              {selected && (
                <div className="mt-6 border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Ticket className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-sm">Tokens in this order ({quantity})</h3>
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {Array.from({ length: quantity }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between text-sm bg-muted/50 rounded-md px-3 py-2">
                        <span className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold">{i + 1}</span>
                          <span>{selected.name}</span>
                        </span>
                        <span className="font-medium">{NGN(selected.retail_price)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Adjust quantity</span>
                    <div className="flex items-center gap-2">
                      <Button type="button" size="icon" variant="outline" className="h-8 w-8"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{quantity}</span>
                      <Button type="button" size="icon" variant="outline" className="h-8 w-8"
                        onClick={() => setQuantity((q) => Math.min(10, q + 1))} disabled={quantity >= 10}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span>Unit price</span><span>{selected ? NGN(selected.retail_price) : "—"}</span></div>
                <div className="flex justify-between"><span>Quantity</span><span>× {quantity}</span></div>
                <div className="flex justify-between text-base font-bold text-primary pt-2 border-t"><span>Total</span><span>{NGN(total)}</span></div>
              </div>

              <Button className="w-full mt-6" size="lg" disabled={!selected || paying || total <= 0} onClick={handlePay}>
                {paying ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</> : `Pay ${NGN(total)} with Paystack`}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-3 flex items-center justify-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Secure payment. Instant PIN delivery.
              </p>
              {!user && (
                <p className="text-xs text-center mt-2">
                  <Link to="/auth?redirect=/buy-pin" className="text-primary underline">Sign in</Link> to buy — required for order history.
                </p>
              )}
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}