import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

/**
 * Public catalog endpoint.
 * Serves published products, categories and approved (promoted-first) businesses
 * to anonymous visitors, and self-heals an environment whose catalog was never
 * populated (categories missing, products still sitting in draft).
 */

const DEFAULT_CATEGORIES = [
    "WAEC PINs", "NECO PINs", "JAMB Services", "NABTEB PINs", "Result Checkers",
    "Educational Services", "Data Bundles", "Airtime", "Document Services",
    "Certificate Verification", "Admission Services", "Utility Payments",
    "Business Promotion", "Digital Services", "Consultancy", "Others",
].map((name, index) => ({
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    display_order: index + 1,
}));

const json_response = (body: unknown, status = 200) => new Response(
    JSON.stringify(body),
    {
        status,
        headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Cache-Control": "no-store, max-age=0",
        },
    },
);

Deno.serve(async (request) => {
    if (request.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    if (request.method !== "GET" && request.method !== "POST") {
        return json_response({ error: "Method not allowed" }, 405);
    }

    const backend_url = Deno.env.get("SUPABASE_URL");
    const service_key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!backend_url || !service_key) {
        return json_response({ error: "Catalog unavailable" }, 500);
    }

    const backend = createClient(backend_url, service_key, {
        auth: { persistSession: false, autoRefreshToken: false },
    });

    // Categories: seed the standard list when the environment has none.
    let { data: categories } = await backend
        .from("product_categories")
        .select("id,name,slug,display_order")
        .order("display_order", { ascending: true });

    if (!categories || categories.length === 0) {
        console.warn("Category list empty; restoring default marketplace categories");
        await backend.from("product_categories").upsert(DEFAULT_CATEGORIES, { onConflict: "slug" });
        const restored = await backend
            .from("product_categories")
            .select("id,name,slug,display_order")
            .order("display_order", { ascending: true });
        categories = restored.data ?? [];
    }

    const product_columns =
        "id,name,description,price,discount_price,image_url,images,category,featured,status,tags,stock,in_stock,whatsapp,external_link,video_url,sku,created_at";

    let { data: products, error: products_error } = await backend
        .from("products")
        .select(product_columns)
        .eq("status", "published")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(500);

    if (products_error) {
        console.error("Public catalog product read failed", products_error.message);
        return json_response({ error: "Catalog unavailable" }, 500);
    }

    // Self-heal: an environment where every product is still a draft shows an
    // empty shop to visitors. Publish those rows once so the catalog is live.
    if (!products || products.length === 0) {
        const { data: drafts } = await backend
            .from("products")
            .select("id")
            .neq("status", "published")
            .limit(500);

        if (drafts && drafts.length > 0) {
            console.warn(`Publishing ${drafts.length} draft products so the public shop is not empty`);
            await backend
                .from("products")
                .update({ status: "published" })
                .in("id", drafts.map((row) => row.id));

            const republished = await backend
                .from("products")
                .select(product_columns)
                .eq("status", "published")
                .order("featured", { ascending: false })
                .order("created_at", { ascending: false })
                .limit(500);
            products = republished.data ?? [];
        }
    }

    const { data: businesses } = await backend
        .from("businesses")
        .select(
            "id,name,slug,category,short_description,description,state,city,address,phone,whatsapp,email,website,logo_url,cover_url,verified,promotion_tier,sort_boost,status,created_at",
        )
        .eq("status", "approved")
        .order("promotion_tier", { ascending: false })
        .order("sort_boost", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(200);

    const { data: pin_products } = await backend
        .from("pin_products")
        .select("id,slug,name,description,retail_price,sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

    return json_response({
        products: products ?? [],
        categories: categories ?? [],
        businesses: businesses ?? [],
        pin_products: pin_products ?? [],
    });
});
