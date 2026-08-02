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

const mask_email = (value: string) => {
  const [name, domain] = value.split("@");
  if (!domain) return "***";
  return `${name.slice(0, 2)}***@${domain}`;
};

const log = (stage: string, details: Record<string, unknown> = {}) => {
  console.log(JSON.stringify({ fn: "purchase-pin", stage, at: new Date().toISOString(), ...details }));
};

async function sendReceipt(to: string, name: string, product: string, tokens: {pin:string;serial:string}[], reference: string) {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) {
    log("receipt_skipped_no_api_key", { reference });
    return;
  }
  const rows = tokens.map((t, i) => `
    <div style="background:#f6f6ff;padding:12px 16px;border-radius:8px;margin:8px 0">
      <div style="font-size:12px;color:#666;margin-bottom:4px">Token ${i + 1}</div>
      <p style="margin:2px 0"><b>PIN:</b> <code style="font-size:16px">${t.pin}</code></p>
      <p style="margin:2px 0"><b>Serial:</b> <code style="font-size:16px">${t.serial}</code></p>
    </div>`).join("");
  try {
    const res = await fetch("https://api.resend.com/emails", {
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
            <p>Thank you for your purchase. Here ${tokens.length > 1 ? `are your ${tokens.length} <b>${product}</b> tokens` : `is your <b>${product}</b>`}:</p>
            ${rows}
            <p style="margin:12px 0 4px"><b>Reference:</b> ${reference}</p>
            <p>Keep this email safe. If you have any issue, reply or WhatsApp us at +234 704 029 4858.</p>
            <p style="color:#888;font-size:12px">CONFIDENTIAL CONNECT LTD (RC 9081270) — In partnership with All Campus Connect TV.</p>
          </div>`,
      }),
    });
    const body = await res.text().catch(() => "");
    log("receipt_sent", {
      reference,
      to: mask_email(to),
      http_status: res.status,
      ok: res.ok,
      response: body.slice(0, 300),
    });
  } catch (e) {
    log("receipt_error", { reference, message: e instanceof Error ? e.message : String(e) });
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const started_at = Date.now();
  const elapsed = () => Date.now() - started_at;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      log("auth_missing");
      return json({ success: false, error: "Auth required" }, 401);
    }
    const { data: userData, error: authErr } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authErr || !userData?.user) {
      log("auth_invalid", { message: authErr?.message });
      return json({ success: false, error: "Invalid auth" }, 401);
    }
    const user = userData.user;

    const raw = await req.json();
    const parsed = Body.safeParse(raw);
    if (!parsed.success) {
      log("validation_failed", { user_id: user.id, issues: parsed.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`) });
      return json({ success: false, error: parsed.error.errors[0].message }, 400);
    }
    const { reference, product_slug, quantity, customer_name, customer_email } = parsed.data;
    log("request_received", {
      user_id: user.id,
      reference,
      product_slug,
      quantity,
      customer_email: mask_email(customer_email),
    });

    // Load product
    const { data: product, error: prodErr } = await supabase
      .from("pin_products")
      .select("*")
      .eq("slug", product_slug)
      .eq("is_active", true)
      .maybeSingle();
    if (prodErr || !product) {
      log("product_not_found", { reference, product_slug, message: prodErr?.message });
      return json({ success: false, error: "Product not found" }, 404);
    }

    const expectedAmount = Number(product.retail_price) * quantity;

    // Verify Paystack
    const paystackKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackKey) {
      log("paystack_key_missing", { reference });
      return json({ success: false, error: "Payment not configured" }, 500);
    }
    log("paystack_verify_start", { reference, expected_amount: expectedAmount, elapsed_ms: elapsed() });
    const vRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${paystackKey}` },
    });
    const vJson = await vRes.json();
    log("paystack_verify_response", {
      reference,
      http_status: vRes.status,
      paystack_status: vJson?.status,
      transaction_status: vJson?.data?.status,
      gateway_response: vJson?.data?.gateway_response,
      channel: vJson?.data?.channel,
      amount_kobo: vJson?.data?.amount,
      paid_at: vJson?.data?.paid_at,
      message: vJson?.message,
      elapsed_ms: elapsed(),
    });
    if (!vJson?.status || vJson?.data?.status !== "success") {
      log("payment_not_verified", { reference, transaction_status: vJson?.data?.status, elapsed_ms: elapsed() });
      return json({ success: false, error: "Payment not verified" }, 400);
    }
    const paidAmount = Number(vJson.data.amount) / 100;
    if (paidAmount + 0.01 < expectedAmount) {
      log("amount_mismatch", { reference, paid_amount: paidAmount, expected_amount: expectedAmount });
      return json({ success: false, error: "Amount mismatch" }, 400);
    }

    // Idempotency
    const { data: existing } = await supabase
      .from("pin_orders")
      .select("id,pin,serial,status")
      .eq("paystack_reference", reference)
      .maybeSingle();
    if (existing?.status === "delivered" && existing.pin) {
      log("idempotent_replay", { reference, order_id: existing.id, elapsed_ms: elapsed() });
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
      if (insErr) {
        log("order_insert_failed", { reference, message: insErr.message, code: insErr.code, details: insErr.details });
        return json({ success: false, error: "Order save failed" }, 500);
      }
      orderId = inserted.id;
    }
    log("order_ready", { reference, order_id: orderId, status: "paid", total_amount: expectedAmount, elapsed_ms: elapsed() });

    // Call NaijaResultPins
    const npToken = Deno.env.get("NAIJARESULTPINS_API_TOKEN");
    if (!npToken) {
      log("provider_token_missing", { reference, order_id: orderId });
      await supabase.from("pin_orders").update({ status: "failed", error_message: "Provider not configured" }).eq("id", orderId);
      return json({ success: false, error: "Provider not configured" }, 500);
    }
    log("provider_request_start", {
      reference,
      order_id: orderId,
      card_type_id: product.provider_card_type_id,
      quantity,
      elapsed_ms: elapsed(),
    });
    const provider_started_at = Date.now();
    const pRes = await fetch("https://www.naijaresultpins.com/api/v1/exam-card/buy", {
      method: "POST",
      headers: { Authorization: `Bearer ${npToken}`, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ card_type_id: product.provider_card_type_id, quantity }),
    });
    const pJson = await pRes.json().catch(() => ({}));
    log("provider_response", {
      reference,
      order_id: orderId,
      http_status: pRes.status,
      ok: pRes.ok,
      provider_ms: Date.now() - provider_started_at,
      message: (pJson as any)?.message ?? (pJson as any)?.error,
      payload_keys: Object.keys((pJson as any) ?? {}),
      elapsed_ms: elapsed(),
    });

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
    log("tokens_parsed", { reference, order_id: orderId, token_count: tokens.length, has_serial: Boolean(serial) });

    if (!pRes.ok || tokens.length === 0) {
      const errMsg = pJson?.message || pJson?.error || `Provider error (${pRes.status})`;
      log("delivery_failed", {
        reference,
        order_id: orderId,
        http_status: pRes.status,
        error: String(errMsg).slice(0, 300),
        raw_response: JSON.stringify(pJson).slice(0, 800),
        elapsed_ms: elapsed(),
      });
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
    log("delivered", {
      reference,
      order_id: orderId,
      product_slug: product.slug,
      token_count: tokens.length,
      elapsed_ms: elapsed(),
    });

    await sendReceipt(customer_email, customer_name, product.name, tokens, reference);

    return json({ success: true, pin, serial, tokens, reference, product: product.name });
  } catch (err) {
    console.error(JSON.stringify({
      fn: "purchase-pin",
      stage: "unexpected_error",
      at: new Date().toISOString(),
      elapsed_ms: elapsed(),
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    }));
    return json({ success: false, error: "Unexpected error" }, 500);
  }

  function json(b: unknown, status = 200) {
    return new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});