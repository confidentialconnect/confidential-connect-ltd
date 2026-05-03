import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Search, Mail, Phone, Users as UsersIcon } from "lucide-react";

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  created_at: string | null;
}

interface UserRow extends Profile {
  promotionCount: number;
  serviceCount: number;
  orderCount: number;
  totalSpent: number;
}

const AdminUsers = () => {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.title = "Users | Admin Dashboard";
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profRes, promoRes, svcRes, ordRes] = await Promise.all([
        supabase.from("profiles").select("id, email, full_name, phone, created_at").order("created_at", { ascending: false }),
        supabase.from("promotion_payments").select("user_id, amount, status"),
        supabase.from("service_requests").select("user_id"),
        supabase.from("orders").select("user_id, total_amount, payment_status"),
      ]);
      const profiles = (profRes.data ?? []) as Profile[];
      const promos = promoRes.data ?? [];
      const svcs = svcRes.data ?? [];
      const orders = ordRes.data ?? [];

      const merged: UserRow[] = profiles.map((p) => {
        const userPromos = promos.filter((x: any) => x.user_id === p.id);
        const userOrders = orders.filter((x: any) => x.user_id === p.id);
        const spent =
          userPromos
            .filter((x: any) => ["approved", "live", "in_progress", "completed"].includes(x.status))
            .reduce((s: number, x: any) => s + Number(x.amount || 0), 0) +
          userOrders
            .filter((x: any) => x.payment_status === "completed")
            .reduce((s: number, x: any) => s + Number(x.total_amount || 0), 0);
        return {
          ...p,
          promotionCount: userPromos.length,
          serviceCount: svcs.filter((x: any) => x.user_id === p.id).length,
          orderCount: userOrders.length,
          totalSpent: spent,
        };
      });
      setRows(merged);
    } finally {
      setLoading(false);
    }
  };

  const filtered = rows.filter((r) => {
    const q = search.toLowerCase();
    return (
      !q ||
      (r.full_name ?? "").toLowerCase().includes(q) ||
      (r.email ?? "").toLowerCase().includes(q) ||
      (r.phone ?? "").includes(q)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 pt-20">
      <div className="max-w-7xl mx-auto">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/admin"><ArrowLeft className="h-4 w-4 mr-2" />Back to Admin</Link>
        </Button>
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2"><UsersIcon className="h-7 w-7" />Users</h1>
          <p className="text-muted-foreground">All registered users and their activity.</p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <Card className="md:col-span-2 lg:col-span-3"><CardContent className="p-10 text-center text-muted-foreground">No users found.</CardContent></Card>
          ) : (
            filtered.map((u) => (
              <Card key={u.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 space-y-3">
                  <div>
                    <p className="font-semibold truncate">{u.full_name || "Unnamed"}</p>
                    <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
                      {u.email && <p className="flex items-center gap-1 truncate"><Mail className="h-3 w-3" />{u.email}</p>}
                      {u.phone && <p className="flex items-center gap-1"><Phone className="h-3 w-3" />{u.phone}</p>}
                      {u.created_at && <p>Joined {new Date(u.created_at).toLocaleDateString("en-NG")}</p>}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{u.promotionCount} promotions</Badge>
                    <Badge variant="outline">{u.serviceCount} requests</Badge>
                    <Badge variant="outline">{u.orderCount} orders</Badge>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Total spent: </span>
                    <span className="font-bold text-primary">₦{u.totalSpent.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;