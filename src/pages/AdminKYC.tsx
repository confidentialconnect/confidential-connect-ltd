import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck, FileText, Eye } from "lucide-react";

interface KycRow {
    id: string;
    user_id: string;
    full_name: string;
    document_type: string;
    document_number: string;
    document_url: string;
    selfie_url: string | null;
    status: string;
    review_notes: string | null;
    created_at: string;
}

const AdminKYC = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [rows, setRows] = useState<KycRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("pending");
    const [notes, setNotes] = useState<Record<string, string>>({});
    const [signed, setSigned] = useState<Record<string, string>>({});

    useEffect(() => { document.title = "KYC Verification | Admin"; load(); }, []);

    const load = async () => {
        setLoading(true);
        const { data } = await (supabase as any)
            .from("kyc_submissions")
            .select("*")
            .order("created_at", { ascending: false });
        setRows((data as any) || []);
        setLoading(false);
    };

    const sign = async (id: string, path: string) => {
        const { data } = await supabase.storage.from("kyc-documents").createSignedUrl(path, 300);
        if (data?.signedUrl) {
            setSigned((s) => ({ ...s, [id]: data.signedUrl }));
            window.open(data.signedUrl, "_blank");
        }
    };

    const review = async (row: KycRow, decision: "approved" | "rejected") => {
        const note = notes[row.id] || null;
        const { error } = await (supabase as any).from("kyc_submissions").update({
            status: decision,
            review_notes: note,
            reviewed_by: user?.id,
            reviewed_at: new Date().toISOString(),
        }).eq("id", row.id);
        if (error) { toast({ title: "Failed", description: error.message, variant: "destructive" }); return; }

        if (decision === "approved") {
            await (supabase as any).from("profiles").update({ verified: true }).eq("id", row.user_id);
        }

        await (supabase as any).from("notifications").insert({
            user_id: row.user_id,
            title: decision === "approved" ? "Identity verified ✓" : "Verification update",
            message: decision === "approved"
                ? "Your identity has been verified. You now have the verified badge."
                : `Your verification was not approved. ${note || "Please re-submit with clearer documents."}`,
            type: "kyc",
        });

        await (supabase as any).from("audit_logs").insert({
            actor_id: user?.id,
            action: `kyc_${decision}`,
            target_table: "kyc_submissions",
            target_id: row.id,
            metadata: { reviewed_user: row.user_id },
        });

        toast({ title: `Marked ${decision}` });
        load();
    };

    const filtered = rows.filter((r) => r.status === tab);

    const statusBadge = (s: string) => {
        const colors: any = { pending: "bg-yellow-500/10 text-yellow-700", approved: "bg-green-500/10 text-green-700", rejected: "bg-red-500/10 text-red-700" };
        return <Badge className={colors[s]}>{s}</Badge>;
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                        <div>
                            <CardTitle>KYC Verification Queue</CardTitle>
                            <CardDescription>Review user identity submissions</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs value={tab} onValueChange={setTab}>
                        <TabsList>
                            <TabsTrigger value="pending">Pending ({rows.filter(r => r.status === "pending").length})</TabsTrigger>
                            <TabsTrigger value="approved">Approved ({rows.filter(r => r.status === "approved").length})</TabsTrigger>
                            <TabsTrigger value="rejected">Rejected ({rows.filter(r => r.status === "rejected").length})</TabsTrigger>
                        </TabsList>
                        <TabsContent value={tab} className="space-y-4 mt-4">
                            {loading ? (
                                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                            ) : filtered.length === 0 ? (
                                <p className="text-center text-sm text-muted-foreground py-8">No submissions</p>
                            ) : filtered.map((row) => (
                                <Card key={row.id} className="border">
                                    <CardContent className="pt-6 space-y-3">
                                        <div className="flex items-start justify-between gap-2 flex-wrap">
                                            <div>
                                                <p className="font-semibold">{row.full_name}</p>
                                                <p className="text-xs text-muted-foreground font-mono">{row.user_id}</p>
                                            </div>
                                            {statusBadge(row.status)}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div><span className="text-muted-foreground">Type:</span> {row.document_type}</div>
                                            <div><span className="text-muted-foreground">Number:</span> {row.document_number}</div>
                                            <div className="col-span-2"><span className="text-muted-foreground">Submitted:</span> {new Date(row.created_at).toLocaleString()}</div>
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            <Button size="sm" variant="outline" onClick={() => sign(row.id, row.document_url)}>
                                                <FileText className="h-3 w-3 mr-1" />View document
                                            </Button>
                                            {row.selfie_url && (
                                                <Button size="sm" variant="outline" onClick={() => sign(row.id + "-selfie", row.selfie_url!)}>
                                                    <Eye className="h-3 w-3 mr-1" />View selfie
                                                </Button>
                                            )}
                                        </div>
                                        {row.status === "pending" && (
                                            <>
                                                <Textarea
                                                    placeholder="Optional review notes (shown to user if rejected)"
                                                    value={notes[row.id] || ""}
                                                    onChange={(e) => setNotes((n) => ({ ...n, [row.id]: e.target.value }))}
                                                />
                                                <div className="flex gap-2">
                                                    <Button size="sm" onClick={() => review(row, "approved")} className="bg-green-600 hover:bg-green-700">Approve</Button>
                                                    <Button size="sm" variant="destructive" onClick={() => review(row, "rejected")}>Reject</Button>
                                                </div>
                                            </>
                                        )}
                                        {row.status !== "pending" && row.review_notes && (
                                            <p className="text-xs bg-muted p-2 rounded">Reviewer note: {row.review_notes}</p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminKYC;