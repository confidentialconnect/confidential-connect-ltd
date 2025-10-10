import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CreateOrderSchema = z.object({
  customer: z.object({
    fullName: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
    email: z.string().email("Invalid email").max(255, "Email too long"),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
    address: z.string().max(500).optional(),
    city: z.string().max(100).optional(),
    state: z.string().max(100).optional()
  }),
  items: z.array(z.object({
    id: z.number().positive("Invalid item ID"),
    name: z.string().min(1, "Item name required").max(200, "Item name too long"),
    price: z.number().positive("Price must be positive").int("Price must be integer"),
    quantity: z.number().positive("Quantity must be positive").int("Quantity must be integer").max(1000, "Quantity too large")
  })).min(1, "At least one item required").max(100, "Too many items"),
  totalAmount: z.number().positive("Total must be positive").int("Total must be integer").max(100000000, "Total too large"),
  userId: z.string().uuid().optional()
});

function getSafeErrorMessage(error: any): string {
  console.error('Detailed error:', error);
  
  if (error.code === '23505') return 'Duplicate order detected';
  if (error.code === '23503') return 'Invalid reference in order';
  if (error.message?.includes('RLS')) return 'Access denied';
  if (error instanceof z.ZodError) return 'Invalid order data: ' + error.errors[0].message;
  
  return 'Failed to create order';
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== CREATE ORDER FUNCTION STARTED ===');
    
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
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
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
    console.log('Validating request body...');
    
    // Validate input data
    const validationResult = CreateOrderSchema.safeParse(requestBody);
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid order data: ' + validationResult.error.errors[0].message 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { customer, items, totalAmount, userId: requestUserId } = validationResult.data;
    
    // Ensure user can only create orders for themselves
    if (requestUserId && requestUserId !== user.id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = user.id;

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
    console.error('=== ORDER CREATION FAILED ===', JSON.stringify({
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