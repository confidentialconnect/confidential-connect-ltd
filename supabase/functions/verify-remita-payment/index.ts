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

    // In production, you would verify payment status with Remita's API
    // For demo purposes, we'll simulate payment verification
    
    // Fetch current order
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("payment_reference", paymentReference)
      .single();

    if (fetchError) throw fetchError;

    // For demo purposes, randomly simulate payment success/failure
    // In production, you would check with Remita's actual API
    const isPaymentSuccessful = Math.random() > 0.2; // 80% success rate for demo

    const newStatus = isPaymentSuccessful ? 'completed' : 'failed';

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