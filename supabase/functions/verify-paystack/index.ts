import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const log = (stage: string, details: Record<string, unknown> = {}) => {
  console.log(JSON.stringify({ fn: "verify-paystack", stage, at: new Date().toISOString(), ...details }));
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const started_at = Date.now();
  try {
    // Require authenticated caller
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      log("auth_missing");
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    const user = userData?.user;
    if (!user) {
      log("auth_invalid");
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { reference } = await req.json();
    log("request_received", { user_id: user.id, reference });

    if (!reference) {
      log("reference_missing", { user_id: user.id });
      return new Response(
        JSON.stringify({ success: false, error: 'Payment reference is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const secretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!secretKey) {
      log("paystack_key_missing", { reference });
      throw new Error('Paystack secret key not configured');
    }

    // Verify the caller owns the order tied to this reference
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { data: ownedOrder } = await supabase
      .from('orders')
      .select('id, total_amount')
      .eq('payment_reference', reference)
      .eq('user_id', user.id)
      .maybeSingle();

    if (!ownedOrder) {
      log("order_not_owned", { user_id: user.id, reference });
      return new Response(
        JSON.stringify({ success: false, error: 'Forbidden' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify transaction with Paystack API
    log("paystack_verify_start", { reference, order_id: ownedOrder.id, expected_amount: ownedOrder.total_amount });
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    log("paystack_verify_response", {
      reference,
      http_status: response.status,
      paystack_status: data?.status,
      transaction_status: data?.data?.status,
      gateway_response: data?.data?.gateway_response,
      channel: data?.data?.channel,
      amount_kobo: data?.data?.amount,
      paid_at: data?.data?.paid_at,
      message: data?.message,
      elapsed_ms: Date.now() - started_at,
    });

    if (data.status && data.data.status === 'success') {
      // Ensure the amount Paystack actually collected matches the order total
      const expectedKobo = Math.round(Number(ownedOrder.total_amount) * 100);
      const paidKobo = Number(data.data.amount ?? 0);
      if (paidKobo < expectedKobo) {
        console.error('Amount mismatch', { reference, expectedKobo, paidKobo });
        await supabase
          .from('orders')
          .update({ payment_status: 'failed' })
          .eq('payment_reference', reference)
          .eq('user_id', user.id);
        return new Response(
          JSON.stringify({ success: false, status: 'failed', message: 'Payment amount mismatch' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      await supabase
        .from('orders')
        .update({ payment_status: 'completed', payment_reference: reference })
        .eq('payment_reference', reference)
        .eq('user_id', user.id);

      log("order_marked_completed", {
        reference,
        order_id: ownedOrder.id,
        paid_kobo: paidKobo,
        elapsed_ms: Date.now() - started_at,
      });

      return new Response(
        JSON.stringify({
          success: true,
          status: 'completed',
          amount: data.data.amount,
          reference: data.data.reference,
          channel: data.data.channel,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      log("payment_not_successful", {
        reference,
        transaction_status: data?.data?.status,
        gateway_response: data?.data?.gateway_response,
        message: data?.message,
        elapsed_ms: Date.now() - started_at,
      });
      return new Response(
        JSON.stringify({
          success: false,
          status: data.data?.status || 'failed',
          message: data.message || 'Payment verification failed',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error(JSON.stringify({
      fn: "verify-paystack",
      stage: "unexpected_error",
      at: new Date().toISOString(),
      elapsed_ms: Date.now() - started_at,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }));
    return new Response(
      JSON.stringify({ success: false, error: 'Payment verification failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
