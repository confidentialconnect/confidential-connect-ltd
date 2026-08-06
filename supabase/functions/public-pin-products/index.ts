import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const PIN_PRODUCTS = [
    { id: "067fb7e5-634d-48ca-a577-6a1385fed322", slug: "waec-result-checker", name: "WAEC Result Checker PIN", description: "Check your WAEC result online instantly.", provider_card_type_id: 1, cost_price: 5140, retail_price: 5700, is_active: true, sort_order: 1 },
    { id: "4a5df91e-c3f6-4306-8bf9-a1d020b49928", slug: "neco-token", name: "NECO Result Token", description: "Check your NECO result online instantly.", provider_card_type_id: 2, cost_price: 2025, retail_price: 2250, is_active: true, sort_order: 2 },
    { id: "b9fe317a-4b12-4bc9-b065-9a38d3635b23", slug: "nabteb-result-checker", name: "NABTEB Result Checker PIN", description: "Check your NABTEB result online instantly.", provider_card_type_id: 3, cost_price: 855, retail_price: 950, is_active: true, sort_order: 3 },
    { id: "ae3b43f3-23bf-4320-80af-a7ebf7e9d386", slug: "waec-verification", name: "WAEC Verification PIN", description: "Verify a WAEC certificate online.", provider_card_type_id: 4, cost_price: 5310, retail_price: 5900, is_active: true, sort_order: 4 },
    { id: "698effa7-0815-4ec1-8ff0-4e369570374f", slug: "nbais-result-checker", name: "NBAIS Result Checker PIN", description: "Check your NBAIS result online instantly.", provider_card_type_id: 5, cost_price: 1260, retail_price: 1400, is_active: true, sort_order: 5 },
    { id: "2d0600a9-63f1-4da5-8c21-e176055783c3", slug: "neco-everification-student", name: "NECO e-Verification (Student)", description: "NECO electronic result verification for students.", provider_card_type_id: 6, cost_price: 5805, retail_price: 6450, is_active: true, sort_order: 6 },
];

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

    const { data: existing, error: read_error } = await backend
        .from("pin_products")
        .select("id,slug,name,description,retail_price,sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

    if (read_error) {
        console.error("Public PIN catalog read failed", read_error.message);
        return json_response({ error: "Catalog unavailable" }, 500);
    }

    if (existing && existing.length > 0) {
        return json_response({ products: existing });
    }

    console.warn("Active PIN catalog was empty; restoring approved products");
    const { error: seed_error } = await backend
        .from("pin_products")
        .upsert(PIN_PRODUCTS, { onConflict: "slug" });

    if (seed_error) {
        console.error("Public PIN catalog restore failed", seed_error.message);
        return json_response({ error: "Catalog unavailable" }, 500);
    }

    return json_response({
        products: PIN_PRODUCTS.map(({ id, slug, name, description, retail_price, sort_order }) => ({
            id,
            slug,
            name,
            description,
            retail_price,
            sort_order,
        })),
    });
});