import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PromotionPlan {
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

export const formatNaira = (n: number) =>
    `₦${Math.round(n).toLocaleString("en-NG")}`;

const normalize = (row: any): PromotionPlan => ({
    ...row,
    price: Number(row.price),
    features: Array.isArray(row.features) ? row.features : [],
});

/**
 * Fetch all PUBLIC (active + visible) promotion plans with realtime updates.
 * Used by client-facing pages so price changes propagate live.
 */
export const usePromotionPlans = () => {
    const [plans, setPlans] = useState<PromotionPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;

        const load = async () => {
            const { data, error } = await supabase
                .from("promotion_plans")
                .select("*")
                .eq("active", true)
                .eq("visible", true)
                .order("sort_order", { ascending: true });
            if (!alive) return;
            if (error) setError(error.message);
            else setPlans((data ?? []).map(normalize));
            setLoading(false);
        };
        load();

        const channel = supabase
            .channel("promotion_plans_public")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "promotion_plans" },
                () => load(),
            )
            .subscribe();

        return () => {
            alive = false;
            supabase.removeChannel(channel);
        };
    }, []);

    return { plans, loading, error };
};

/**
 * Fetch a single plan by slug (must be active + visible for public use).
 */
export const usePromotionPlanBySlug = (slug: string | undefined) => {
    const [plan, setPlan] = useState<PromotionPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!slug) {
            setNotFound(true);
            setLoading(false);
            return;
        }
        let alive = true;

        const load = async () => {
            const { data, error } = await supabase
                .from("promotion_plans")
                .select("*")
                .eq("slug", slug)
                .eq("active", true)
                .eq("visible", true)
                .maybeSingle();
            if (!alive) return;
            if (error || !data) {
                setNotFound(true);
                setPlan(null);
            } else {
                setPlan(normalize(data));
                setNotFound(false);
            }
            setLoading(false);
        };
        load();

        const channel = supabase
            .channel(`promotion_plan_${slug}`)
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "promotion_plans", filter: `slug=eq.${slug}` },
                () => load(),
            )
            .subscribe();

        return () => {
            alive = false;
            supabase.removeChannel(channel);
        };
    }, [slug]);

    return { plan, loading, notFound };
};
