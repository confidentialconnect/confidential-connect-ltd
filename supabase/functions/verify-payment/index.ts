import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const VerifyPaymentSchema = z.object({
  paymentReference: z.string().min(1, "Payment reference required").max(100, "Reference too long"),
  transactionId: z.string().max(100).optional(),
  paymentStatus: z.enum(['completed', 'failed'], { errorMap: () => ({ message: "Invalid payment status" }) })
});

function getSafeErrorMessage(error: any): string {
  console.error('Detailed error:', error);
  
  if (error.code === '23503') return 'Invalid payment reference';
  if (error.message?.includes('RLS')) return 'Access denied';
  if (error instanceof z.ZodError) return 'Invalid payment data: ' + error.errors[0].message;
  
  return 'Payment verification failed';
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication required
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const requestBody = await req.json();
    
    // Validate input data
    const validationResult = VerifyPaymentSchema.safeParse(requestBody);
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid payment data: ' + validationResult.error.errors[0].message 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { paymentReference, paymentStatus } = validationResult.data;

    // Check if user owns this order or is admin
    const { data: orderCheck, error: orderError } = await supabase
      .from("orders")
      .select("user_id")
      .eq("payment_reference", paymentReference)
      .single();

    if (orderError) {
      console.error('Order lookup error:', orderError);
      return new Response(
        JSON.stringify({ success: false, error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user has admin role
    const { data: adminCheck } = await supabase
      .rpc('has_role', { _user_id: user.id, _role: 'admin' });

    if (orderCheck.user_id !== user.id && !adminCheck) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update order payment status
    const { data: order, error } = await supabase
      .from("orders")
      .update({
        payment_status: paymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq("payment_reference", paymentReference)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        success: true,
        order,
        message: `Payment ${paymentStatus} successfully`
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error('=== PAYMENT VERIFICATION FAILED ===', JSON.stringify({
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack
    }));
    
    return new Response(
      JSON.stringify({
        success: false,
        error: getSafeErrorMessage(error)
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});