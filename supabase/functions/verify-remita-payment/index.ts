import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-remita-signature, x-remita-timestamp",
};

interface VerifyRemitaPaymentRequest {
  paymentReference: string;
}

// Store processed webhook IDs to prevent replay attacks (in-memory for simplicity)
const processedWebhooks = new Set<string>();

// Convert string to Uint8Array
function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Convert ArrayBuffer to hex string
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Verify HMAC signature with timestamp validation using Web Crypto API
async function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  timestamp: string | null,
  secret: string
): Promise<{ valid: boolean; reason?: string }> {
  if (!signature || !timestamp) {
    return { valid: false, reason: "Missing signature or timestamp" };
  }

  // Check timestamp is recent (within 5 minutes)
  const requestTime = parseInt(timestamp);
  const currentTime = Math.floor(Date.now() / 1000);
  
  if (isNaN(requestTime)) {
    return { valid: false, reason: "Invalid timestamp format" };
  }
  
  if (Math.abs(currentTime - requestTime) > 300) {
    return { valid: false, reason: "Request timestamp too old or in future" };
  }

  // Create HMAC key using Web Crypto API
  const key = await crypto.subtle.importKey(
    "raw",
    stringToUint8Array(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  // Sign the message
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    stringToUint8Array(timestamp + payload)
  );

  const expectedSignature = bufferToHex(signatureBuffer);

  // Use timing-safe comparison
  if (signature.length !== expectedSignature.length) {
    return { valid: false, reason: "Signature mismatch" };
  }
  
  let mismatch = 0;
  for (let i = 0; i < signature.length; i++) {
    mismatch |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
  }
  
  if (mismatch !== 0) {
    return { valid: false, reason: "Signature mismatch" };
  }

  return { valid: true };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Read body as text first for signature verification
    const bodyText = await req.text();
    
    // Get signature headers
    const signature = req.headers.get("X-Remita-Signature");
    const timestamp = req.headers.get("X-Remita-Timestamp");
    const webhookSecret = Deno.env.get("REMITA_WEBHOOK_SECRET");
    
    // Fallback to simple token if HMAC secret not configured (for backwards compatibility)
    if (!webhookSecret) {
      console.warn("REMITA_WEBHOOK_SECRET not configured, falling back to simple token verification");
      const webhookToken = req.headers.get("X-Webhook-Token");
      const expectedToken = Deno.env.get("REMITA_WEBHOOK_TOKEN");
      
      if (!webhookToken || webhookToken !== expectedToken) {
        console.error("Unauthorized webhook attempt - token mismatch");
        return new Response(
          JSON.stringify({ success: false, error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      // Use HMAC verification when secret is configured
      const verification = await verifyWebhookSignature(bodyText, signature, timestamp, webhookSecret);
      
      if (!verification.valid) {
        console.error(`Webhook signature verification failed: ${verification.reason}`);
        return new Response(
          JSON.stringify({ success: false, error: "Invalid signature" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Parse the body
    const requestData: VerifyRemitaPaymentRequest = JSON.parse(bodyText);
    const { paymentReference } = requestData;
    
    // Generate unique webhook ID for replay protection
    const webhookId = `${timestamp || Date.now()}-${paymentReference}`;
    
    // Check for replay attack
    if (processedWebhooks.has(webhookId)) {
      console.warn(`Potential replay attack detected for webhook: ${webhookId}`);
      return new Response(
        JSON.stringify({ success: true, message: "Already processed" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Add to processed set (limit size to prevent memory issues)
    if (processedWebhooks.size > 10000) {
      const firstItem = processedWebhooks.values().next().value;
      if (firstItem) processedWebhooks.delete(firstItem);
    }
    processedWebhooks.add(webhookId);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify payment status with Remita's API
    const merchantId = Deno.env.get("REMITA_MERCHANT_ID") || "2547916";
    const apiKey = Deno.env.get("REMITA_API_KEY");
    
    if (!apiKey) {
      throw new Error("Remita API key not configured");
    }

    // Check if payment was already processed (idempotency)
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('payment_status')
      .eq('payment_reference', paymentReference)
      .single();

    if (existingOrder?.payment_status === 'completed') {
      return new Response(
        JSON.stringify({ success: true, message: 'Payment already processed' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch current order
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("payment_reference", paymentReference)
      .single();

    if (fetchError) throw fetchError;

    // Check payment status with Remita's transaction status API
    let newStatus = 'pending';
    
    try {
      const verifyUrl = `https://remita.net/remita/exapp/api/v1/send/api/rpgsvc/rpgservice/status.json`;
      const response = await fetch(`${verifyUrl}?merchantId=${merchantId}&orderId=${paymentReference}&apiKey=${apiKey}`);
      
      if (!response.ok) {
        throw new Error(`Remita API error: ${response.status}`);
      }
      
      const remitaResponse = await response.json();
      
      // Check if payment was successful based on Remita's response
      const isPaymentSuccessful = remitaResponse.status === "01" || remitaResponse.status === "00";
      newStatus = isPaymentSuccessful ? 'completed' : 'failed';
      
      console.log(`Remita verification result for ${paymentReference}:`, remitaResponse);
      
    } catch (verifyError) {
      console.error('Remita verification error:', verifyError);
      newStatus = 'pending';
    }

    // Update order payment status
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq("payment_reference", paymentReference);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({
        success: true,
        status: newStatus,
        message: `Payment ${newStatus}`,
        order: { ...order, payment_status: newStatus }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
