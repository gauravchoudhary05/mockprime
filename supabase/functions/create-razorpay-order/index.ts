// supabase/functions/create-razorpay-order/index.ts - HARDCODE ₹99 ON REFERRAL!
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No auth');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!, 
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) throw new Error('Invalid user');

    // 🔥 GET REFERRAL
    const { referral_code } = await req.json();
    console.log('🔥 REFERRAL RECEIVED:', referral_code);

    // 🔥 HARDCODE ₹99 IF ANY REFERRAL!
    const amountToPay = referral_code ? 9900 : 19900;
    console.log('💰 AMOUNT:', amountToPay / 100, referral_code ? 'REFERRAL' : 'FULL');

    const razorpayAuth = btoa(`${Deno.env.get('RAZORPAY_KEY_ID')}:${Deno.env.get('RAZORPAY_KEY_SECRET')}`);
    
    const orderResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${razorpayAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountToPay,
        currency: 'INR',
        receipt: `mp_${user.id}_${Date.now()}`,
        notes: { user_id: user.id, referral: referral_code || null }
      }),
    });

    if (!orderResponse.ok) {
      throw new Error(`Razorpay: ${await orderResponse.text()}`);
    }

    const order = await orderResponse.json();
    
    await supabase.from('payments').insert({
      user_id: user.id,
      amount: amountToPay,
      razorpay_order_id: order.id,
      status: 'created',
      referral_code: referral_code || null,
    });

    console.log('✅ ORDER CREATED:', order.id, '₹' + (amountToPay / 100));

    return new Response(
      JSON.stringify({
        orderId: order.id,
        keyId: Deno.env.get('RAZORPAY_KEY_ID'),
        amount: amountToPay,
        amountToPay: amountToPay,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('💥 ERROR:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
