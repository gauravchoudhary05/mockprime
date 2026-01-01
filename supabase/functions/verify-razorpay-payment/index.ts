// supabase/functions/verify-razorpay-payment/index.ts - FIXED!
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

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    
    // 🔥 VERIFY SIGNATURE FIRST
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET');
    const expectedSignature = await generateHmacSignature(body, RAZORPAY_KEY_SECRET!);
    
    if (expectedSignature !== razorpay_signature) throw new Error('Invalid signature');

    // 🔥 SUPABASE AFTER AUTH ✅
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!, 
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) throw new Error('Invalid user');

    console.log('✅ UNLOCKING PREMIUM:', user.id);

    // 🔥 FIXED - NO updated_at column!
    const now = new Date();
    const proUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const { error } = await supabase
      .from('profiles')
      .update({
        is_pro: true,
        is_premium: true,
        plan_name: 'Premium',
        pro_until: proUntil,
      })  // ✅ REMOVED updated_at
      .eq('user_id', user.id);

    if (error) throw error;

    // Update payment status
    await supabase
      .from('payments')
      .update({ status: 'completed', razorpay_payment_id, razorpay_signature })
      .eq('razorpay_order_id', razorpay_order_id);

    console.log('🎉 PREMIUM UNLOCKED until:', proUntil);

    return new Response(
      JSON.stringify({ success: true, proUntil }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('💥 Verify error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function generateHmacSignature(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0')).join('');
}
