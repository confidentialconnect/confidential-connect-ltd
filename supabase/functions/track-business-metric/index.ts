import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3.23.8";

const BodySchema = z.object({
    business_id: z.string().uuid(),
    metric: z.enum(["views", "whatsapp_clicks", "link_clicks"]),
});

const json_response = (body: unknown, status = 200) => new Response(
    JSON.stringify(body),
    { status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
);

Deno.serve(async (request) => {
    if (request.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    if (request.method !== "POST") {
        return json_response({ error: "Method not allowed" }, 405);
    }

    try {
        const body = BodySchema.safeParse(await request.json());
        if (!body.success) {
            return json_response({ error: body.error.flatten().fieldErrors }, 400);
        }

        const backend_url = Deno.env.get("SUPABASE_URL");
        const service_key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
        if (!backend_url || !service_key) {
            return json_response({ error: "Backend unavailable" }, 500);
        }

        const backend = createClient(backend_url, service_key, {
            auth: { persistSession: false, autoRefreshToken: false },
        });
        const { error } = await backend.rpc("increment_business_metric", {
            _business_id: body.data.business_id,
            _metric: body.data.metric,
        });

        if (error) {
            console.error("Metric update failed", error.message);
            return json_response({ error: "Metric update failed" }, 500);
        }

        return json_response({ success: true });
    } catch (error) {
        console.error("Metric request failed", error);
        return json_response({ error: "Invalid request" }, 400);
    }
});