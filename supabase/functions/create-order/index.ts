import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CreateOrderRequest {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
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

    const orderData: CreateOrderRequest = await req.json();

    // Generate payment reference
    const paymentReference = `CC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log('Creating order with data:', {
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail || '',
      customerPhone: orderData.customerPhone || '',
      totalAmount: orderData.totalAmount,
      paymentMethod: orderData.paymentMethod
    });

    // Insert order into database
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail || '',
        customer_phone: orderData.customerPhone || '',
        order_items: orderData.items,
        total_amount: Math.round(orderData.totalAmount * 100), // Convert to kobo
        payment_method: orderData.paymentMethod,
        payment_reference: paymentReference,
        payment_status: 'pending'
      })
      .select()
      .single();

    console.log('Database insert result:', { order, error });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        success: true,
        order,
        paymentReference,
        message: "Order created successfully"
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