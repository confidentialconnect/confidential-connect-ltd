import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, KeyRound, Loader2, ShoppingBag } from "lucide-react";

interface PinOrder {
    id: string;
    product_name: string;
    product_slug: string;
    quantity: number;
    unit_price: number;
    total_amount: number;
    paystack_reference: string | null;
    status: string;
    pin: string | null;
    serial: string | null;
    provider_response: any;
    created_at: string;
    delivered_at: string | null;
}

const NGN = (n: number) => `₦${Number(n).toLocaleString()}`;

const STATUS_STYLES: Record<string, string> = {
    delivered: "bg-green-500/10 text-green-600 border-green-500/20",
    paid: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    failed: "bg-red-500/10 text-red-600 border-red-500/20",
};

/** Extract all pin/serial pairs from a saved provider response (mirrors the edge function). */
const extract_tokens = (order: PinOrder): { pin: string; serial: string }[] => {
    const container =
        order.provider_response?.data ??
        order.provider_response?.cards ??
        order.provider_response?.card ??
        order.provider_response?.pins ??
        order.provider_response;
    const raw_list = Array.isArray(container) ? container : container ? [container] : [];
    const tokens = raw_list
        .map((it: any) => ({
            pin: it?.pin || it?.PIN || it?.pin_code || it?.code || it?.token || "",
            serial: it?.serial || it?.serial_no || it?.serial_number || it?.card_serial || "",
        }))
        .filter((t: { pin: string }) => t.pin);
    if (tokens.length > 0) return tokens;
    if (order.pin) return [{ pin: order.pin, serial: order.serial || "" }];
    return [];
};

const MyPurchases = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [orders, setOrders] = useState<PinOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "My Purchases | Confidential Connect Ltd";
        if (!user) { setLoading(false); return; }
        (async () => {
            const { data, error } = await supabase
                .from("pin_orders")
                .select("id,product_name,product_slug,quantity,unit_price,total_amount,paystack_reference,status,pin,serial,provider_response,created_at,delivered_at")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });
            if (error) {
                toast({ title: "Error", description: "Could not load your purchases.", variant: "destructive" });
            }
            setOrders((data as PinOrder[]) || []);
            setLoading(false);
        })();
    }, [user]);

    const copy_text = async (label: string, value: string) => {
        await navigator.clipboard.writeText(value);
        toast({ title: "Copied", description: `${label} copied to clipboard.` });
    };

    const download_receipt = (order: PinOrder) => {
        const tokens = extract_tokens(order);
        const lines = [
            "CONFIDENTIAL CONNECT LTD (RC 9081270)",
            "In partnership with All Campus Connect TV",
            "----------------------------------------",
            "PURCHASE RECEIPT",
            "",
            `Product:    ${order.product_name}`,
            `Quantity:   ${order.quantity}`,
            `Unit Price: ${NGN(order.unit_price)}`,
            `Total Paid: ${NGN(order.total_amount)}`,
            `Status:     ${order.status.toUpperCase()}`,
            `Reference:  ${order.paystack_reference || "-"}`,
            `Date:       ${new Date(order.created_at).toLocaleString()}`,
            "",
            ...tokens.flatMap((t, i) => [
                `Token ${i + 1}:`,
                `  PIN:    ${t.pin}`,
                `  Serial: ${t.serial || "-"}`,
            ]),
            "",
            "Support: WhatsApp +234 704 029 4858",
        ];
        const blob = new Blob([lines.join("\n")], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `receipt-${order.paystack_reference || order.id}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (!user) {
        return (
            <div className="min-h-screen">
                <Header />
                <div className="flex items-center justify-center min-h-[60vh] pt-20">
                    <Card className="w-full max-w-md mx-4">
                        <CardHeader className="text-center">
                            <CardTitle>Sign In Required</CardTitle>
                            <CardDescription>Please sign in to view your purchases</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full"><Link to="/auth">Sign In</Link></Button>
                        </CardContent>
                    </Card>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">My Purchases</h1>
                            <p className="text-muted-foreground mt-1">Your digital PIN &amp; token purchases</p>
                        </div>
                        <Button asChild>
                            <Link to="/buy-pin"><KeyRound className="h-4 w-4 mr-2" /> Buy a PIN</Link>
                        </Button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                    ) : orders.length === 0 ? (
                        <Card>
                            <CardContent className="p-10 text-center">
                                <ShoppingBag className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                                <h3 className="font-semibold mb-1">No purchases yet</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Your purchased PINs and tokens will appear here.
                                </p>
                                <Button asChild size="sm"><Link to="/buy-pin">Browse Digital Products</Link></Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => {
                                const tokens = extract_tokens(order);
                                return (
                                    <Card key={order.id}>
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between gap-3 flex-wrap">
                                                <div>
                                                    <CardTitle className="text-base">{order.product_name}</CardTitle>
                                                    <CardDescription>
                                                        {new Date(order.created_at).toLocaleString()} · Qty {order.quantity} · {NGN(order.total_amount)}
                                                    </CardDescription>
                                                </div>
                                                <Badge variant="outline" className={STATUS_STYLES[order.status] || ""}>
                                                    {order.status}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            {order.status === "delivered" && tokens.length > 0 ? (
                                                tokens.map((t, i) => (
                                                    <div key={i} className="rounded-lg border bg-muted/40 p-3 space-y-2">
                                                        {tokens.length > 1 && (
                                                            <p className="text-xs font-medium text-muted-foreground">Token {i + 1}</p>
                                                        )}
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className="text-sm min-w-0">
                                                                <span className="text-muted-foreground">PIN:</span>{" "}
                                                                <code className="font-semibold break-all">{t.pin}</code>
                                                            </p>
                                                            <Button size="sm" variant="ghost" onClick={() => copy_text("PIN", t.pin)}>
                                                                <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                                                            </Button>
                                                        </div>
                                                        {t.serial && (
                                                            <div className="flex items-center justify-between gap-2">
                                                                <p className="text-sm min-w-0">
                                                                    <span className="text-muted-foreground">Serial:</span>{" "}
                                                                    <code className="font-semibold break-all">{t.serial}</code>
                                                                </p>
                                                                <Button size="sm" variant="ghost" onClick={() => copy_text("Serial", t.serial)}>
                                                                    <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : order.status === "failed" ? (
                                                <p className="text-sm text-destructive">
                                                    Delivery failed — our team has been alerted. Contact support on WhatsApp if not resolved shortly.
                                                </p>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">Payment received — delivery in progress.</p>
                                            )}

                                            <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                                                <p className="text-xs text-muted-foreground truncate">
                                                    Ref: {order.paystack_reference || "-"}
                                                </p>
                                                <Button size="sm" variant="outline" onClick={() => download_receipt(order)}>
                                                    <Download className="h-3.5 w-3.5 mr-1" /> Receipt
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MyPurchases;