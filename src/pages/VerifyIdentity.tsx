import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Loader2, CheckCircle2, Clock, XCircle } from "lucide-react";

const DOC_TYPES = [
    { value: "nin", label: "National Identification Number (NIN) Slip" },
    { value: "passport", label: "International Passport" },
    { value: "drivers_license", label: "Driver's License" },
    { value: "voters_card", label: "Voter's Card" },
];

const VerifyIdentity = () => {
    const { user, profile } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [existing, setExisting] = useState<any>(null);

    const [fullName, setFullName] = useState("");
    const [docType, setDocType] = useState("nin");
    const [docNumber, setDocNumber] = useState("");
    const [docFile, setDocFile] = useState<File | null>(null);
    const [selfieFile, setSelfieFile] = useState<File | null>(null);

    useEffect(() => {
        document.title = "Verify Identity | Confidential Connect Ltd";
        if (!user) { navigate("/auth"); return; }
        setFullName(profile?.full_name || "");
        (async () => {
            const { data } = await (supabase as any)
                .from("kyc_submissions")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle();
            setExisting(data);
            setLoading(false);
        })();
    }, [user, profile, navigate]);

    const uploadFile = async (file: File, kind: string) => {
        const ext = file.name.split(".").pop() || "bin";
        const path = `${user!.id}/${kind}-${Date.now()}.${ext}`;
        const { error } = await supabase.storage.from("kyc-documents").upload(path, file, {
            cacheControl: "3600", upsert: false,
        });
        if (error) throw error;
        return path;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (!fullName.trim() || !docNumber.trim() || !docFile) {
            toast({ title: "Missing info", description: "Please fill in all required fields.", variant: "destructive" });
            return;
        }
        setSubmitting(true);
        try {
            const documentPath = await uploadFile(docFile, "document");
            let selfiePath: string | null = null;
            if (selfieFile) selfiePath = await uploadFile(selfieFile, "selfie");

            const { error } = await (supabase as any).from("kyc_submissions").insert({
                user_id: user.id,
                full_name: fullName.trim(),
                document_type: docType,
                document_number: docNumber.trim(),
                document_url: documentPath,
                selfie_url: selfiePath,
                status: "pending",
            });
            if (error) throw error;

            await (supabase as any).from("audit_logs").insert({
                actor_id: user.id,
                action: "kyc_submitted",
                target_table: "kyc_submissions",
                metadata: { document_type: docType },
            });

            toast({ title: "Submitted", description: "Your verification is under review. We'll notify you within 24-48 hours." });
            navigate("/dashboard");
        } catch (err: any) {
            toast({ title: "Upload failed", description: err.message || "Try again", variant: "destructive" });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="flex items-center justify-center py-32">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    const statusBadge = (status: string) => {
        if (status === "approved") return <Badge className="bg-green-500/10 text-green-700 border-green-500/30"><CheckCircle2 className="h-3 w-3 mr-1" />Approved</Badge>;
        if (status === "rejected") return <Badge className="bg-red-500/10 text-red-700 border-red-500/30"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
        return <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-500/30"><Clock className="h-3 w-3 mr-1" />Pending review</Badge>;
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-10 max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Identity Verification</h1>
                        <p className="text-sm text-muted-foreground">Get a verified badge and unlock higher transaction limits.</p>
                    </div>
                </div>

                {existing && (
                    <Card className="mb-6">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">Latest submission</CardTitle>
                                {statusBadge(existing.status)}
                            </div>
                            <CardDescription>Submitted {new Date(existing.created_at).toLocaleString()}</CardDescription>
                        </CardHeader>
                        {existing.review_notes && (
                            <CardContent>
                                <p className="text-sm bg-muted p-3 rounded-md"><span className="font-medium">Reviewer notes:</span> {existing.review_notes}</p>
                            </CardContent>
                        )}
                    </Card>
                )}

                {(!existing || existing.status === "rejected") && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Submit your documents</CardTitle>
                            <CardDescription>Files are encrypted and only accessible to our verification team.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="fullName">Full legal name *</Label>
                                    <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={120} required />
                                </div>
                                <div>
                                    <Label>Document type *</Label>
                                    <Select value={docType} onValueChange={setDocType}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {DOC_TYPES.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="docNumber">Document number *</Label>
                                    <Input id="docNumber" value={docNumber} onChange={(e) => setDocNumber(e.target.value)} maxLength={64} required />
                                </div>
                                <div>
                                    <Label htmlFor="docFile">Upload document (image or PDF) *</Label>
                                    <Input id="docFile" type="file" accept="image/*,application/pdf" onChange={(e) => setDocFile(e.target.files?.[0] ?? null)} required />
                                </div>
                                <div>
                                    <Label htmlFor="selfieFile">Selfie holding document (optional)</Label>
                                    <Input id="selfieFile" type="file" accept="image/*" onChange={(e) => setSelfieFile(e.target.files?.[0] ?? null)} />
                                </div>
                                <Button type="submit" disabled={submitting} className="w-full">
                                    {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading…</> : "Submit for verification"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default VerifyIdentity;