import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Razorpay Order Creation Edge Function
 * 
 * Premium Plan: ₹199/month
 * This function:
 * 1. Gets user's current plan status
 * 2. Calculates pro-rata amount if user has remaining time on current plan
 * 3. Creates a Razorpay order for the calculated amount
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID');
const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Premium plan price in paise (₹199 = 19900 paise)
const PREMIUM_PRICE_PAISE = 19900;
// Billing period in days (monthly)
const BILLING_PERIOD_DAYS = 30;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    // Get user from JWT
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error('User auth error:', userError);
      throw new Error('Invalid user token');
    }

    console.log('Creating order for user:', user.id);

    // Get user profile with current plan info
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_pro, plan_name, pro_until, email, full_name')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      // Profile might not exist yet, create default values
    }

    const currentPlan = profile?.plan_name || 'Free';
    const proUntil = profile?.pro_until ? new Date(profile.pro_until) : null;
    const now = new Date();

    // Calculate pro-rata amount
    let amountToPay = PREMIUM_PRICE_PAISE;
    let proRata = false;

    // If user is already pro and has remaining time, calculate pro-rata
    if (profile?.is_pro && proUntil && proUntil > now) {
      const remainingDays = Math.ceil((proUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const dailyRate = PREMIUM_PRICE_PAISE / BILLING_PERIOD_DAYS;
      const creditAmount = Math.floor(remainingDays * dailyRate);
      amountToPay = Math.max(PREMIUM_PRICE_PAISE - creditAmount, 100); // Minimum ₹1
      proRata = true;
      console.log(`Pro-rata calculation: ${remainingDays} days remaining, credit: ${creditAmount} paise`);
    }

    console.log('Amount to pay:', amountToPay, 'paise');

    // Create Razorpay order
    const razorpayAuth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
    
    const orderResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${razorpayAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountToPay,
        currency: 'INR',
        receipt: `premium_${user.id.substring(0, 8)}_${Date.now()}`,
        notes: {
          user_id: user.id,
          plan: 'Premium',
          pro_rata: proRata.toString(),
        },
      }),
    });

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error('Razorpay order creation failed:', errorText);
      throw new Error('Failed to create Razorpay order');
    }

    const order = await orderResponse.json();
    console.log('Razorpay order created:', order.id);

    // Store order in database
    await supabase.from('payments').insert({
      user_id: user.id,
      amount: amountToPay,
      currency: 'INR',
      old_plan: currentPlan,
      new_plan: 'Premium',
      pro_rata: proRata,
      razorpay_order_id: order.id,
      status: 'created',
    });

    return new Response(
      JSON.stringify({
        orderId: order.id,
        keyId: RAZORPAY_KEY_ID,
        amountToPay: amountToPay,
        amountDisplay: (amountToPay / 100).toFixed(2),
        currentPlan,
        newPlan: 'Premium (₹199/month)',
        proRata,
        proUntil: proUntil?.toISOString(),
        userEmail: profile?.email || user.email,
        userName: profile?.full_name || user.user_metadata?.full_name || '',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error in create-razorpay-order:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
