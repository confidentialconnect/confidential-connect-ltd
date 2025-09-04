import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RemitaPaymentRequest {
  paymentReference: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  description: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const paymentData: RemitaPaymentRequest = await req.json();

    // Proper Remita API integration
    const merchantId = Deno.env.get("REMITA_MERCHANT_ID") || "2547916";
    const serviceTypeId = Deno.env.get("REMITA_SERVICE_TYPE_ID") || "4430731";
    const apiKey = Deno.env.get("REMITA_API_KEY");
    
    if (!apiKey) {
      throw new Error("Remita API key not configured");
    }

    // Create proper Remita payment URL with all required parameters
    const responseUrl = `https://nchfxozhbtusjhhvjgdr.supabase.co/functions/v1/verify-remita-payment`;
    const remitaPaymentUrl = `https://www.remita.net/remita/exapp/api/v1/send/api/echannelsvc/merchant/api/paymentinit` + 
      `?merchantId=${merchantId}&serviceTypeId=${serviceTypeId}&` +
      `amount=${paymentData.amount}&orderId=${paymentData.paymentReference}&` +
      `payerName=${encodeURIComponent(paymentData.customerName)}&` +
      `payerEmail=${encodeURIComponent(paymentData.customerEmail)}&` +
      `payerPhone=${encodeURIComponent(paymentData.customerPhone)}&` +
      `description=${encodeURIComponent(paymentData.description)}&` +
      `responseurl=${encodeURIComponent(responseUrl)}`;

    // Update order with Remita payment initiation
    const { error } = await supabase
      .from("orders")
      .update({
        payment_method: 'remita',
        payment_status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq("payment_reference", paymentData.paymentReference);

    if (error) throw error;

    return new Response(
      JSON.stringify({
        success: true,
        paymentUrl: remitaPaymentUrl,
        message: "Remita payment initiated successfully"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
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