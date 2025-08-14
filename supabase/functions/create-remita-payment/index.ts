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

    // For demo purposes, we'll create a mock Remita payment URL
    // In production, you would integrate with Remita's actual API
    const remitaPaymentUrl = `https://remitademo.net/payment/web/index.php?` + 
      `merchantId=DEMO&serviceTypeId=4430731&hash=test&` +
      `amount=${paymentData.amount}&orderId=${paymentData.paymentReference}&` +
      `responseurl=${encodeURIComponent('https://your-app.com/payment-callback')}`;

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