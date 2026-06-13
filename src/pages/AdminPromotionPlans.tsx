import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, History, Save } from "lucide-react";
import { formatNaira } from "@/hooks/usePromotionPlans";

interface Plan {
    id: string;
    slug: string;
    name: string;
    emoji: string | null;
    description: string | null;
    price: number;
    period_label: string | null;
    duration_label: string;
    duration_days: number;
    features: string[];
    popular: boolean;
    visible: boolean;
    active: boolean;
    sort_order: number;
}

interface PriceHistoryRow {
    id: string;
    plan_id: string;
    plan_name: string;
    plan_slug: string;
    old_price: number | null;
    new_price: number;
    changed_by_email: string | null;
    changed_at: string;
}

const emptyDraft: Omit<Plan, "id"> = {
    slug: "",
    name: "",
    emoji: "",
    description: "",
    price: 0,
    period_label: "",
    duration_label: "",
    duration_days: 1,
    features: [],
    popular: false,
    visible: true,
    active: true,
    sort_order: 100,
};

const AdminPromotionPlans = () => {
    const { toast } = useToast();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [history, setHistory] = useState<PriceHistoryRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Plan | null>(null);
    const [creating, setCreating] = useState(false);
    const [draft, setDraft] = useState<Omit<Plan, "id">>(emptyDraft);
    const [featuresText, setFeaturesText] = useState("");
    const [saving, setSaving] = useState(false);

    const load = async () => {
        const [{ data: p }, { data: h }] = await Promise.all([
            supabase.from("promotion_plans").select("*").order("sort_order"),
            supabase
                .from("promotion_plan_price_history")
                .select("*")
                .order("changed_at", { ascending: false })
                .limit(50),
        ]);
        setPlans(((p ?? []) as any[]).map((r) => ({ ...r, price: Number(r.price), features: Array.isArray(r.features) ? r.features : [] })));
        setHistory((h ?? []) as any);
        setLoading(false);
    };

    useEffect(() => {
        load();
        const ch = supabase
            .channel("admin_promotion_plans")
            .on("postgres_changes", { event: "*", schema: "public", table: "promotion_plans" }, () => load())
            .on("postgres_changes", { event: "*", schema: "public", table: "promotion_plan_price_history" }, () => load())
            .subscribe();
        return () => {
            supabase.removeChannel(ch);
        };
    }, []);

    const openCreate = () => {
        setDraft({ ...emptyDraft });
        setFeaturesText("");
        setEditing(null);
        setCreating(true);
    };
    const openEdit = (p: Plan) => {
        const { id: _id, ...rest } = p;
        setDraft(rest);
        setFeaturesText(p.features.join("\n"));
        setEditing(p);
        setCreating(true);
    };
    const close = () => {
        setCreating(false);
        setEditing(null);
    };

    const save = async () => {
        if (!draft.slug || !draft.name || !draft.duration_label) {
            toast({ title: "Missing required fields", description: "Slug, name and duration label are required.", variant: "destructive" });
            return;
        }
        if (draft.price < 0) {
            toast({ title: "Invalid price", variant: "destructive" });
            return;
        }
        setSaving(true);
        const features = featuresText.split("\n").map((s) => s.trim()).filter(Boolean);
        const payload = { ...draft, features, slug: draft.slug.toLowerCase().trim() };

        const { error } = editing
            ? await supabase.from("promotion_plans").update(payload).eq("id", editing.id)
            : await supabase.from("promotion_plans").insert(payload);
        setSaving(false);

        if (error) {
            toast({ title: "Save failed", description: error.message, variant: "destructive" });
            return;
        }
        toast({ title: editing ? "Plan updated" : "Plan created", description: "Changes are live on the website." });
        close();
        load();
    };

    const toggle = async (p: Plan, field: "active" | "visible" | "popular") => {
        const { error } = await supabase.from("promotion_plans").update({ [field]: !p[field] }).eq("id", p.id);
        if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    };

    const quickPrice = async (p: Plan, raw: string) => {
        const val = Number(raw);
        if (!Number.isFinite(val) || val < 0) {
            toast({ title: "Invalid price", variant: "destructive" });
            return;
        }
        if (val === p.price) return;
        const { error } = await supabase.from("promotion_plans").update({ price: val }).eq("id", p.id);
        if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
        else toast({ title: "Price updated", description: `${p.name}: ${formatNaira(val)} — live on site.` });
    };

    const remove = async (p: Plan) => {
        if (!confirm(`Delete the "${p.name}" plan? This cannot be undone.`)) return;
        const { error } = await supabase.from("promotion_plans").delete().eq("id", p.id);
        if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
        else toast({ title: "Plan deleted" });
    };

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold font-display">Promotion Plans</h1>
                    <p className="text-sm text-muted-foreground font-body">
                        Manage promotion packages. Changes go live instantly on the website.
                    </p>
                </div>
                <Button onClick={openCreate}>
                    <Plus className="h-4 w-4 mr-2" /> New Plan
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">All plans</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    {loading ? (
                        <p className="text-sm text-muted-foreground">Loading…</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Price (₦)</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Visible</TableHead>
                                    <TableHead>Active</TableHead>
                                    <TableHead>Popular</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {plans.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">
                                            {p.emoji && <span className="mr-1">{p.emoji}</span>}
                                            {p.name}
                                            <div className="text-xs text-muted-foreground">{p.description}</div>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">{p.slug}</TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                min={0}
                                                defaultValue={p.price}
                                                className="w-28"
                                                onBlur={(e) => quickPrice(p, e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {p.duration_label}
                                            <div className="text-muted-foreground">{p.duration_days} day(s)</div>
                                        </TableCell>
                                        <TableCell><Switch checked={p.visible} onCheckedChange={() => toggle(p, "visible")} /></TableCell>
                                        <TableCell><Switch checked={p.active} onCheckedChange={() => toggle(p, "active")} /></TableCell>
                                        <TableCell><Switch checked={p.popular} onCheckedChange={() => toggle(p, "popular")} /></TableCell>
                                        <TableCell className="text-right whitespace-nowrap">
                                            <Button size="sm" variant="ghost" onClick={() => openEdit(p)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost" onClick={() => remove(p)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <History className="h-4 w-4" /> Price change history
                    </CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    {history.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No price changes recorded yet.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Old price</TableHead>
                                    <TableHead>New price</TableHead>
                                    <TableHead>Changed by</TableHead>
                                    <TableHead>When</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {history.map((h) => (
                                    <TableRow key={h.id}>
                                        <TableCell>
                                            <div className="font-medium">{h.plan_name}</div>
                                            <div className="text-xs text-muted-foreground font-mono">{h.plan_slug}</div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {h.old_price == null ? <Badge variant="outline">Initial</Badge> : formatNaira(Number(h.old_price))}
                                        </TableCell>
                                        <TableCell className="font-semibold">{formatNaira(Number(h.new_price))}</TableCell>
                                        <TableCell className="text-xs">{h.changed_by_email ?? "system"}</TableCell>
                                        <TableCell className="text-xs">{new Date(h.changed_at).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Dialog open={creating} onOpenChange={(o) => !o && close()}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editing ? `Edit: ${editing.name}` : "New promotion plan"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>Name *</Label>
                            <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Slug * (URL key)</Label>
                            <Input
                                value={draft.slug}
                                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                                placeholder="e.g. promote-with-link"
                                disabled={!!editing}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Emoji</Label>
                            <Input value={draft.emoji ?? ""} onChange={(e) => setDraft({ ...draft, emoji: e.target.value })} placeholder="🔥" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Price (₦) *</Label>
                            <Input
                                type="number" min={0}
                                value={draft.price}
                                onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Duration label *</Label>
                            <Input
                                value={draft.duration_label}
                                onChange={(e) => setDraft({ ...draft, duration_label: e.target.value })}
                                placeholder="7 Days Promotion"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Duration (days)</Label>
                            <Input
                                type="number" min={1}
                                value={draft.duration_days}
                                onChange={(e) => setDraft({ ...draft, duration_days: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Period label (e.g. /day)</Label>
                            <Input value={draft.period_label ?? ""} onChange={(e) => setDraft({ ...draft, period_label: e.target.value })} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Sort order</Label>
                            <Input
                                type="number"
                                value={draft.sort_order}
                                onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label>Description</Label>
                            <Textarea
                                rows={2}
                                value={draft.description ?? ""}
                                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label>Features (one per line)</Label>
                            <Textarea
                                rows={4}
                                value={featuresText}
                                onChange={(e) => setFeaturesText(e.target.value)}
                                placeholder={"Consistent daily promotion\nBetter reach and engagement"}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch checked={draft.visible} onCheckedChange={(v) => setDraft({ ...draft, visible: v })} />
                            <Label>Visible on website</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch checked={draft.active} onCheckedChange={(v) => setDraft({ ...draft, active: v })} />
                            <Label>Active (can be purchased)</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch checked={draft.popular} onCheckedChange={(v) => setDraft({ ...draft, popular: v })} />
                            <Label>Mark as Most Popular</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={close}>Cancel</Button>
                        <Button onClick={save} disabled={saving}>
                            <Save className="h-4 w-4 mr-2" /> {saving ? "Saving…" : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminPromotionPlans;
