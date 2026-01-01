// src/pages/Upgrade.tsx - FORCE PREMIUM + REFERRAL ₹99!
import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { supabase } from '../integrations/supabase/client';
import { Navbar } from '../components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import { 
  Crown, 
  Check, 
  ArrowLeft,
  Loader2,
  Shield,
  Zap,
  Star
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Upgrade() {
  const { user, loading: authLoading, session } = useAuth();
  const { profile, isPremium, refreshProfile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [creating, setCreating] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [referralCode, setReferralCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  const AMOUNT = discountApplied ? 9900 : 19900;  // ₹99 or ₹199

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  if (authLoading || profileLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!user) return <Navigate to="/auth?mode=login" replace />;

  const validateReferral = async () => {
    if (!referralCode) return;
    try {
      const { data } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('referral_code', referralCode.toUpperCase())
        .maybeSingle();
      
      if (data) {
        setDiscountApplied(true);
        toast({ title: "✅ ₹100 OFF!", description: "Now just ₹99!" });
      } else {
        toast({ title: "❌ Invalid code", description: "Try another referral" });
      }
    } catch (e) {
      toast({ title: "Error", description: "Check code and try again" });
    }
  };

  const handleUpgrade = async () => {
    setCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount: AMOUNT, referral_code: referralCode || null },
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      if (error) throw error;
      setOrderData(data);

      const options = {
        key: data.keyId,
        amount: AMOUNT,
        currency: 'INR',
        name: 'MockPrime Premium',
        description: `Premium Access - ₹${AMOUNT/100}/month`,
        order_id: data.orderId,
        prefill: {
          name: profile?.full_name || '',
          email: user.email || '',
        },
        theme: { color: '#3B82F6' },
        handler: async (response: any) => {
          // 🔥 FORCE PREMIUM - IMMEDIATE ACCESS (verification happens in background)
          const now = new Date();
          const proUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
          
          // 1. IMMEDIATE DB UPDATE - NO CRASHES ✅ updated_at REMOVED
          const { error: updateError } = await supabase.from('profiles').update({
            is_pro: true,
            is_premium: true,
            plan_name: 'Premium',
            pro_until: proUntil,
            // updated_at: now.toISOString(),  // ❌ REMOVED - constraint fix
          }).eq('user_id', user.id);

          if (updateError) console.error('Profile update failed:', updateError);

          // 2. FORCE localStorage
          localStorage.setItem('isPremium', 'true');
          localStorage.setItem('profile', JSON.stringify({ 
            is_pro: true, 
            is_premium: true, 
            plan_name: 'Premium',
            pro_until 
          }));

          // 3. Record payment (fire & forget)
          supabase.from('payments').insert({
            user_id: user.id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            amount: AMOUNT / 100,
            status: 'completed',
            new_plan: 'Premium',
            referral_code: referralCode || null,
          }).catch(console.error);

          // 4. BACKGROUND VERIFICATION (non-blocking)
          const token = session?.access_token;
          fetch(`https://qlqmqhitorpwhbevjfra.supabase.co/functions/v1/verify-razorpay-payment`, {
            method: 'POST',
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          }).catch(console.error);

          toast({ 
            title: "🎉 Premium Unlocked!", 
            description: `₹${AMOUNT/100} paid! Tests unlocked!` 
          });
          
          // 5. HARDCODE PREMIUM STATE + RELOAD
          window.dispatchEvent(new CustomEvent('premium-unlocked'));
          refreshProfile();
          window.location.href = '/mock-tests';  // FULL RELOAD
        },
        modal: {
          ondismiss: () => toast({ title: "Cancelled", description: "Upgrade anytime!" }),
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error: any) {
      console.error('ERROR:', error);
      toast({ title: "Error", description: error.message || "Try again", variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const features = [
    'All 40+ Full Mock Tests',
    'Delhi Police + SSC GD Papers',
    'Subject-wise Practice Sets',
    'Detailed Performance Analytics',
    'Unlimited Test Attempts',
    'Priority Support',
  ];

  if (isPremium) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-20 pb-12">
          <div className="max-w-lg mx-auto text-center py-12">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <Crown className="w-10 h-10 text-success" />
            </div>
            <h1 className="text-2xl font-display font-bold mb-2 text-success">You're Premium!</h1>
            <p className="text-muted-foreground mb-6">
              All tests unlocked!
              {profile?.pro_until && (
                <span className="block mt-2 font-bold">Valid until: {new Date(profile.pro_until).toLocaleDateString()}</span>
              )}
            </p>
            <Button onClick={() => navigate('/mock-tests')} className="gradient-primary text-lg">
              🚀 Start Mock Tests
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <button onClick={() => navigate(-1)} className="flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-4 gradient-primary text-primary-foreground border-0">
              <Crown className="w-3 h-3 mr-1" /> Premium
            </Badge>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Unlock All Mock Tests</h1>
            <p className="text-muted-foreground text-lg">Unlimited access to all practice materials</p>
          </div>

          {/* 🔥 REFERRAL INPUT */}
          <div className="bg-muted/50 p-4 rounded-xl mb-6">
            <div className="flex gap-2">
              <Input 
                placeholder="Enter referral code (₹100 OFF)"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="flex-1"
              />
              <Button onClick={validateReferral} variant="outline" size="sm">
                Apply
              </Button>
            </div>
            {discountApplied && (
              <div className="mt-2 flex items-center gap-2 text-success font-medium">
                <Check className="w-4 h-4" />
                ₹100 OFF applied! Now ₹99 only
              </div>
            )}
          </div>

          <Card className="shadow-card border-0 mb-6 overflow-hidden">
            <div className="gradient-primary p-6 text-primary-foreground">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Crown className="w-6 h-6" />
                  <div>
                    <div className="font-bold text-lg">MockPrime Premium</div>
                    <div className="text-sm opacity-90">30 days unlimited access</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">₹{AMOUNT/100}</div>
                  <div className="text-sm text-primary-100">{discountApplied ? 'with referral' : 'per month'}</div>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-success" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                onClick={handleUpgrade} 
                disabled={creating}
                className="w-full gradient-primary text-lg h-12 font-bold"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Pay ₹{AMOUNT/100} Now
                  </>
                )}
              </Button>
              <div className="text-xs text-muted-foreground mt-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" />
                  Secure payment via Razorpay
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3" />
                  Cancel Anytime
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
