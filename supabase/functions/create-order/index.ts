import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateOrderRequest {
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    state?: string;
  };
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  userId?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== CREATE ORDER FUNCTION STARTED ===');
    
    // Get user from auth header for authentication
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify user if token provided
    let userId = null;
    if (token) {
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (!authError && user) {
        userId = user.id;
      }
    }

    const requestBody: CreateOrderRequest = await req.json();
    console.log('Request body received:', requestBody);
    
    const { customer, items, totalAmount } = requestBody;
    
    if (!customer || !customer.fullName) {
      throw new Error('Customer information is missing or invalid');
    }

    console.log('Processing order for:', { 
      customerName: customer.fullName, 
      itemCount: items.length, 
      total: totalAmount,
      userId 
    });

    // Generate payment reference
    const paymentReference = `CC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create main order record
    console.log('Creating order record...');
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: customer.fullName,
        customer_email: customer.email,
        customer_phone: customer.phone,
        payment_reference: paymentReference,
        total_amount: totalAmount,
        payment_status: 'pending',
        order_items: items, // Store as JSONB for now
        user_id: userId // Associate with authenticated user if available
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      throw orderError;
    }

    console.log('Order created successfully:', orderData.id);

    // Create individual order items
    console.log('Creating order items...');
    const orderItems = items.map(item => ({
      order_id: orderData.id,
      name: item.name,
      product_id: null, // We'll link this later if needed
      price: item.price,
      quantity: item.quantity
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items creation error:', itemsError);
      // Don't throw here, as the main order was created successfully
    }

    console.log('Order processing completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        order: orderData,
        paymentReference,
        message: "Order created successfully"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error('=== ORDER CREATION FAILED ===', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unknown error occurred'
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});