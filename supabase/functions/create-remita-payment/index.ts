import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RemitaPaymentSchema = z.object({
  paymentReference: z.string().min(1, "Payment reference required").max(100, "Reference too long"),
  amount: z.number().positive("Amount must be positive").int("Amount must be integer").max(100000000, "Amount too large"),
  customerName: z.string().trim().min(1, "Name required").max(100, "Name too long"),
  customerEmail: z.string().email("Invalid email").max(255, "Email too long"),
  customerPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  description: z.string().max(500, "Description too long")
});

function getSafeErrorMessage(error: any): string {
  console.error('Detailed error:', error);
  
  if (error.message?.includes('API key')) return 'Payment gateway configuration error';
  if (error.message?.includes('RLS')) return 'Access denied';
  if (error instanceof z.ZodError) return 'Invalid payment data: ' + error.errors[0].message;
  
  return 'Payment initiation failed';
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
    const validationResult = RemitaPaymentSchema.safeParse(requestBody);
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

    const paymentData = validationResult.data;

    // Check if user owns this order
    const { data: orderCheck, error: orderError } = await supabase
      .from("orders")
      .select("user_id")
      .eq("payment_reference", paymentData.paymentReference)
      .single();

    if (orderError) {
      console.error('Order lookup error:', orderError);
      return new Response(
        JSON.stringify({ success: false, error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (orderCheck.user_id !== user.id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Proper Remita API integration
    const merchantId = Deno.env.get("REMITA_MERCHANT_ID") || "2547916";
    const serviceTypeId = Deno.env.get("REMITA_SERVICE_TYPE_ID") || "4430731";
    const apiKey = Deno.env.get("REMITA_API_KEY");
    
    if (!apiKey) {
      throw new Error("Remita API key not configured");
    }

    // Create proper Remita payment URL with correct API endpoint
    const responseUrl = `https://nchfxozhbtusjhhvjgdr.supabase.co/functions/v1/verify-remita-payment`;
    const remitaPaymentUrl = `https://remita.net/remita/exapp/api/v1/send/api/echannelsvc/merchant/api/paymentinit` + 
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
    console.error('=== REMITA PAYMENT CREATION FAILED ===', JSON.stringify({
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