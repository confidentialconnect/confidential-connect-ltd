import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ScrollText } from "lucide-react";

interface LogRow {
    id: string;
    actor_id: string | null;
    action: string;
    target_table: string | null;
    target_id: string | null;
    metadata: any;
    created_at: string;
}

const AdminAuditLogs = () => {
    const [rows, setRows] = useState<LogRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState("");

    useEffect(() => {
        document.title = "Audit Logs | Admin";
        (async () => {
            const { data } = await (supabase as any)
                .from("audit_logs")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(500);
            setRows((data as any) || []);
            setLoading(false);
        })();
    }, []);

    const filtered = rows.filter((r) => {
        if (!q) return true;
        const hay = `${r.action} ${r.target_table || ""} ${r.target_id || ""} ${JSON.stringify(r.metadata || {})}`.toLowerCase();
        return hay.includes(q.toLowerCase());
    });

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <ScrollText className="h-6 w-6 text-primary" />
                        <div>
                            <CardTitle>Audit Logs</CardTitle>
                            <CardDescription>Last 500 sensitive actions across the platform</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Input placeholder="Search action, table, id…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-md mb-4" />
                    {loading ? (
                        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="text-left text-xs uppercase text-muted-foreground border-b">
                                    <tr>
                                        <th className="py-2 pr-3">When</th>
                                        <th className="py-2 pr-3">Action</th>
                                        <th className="py-2 pr-3">Actor</th>
                                        <th className="py-2 pr-3">Target</th>
                                        <th className="py-2 pr-3">Metadata</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((r) => (
                                        <tr key={r.id} className="border-b last:border-0 align-top">
                                            <td className="py-2 pr-3 text-xs whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                                            <td className="py-2 pr-3"><Badge variant="outline">{r.action}</Badge></td>
                                            <td className="py-2 pr-3 font-mono text-[11px]">{r.actor_id?.slice(0, 8) || "—"}</td>
                                            <td className="py-2 pr-3 text-xs">{r.target_table}{r.target_id ? `/${r.target_id.slice(0, 8)}` : ""}</td>
                                            <td className="py-2 pr-3 text-xs font-mono max-w-md truncate">{r.metadata ? JSON.stringify(r.metadata) : ""}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">No log entries</p>}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminAuditLogs;