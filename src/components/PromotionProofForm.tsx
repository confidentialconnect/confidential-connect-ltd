import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageCircle, Upload, ArrowRight } from "lucide-react";

const proofSchema = z.object({
    fullName: z.string().trim().min(2, "Full name is required").max(100),
    businessName: z.string().trim().min(2, "Business name is required").max(120),
    phone: z.string().trim().min(10, "Valid phone required").max(20)
        .regex(/^[0-9+\s-]+$/, "Phone may only contain digits, +, - or spaces"),
    email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
    promoteWhat: z.string().trim().min(3, "Tell us what you want to promote").max(500),
    targetAudience: z.string().trim().max(200).optional().or(z.literal("")),
    duration: z.string().trim().max(100).optional().or(z.literal("")),
});

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp", "application/pdf"];

interface Props {
    plan: { name: string; price: string; period: string; amount: string };
}

export const PromotionProofForm = ({ plan }: Props) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        businessName: "",
        phone: "",
        email: "",
        promoteWhat: "",
        targetAudience: "",
        duration: "",
    });
    const [file, setFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((f) => ({ ...f, [k]: e.target.value }));

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        if (!f) return setFile(null);
        if (!ALLOWED_TYPES.includes(f.type)) {
            toast({ title: "Invalid file type", description: "Upload an image (PNG/JPG/WebP) or PDF.", variant: "destructive" });
            return;
        }
        if (f.size > MAX_FILE_BYTES) {
            toast({ title: "File too large", description: "Maximum file size is 5 MB.", variant: "destructive" });
            return;
        }
        setFile(f);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (!user) {
            toast({ title: "Please sign in", description: "You need an account to submit payment proof.", variant: "destructive" });
            navigate(`/auth?redirect=${encodeURIComponent(window.location.pathname)}`);
            return;
        }

        const parsed = proofSchema.safeParse(form);
        if (!parsed.success) {
            const fieldErrors: Record<string, string> = {};
            parsed.error.issues.forEach((i) => {
                if (i.path[0]) fieldErrors[i.path[0] as string] = i.message;
            });
            setErrors(fieldErrors);
            toast({ title: "Please fix the form errors", variant: "destructive" });
            return;
        }
        if (!file) {
            toast({ title: "Receipt required", description: "Please upload your payment screenshot.", variant: "destructive" });
            return;
        }

        setSubmitting(true);
        try {
            // 1. Upload receipt to per-user folder
            const ext = file.name.split(".").pop() || "bin";
            const path = `${user.id}/${Date.now()}-${plan.name.toLowerCase()}.${ext}`;
            const { error: upErr } = await supabase.storage.from("receipts").upload(path, file, {
                contentType: file.type,
                upsert: false,
            });
            if (upErr) throw upErr;

            // 2. Insert submission row
            const { error: dbErr } = await supabase.from("promotion_payments").insert({
                user_id: user.id,
                plan: plan.name,
                amount: Number(plan.amount),
                full_name: parsed.data.fullName,
                business_name: parsed.data.businessName,
                phone: parsed.data.phone,
                email: parsed.data.email || null,
                promote_what: parsed.data.promoteWhat,
                target_audience: parsed.data.targetAudience || null,
                duration: parsed.data.duration || null,
                receipt_url: path,
            });
            if (dbErr) throw dbErr;

            // 3. Build WhatsApp message and open
            const msg = `Hello, I just made payment for promotion on Confidential Connect Ltd.\n\nFull Name: ${parsed.data.fullName}\nBusiness Name: ${parsed.data.businessName}\nPhone: ${parsed.data.phone}${parsed.data.email ? `\nEmail: ${parsed.data.email}` : ""}\nSelected Plan: ${plan.name} (${plan.price} ${plan.period})\nWhat I want to promote: ${parsed.data.promoteWhat}${parsed.data.targetAudience ? `\nTarget Audience: ${parsed.data.targetAudience}` : ""}${parsed.data.duration ? `\nDuration: ${parsed.data.duration}` : ""}\n\nPayment Screenshot attached.`;
            const url = `https://wa.me/2347040294858?text=${encodeURIComponent(msg)}`;

            toast({
                title: "Submission saved ✅",
                description: "Now send the screenshot on WhatsApp to complete activation.",
            });
            window.open(url, "_blank", "noopener,noreferrer");
        } catch (err: any) {
            toast({
                title: "Submission failed",
                description: err?.message ?? "Please try again.",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input id="fullName" value={form.fullName} onChange={update("fullName")} maxLength={100} required />
                    {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input id="businessName" value={form.businessName} onChange={update("businessName")} maxLength={120} required />
                    {errors.businessName && <p className="text-xs text-destructive">{errors.businessName}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="phone">WhatsApp Phone *</Label>
                    <Input id="phone" value={form.phone} onChange={update("phone")} maxLength={20} placeholder="0704..." required />
                    {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="email">Email (optional)</Label>
                    <Input id="email" type="email" value={form.email} onChange={update("email")} maxLength={255} />
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="promoteWhat">What do you want to promote? *</Label>
                <Textarea
                    id="promoteWhat" rows={3} maxLength={500}
                    value={form.promoteWhat} onChange={update("promoteWhat")}
                    placeholder="Product, service, brand, event…" required
                />
                {errors.promoteWhat && <p className="text-xs text-destructive">{errors.promoteWhat}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Input id="targetAudience" value={form.targetAudience} onChange={update("targetAudience")} maxLength={200} placeholder="Students, business owners…" />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="duration">Preferred Duration</Label>
                    <Input id="duration" value={form.duration} onChange={update("duration")} maxLength={100} placeholder="e.g. Start tomorrow" />
                </div>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="receipt">Payment Screenshot * <span className="text-xs text-muted-foreground">(PNG/JPG/PDF, max 5 MB)</span></Label>
                <div className="flex items-center gap-3">
                    <Input id="receipt" type="file" accept="image/png,image/jpeg,image/webp,application/pdf" onChange={handleFile} required />
                </div>
                {file && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Upload className="h-3 w-3" /> {file.name} ({(file.size / 1024).toFixed(0)} KB)
                    </p>
                )}
            </div>

            <Button type="submit" size="lg" disabled={submitting}
                className="w-full gradient-brand text-white shadow-brand font-body font-semibold">
                {submitting ? (
                    <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Submitting…</>
                ) : (
                    <><MessageCircle className="h-5 w-5 mr-2" /> Submit & Send on WhatsApp <ArrowRight className="h-4 w-4 ml-2" /></>
                )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
                Your details are saved securely. After clicking submit, attach the screenshot in WhatsApp to finalize.
            </p>
        </form>
    );
};