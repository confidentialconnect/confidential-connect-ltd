import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyRemitaPaymentRequest {
  paymentReference: string;
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

    const { paymentReference }: VerifyRemitaPaymentRequest = await req.json();

    // Verify payment status with Remita's API
    const merchantId = Deno.env.get("REMITA_MERCHANT_ID") || "2547916";
    const apiKey = Deno.env.get("REMITA_API_KEY");
    
    if (!apiKey) {
      throw new Error("Remita API key not configured");
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
      // For now, if verification fails, mark as pending for manual review
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