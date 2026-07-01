import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { FooterNew } from "@/components/FooterNew";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, MapPin, Phone, MessageCircle, Globe, Mail, Store, ArrowLeft, Sparkles } from "lucide-react";

const BusinessDetail = () => {
  const { id } = useParams();
  const [b, setB] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", id)
        .eq("status", "approved")
        .maybeSingle();
      setB(data);
      setLoading(false);
      if (data) {
        supabase.rpc("increment_business_metric", { _business_id: id, _metric: "views" });
        document.title = `${data.name} — Confidential Connect Ltd`;
      }
    })();
  }, [id]);

  const waLink = (() => {
    if (!b) return null;
    const num = (b.whatsapp || b.phone || "").replace(/[^\d]/g, "");
    if (!num) return null;
    const normalized = num.startsWith("0") ? "234" + num.slice(1) : num;
    return `https://wa.me/${normalized}?text=${encodeURIComponent(`Hi ${b.name}, I found you on Confidential Connect Ltd.`)}`;
  })();

  const track = (metric: "whatsapp_clicks" | "link_clicks") => {
    if (id) supabase.rpc("increment_business_metric", { _business_id: id, _metric: metric });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to="/#marketplace"><ArrowLeft className="h-4 w-4 mr-1" /> Back to Marketplace</Link>
        </Button>

        {loading ? (
          <div className="h-64 rounded-xl bg-muted animate-pulse" />
        ) : !b ? (
          <Card><CardContent className="p-10 text-center">
            <Store className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <h2 className="font-semibold text-lg mb-1">Business not found</h2>
            <p className="text-sm text-muted-foreground">This listing may have been removed or is pending approval.</p>
          </CardContent></Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
              <div className="h-24 w-24 rounded-xl bg-background border shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                {b.logo_url ? <img src={b.logo_url} alt={b.name} className="h-full w-full object-cover" /> : <Store className="h-10 w-10 text-muted-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h1 className="font-heading text-2xl md:text-3xl font-bold">{b.name}</h1>
                  {b.verified && <BadgeCheck className="h-6 w-6 text-primary" />}
                  {b.promotion_tier >= 3 && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0">
                      <Sparkles className="h-3 w-3 mr-1" /> Promoted with Link
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{b.category}</p>
                {(b.city || b.state) && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" /> {[b.address, b.city, b.state].filter(Boolean).join(", ")}
                  </div>
                )}
              </div>
            </div>

            <CardContent className="p-6 md:p-8 space-y-6">
              {b.description && (
                <div>
                  <h2 className="font-semibold mb-2">About</h2>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{b.description}</p>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                {waLink && (
                  <Button asChild className="bg-green-600 hover:bg-green-700" onClick={() => track("whatsapp_clicks")}>
                    <a href={waLink} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4 mr-2" /> Chat on WhatsApp
                    </a>
                  </Button>
                )}
                {b.phone && (
                  <Button asChild variant="outline">
                    <a href={`tel:${b.phone}`}><Phone className="h-4 w-4 mr-2" /> Call {b.phone}</a>
                  </Button>
                )}
                {b.email && (
                  <Button asChild variant="outline">
                    <a href={`mailto:${b.email}`}><Mail className="h-4 w-4 mr-2" /> Email</a>
                  </Button>
                )}
                {b.website && (
                  <Button asChild variant="outline" onClick={() => track("link_clicks")}>
                    <a href={b.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2" /> Visit Website
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      <FooterNew />
    </div>
  );
};

export default BusinessDetail;