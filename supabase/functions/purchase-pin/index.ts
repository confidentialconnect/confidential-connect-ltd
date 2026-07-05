import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const Body = z.object({
  reference: z.string().min(6).max(100),
  product_slug: z.string().min(1).max(80),
  quantity: z.number().int().min(1).max(10).default(1),
  customer_name: z.string().trim().min(1).max(100),
  customer_email: z.string().email().max(255),
});

async function sendReceipt(to: string, name: string, product: string, pin: string, serial: string, reference: string) {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Confidential Connect <onboarding@resend.dev>",
        to: [to],
        subject: `Your ${product} — Confidential Connect Ltd`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px">
            <h2 style="color:#4f39e6;margin:0 0 12px">Confidential Connect Ltd</h2>
            <p>Hi ${name},</p>
            <p>Thank you for your purchase. Here are your <b>${product}</b> details:</p>
            <div style="background:#f6f6ff;padding:16px;border-radius:8px;margin:16px 0">
              <p style="margin:4px 0"><b>PIN:</b> <code style="font-size:16px">${pin}</code></p>
              <p style="margin:4px 0"><b>Serial:</b> <code style="font-size:16px">${serial}</code></p>
              <p style="margin:4px 0"><b>Reference:</b> ${reference}</p>
            </div>
            <p>Keep this email safe. If you have any issue, reply or WhatsApp us at +234 704 029 4858.</p>
            <p style="color:#888;font-size:12px">CONFIDENTIAL CONNECT LTD (RC 9081270) — In partnership with All Campus Connect TV.</p>
          </div>`,
      }),
    });
  } catch (e) {
    console.error("Resend error", e);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ success: false, error: "Auth required" }, 401);
    const { data: userData, error: authErr } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authErr || !userData?.user) return json({ success: false, error: "Invalid auth" }, 401);
    const user = userData.user;

    const raw = await req.json();
    const parsed = Body.safeParse(raw);
    if (!parsed.success) return json({ success: false, error: parsed.error.errors[0].message }, 400);
    const { reference, product_slug, quantity, customer_name, customer_email } = parsed.data;

    // Load product
    const { data: product, error: prodErr } = await supabase
      .from("pin_products")
      .select("*")
      .eq("slug", product_slug)
      .eq("is_active", true)
      .maybeSingle();
    if (prodErr || !product) return json({ success: false, error: "Product not found" }, 404);

    const expectedAmount = Number(product.retail_price) * quantity;

    // Verify Paystack
    const paystackKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackKey) return json({ success: false, error: "Payment not configured" }, 500);
    const vRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${paystackKey}` },
    });
    const vJson = await vRes.json();
    if (!vJson?.status || vJson?.data?.status !== "success") {
      return json({ success: false, error: "Payment not verified" }, 400);
    }
    const paidAmount = Number(vJson.data.amount) / 100;
    if (paidAmount + 0.01 < expectedAmount) {
      return json({ success: false, error: "Amount mismatch" }, 400);
    }

    // Idempotency
    const { data: existing } = await supabase
      .from("pin_orders")
      .select("id,pin,serial,status")
      .eq("paystack_reference", reference)
      .maybeSingle();
    if (existing?.status === "delivered" && existing.pin) {
      return json({ success: true, pin: existing.pin, serial: existing.serial, reference });
    }

    // Create/upsert order
    const orderInsert = {
      user_id: user.id,
      product_slug: product.slug,
      product_name: product.name,
      quantity,
      unit_price: product.retail_price,
      total_amount: expectedAmount,
      customer_name,
      customer_email,
      paystack_reference: reference,
      status: "paid",
    };
    let orderId = existing?.id;
    if (!orderId) {
      const { data: inserted, error: insErr } = await supabase
        .from("pin_orders").insert(orderInsert).select("id").single();
      if (insErr) return json({ success: false, error: "Order save failed" }, 500);
      orderId = inserted.id;
    }

    // Call NaijaResultPins
    const npToken = Deno.env.get("NAIJARESULTPINS_API_TOKEN");
    if (!npToken) {
      await supabase.from("pin_orders").update({ status: "failed", error_message: "Provider not configured" }).eq("id", orderId);
      return json({ success: false, error: "Provider not configured" }, 500);
    }
    const pRes = await fetch("https://www.naijaresultpins.com/api/v1/exam-card/buy", {
      method: "POST",
      headers: { Authorization: `Bearer ${npToken}`, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ card_type_id: product.provider_card_type_id, quantity }),
    });
    const pJson = await pRes.json().catch(() => ({}));
    console.log("NaijaResultPins response", pRes.status, JSON.stringify(pJson));

    // Extract pin/serial pairs — API may return one or many
    const container = pJson?.data ?? pJson?.cards ?? pJson?.card ?? pJson?.pins ?? pJson;
    const rawList = Array.isArray(container) ? container : (container ? [container] : []);
    const tokens = rawList
      .map((it: any) => ({
        pin: it?.pin || it?.PIN || it?.pin_code || it?.code || it?.token || "",
        serial: it?.serial || it?.serial_no || it?.serial_number || it?.card_serial || "",
      }))
      .filter((t) => t.pin);
    const pin = tokens[0]?.pin || "";
    const serial = tokens[0]?.serial || "";

    if (!pRes.ok || tokens.length === 0) {
      const errMsg = pJson?.message || pJson?.error || `Provider error (${pRes.status})`;
      await supabase.from("pin_orders").update({
        status: "failed",
        provider_response: pJson,
        error_message: String(errMsg).slice(0, 500),
      }).eq("id", orderId);
      return json({ success: false, error: "Delivery failed — our team has been alerted. You will be contacted shortly.", details: errMsg }, 502);
    }

    await supabase.from("pin_orders").update({
      status: "delivered",
      pin,
      serial,
      provider_response: pJson,
      delivered_at: new Date().toISOString(),
    }).eq("id", orderId);

    await sendReceipt(customer_email, customer_name, product.name, tokens, reference);

    return json({ success: true, pin, serial, tokens, reference, product: product.name });
  } catch (err) {
    console.error("purchase-pin error", err);
    return json({ success: false, error: "Unexpected error" }, 500);
  }

  function json(b: unknown, status = 200) {
    return new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});