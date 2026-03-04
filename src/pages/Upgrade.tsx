import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { supabase } from '../integrations/supabase/client';
import { Navbar } from '../components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
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
  Star,
  Sparkles
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

  // ✅ REFERRAL STATES
  const [referralCode, setReferralCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [loadingReferral, setLoadingReferral] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  // ✅ REFERRAL VALIDATION
  const validateReferral = async () => {
    if (!referralCode || discountApplied || loadingReferral) return;

    setLoadingReferral(true);
    try {
      // ✅ NEW: Query referral_codes table (not profiles)
      const { data } = await supabase
        .from('referral_codes')
        .select('id, discount_amount, is_active')
        .eq('code', referralCode.trim().toUpperCase())
        .eq('is_active', true)
        .single();

      if (data) {
        setDiscountApplied(true);
        toast({
          title: `✅ ₹${data.discount_amount} Discount Applied!`,
          description: "Pay only ₹99 instead of ₹199",
        });
      } else {
        toast({
          title: "❌ Invalid Referral Code",
          description: "Code not found or inactive",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate referral code",
        variant: "destructive",
      });
    } finally {
      setLoadingReferral(false);
    }
  };


  const handleUpgrade = async () => {
    setCreating(true);
    try {
      // ✅ PASS REFERRAL CODE TO ORDER
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          referral_code: discountApplied ? referralCode.trim().toUpperCase() : null
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      setOrderData(data);

      const options = {
        key: data.keyId,
        amount: data.amountToPay,
        currency: 'INR',
        name: 'MockPrime Premium',
        description: discountApplied ? '₹99 with referral (₹100 OFF!)' : 'Unlock all mock tests – ₹199/month',
        order_id: data.orderId,
        prefill: {
          name: data.userName || '',
          email: data.userEmail || user.email || '',
        },
        theme: {
          color: '#3B82F6',
        },
        handler: async function (response: any) {
          try {
            // 1. INSERT PAYMENT RECORD FIRST
            const { error: insertError } = await supabase.from('payments').insert({
              user_id: user.id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount: Math.floor(data.amountToPay / 100),
              status: 'completed',
              new_plan: 'Premium',
              old_plan: profile?.plan_name || 'Free',
              currency: 'INR',
              pro_rata: !!orderData?.proRata
            });

            if (insertError) {
              console.error('Payment insert failed:', insertError);
              throw new Error('Failed to record payment');
            }
            console.log('✅ Payment recorded in payments table!');

            // 2. Verify with Edge Function
            const verifyResult = await supabase.functions.invoke('verify-razorpay-payment', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              headers: {
                Authorization: `Bearer ${session?.access_token}`,
              },
            });

            if (verifyResult.error) throw verifyResult.error;

            toast({
              title: "Payment Successful!",
              description: discountApplied
                ? "Welcome to MockPrime Premium! ₹100 referral discount applied."
                : "Welcome to MockPrime Premium! All tests are now unlocked.",
            });

            refreshProfile();
            navigate('/mock-tests');
          } catch (err: any) {
            console.error('Payment verification error:', err);
            toast({
              title: "Verification Failed",
              description: "Please contact support if amount was deducted.",
              variant: "destructive",
            });
          }
        },
        modal: {
          ondismiss: function () {
            toast({
              title: "Payment Cancelled",
              description: "You can upgrade anytime from the dashboard.",
            });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
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
      <div className="min-h-screen bg-background animated-gradient-bg">
        <Navbar />
        <main className="container mx-auto px-4 pt-20 pb-12">
          <div className="max-w-lg mx-auto text-center py-12 animate-scale-in">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold mb-2">You're on Premium!</h1>
            <p className="text-muted-foreground mb-6">
              All tests are unlocked. Enjoy your premium access!
              {profile?.pro_until && (
                <span className="block mt-2 font-medium">
                  Valid until: {new Date(profile.pro_until).toLocaleDateString()}
                </span>
              )}
            </p>
            <Button onClick={() => navigate('/mock-tests')} className="gradient-primary shadow-glow hover:shadow-glow-lg transition-all">
              Start Practicing
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background animated-gradient-bg relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-40 -left-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -right-20 w-72 h-72 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <Navbar />
      <main className="container mx-auto px-4 pt-20 pb-12 relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <Badge className="mb-4 gradient-primary text-primary-foreground border-0 px-4 py-1.5 text-sm shimmer">
              <Crown className="w-3.5 h-3.5 mr-1.5" />
              Premium
            </Badge>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Unlock All Mock Tests
            </h1>
            <p className="text-muted-foreground text-lg">
              Get unlimited access to all practice materials
            </p>
          </div>

          <Card className="shadow-card border-0 mb-6 overflow-hidden animate-slide-up">
            <div className="gradient-primary p-6 text-primary-foreground relative overflow-hidden">
              {/* Decorative shapes */}
              <div className="absolute top-2 right-8 w-16 h-16 border border-white/10 rounded-2xl rotate-12" />
              <div className="absolute bottom-2 left-8 w-10 h-10 border border-white/10 rounded-full" />

              <div className="relative z-10">
                <div className="flex items-baseline gap-2 justify-center">
                  <span className={`text-5xl font-bold ${discountApplied ? 'text-emerald-300' : ''}`}>
                    {discountApplied ? '₹99' : '₹199'}
                  </span>
                  <span className="text-primary-foreground/80 text-lg">/month</span>
                </div>
                {discountApplied && (
                  <p className="text-sm mt-2 text-emerald-300 text-center font-semibold">
                    💰 ₹100 OFF! (Original ₹199)
                  </p>
                )}
                {orderData?.proRata && !discountApplied && (
                  <p className="text-sm mt-2 text-primary-foreground/90 text-center">
                    Pay only ₹{orderData.amountDisplay} today (pro-rated)
                  </p>
                )}
              </div>
            </div>

            <CardContent className="p-6">
              {/* ✅ REFERRAL INPUT */}
              {!discountApplied && (
                <div className="mb-6 p-4 border border-border/50 rounded-xl bg-muted/30">
                  <div className="flex flex-col sm:flex-row gap-2 items-end">
                    <Input
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      placeholder="Enter referral code (₹100 OFF)"
                      className="flex-1"
                      disabled={loadingReferral}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={validateReferral}
                      disabled={loadingReferral || !referralCode}
                      className="w-full sm:w-auto"
                    >
                      {loadingReferral ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Apply ₹100 OFF'
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 text-center">
                    Get ₹100 discount using friend's referral code
                  </p>
                </div>
              )}

              <div className="space-y-3.5 mb-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 animate-fade-in"
                    style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-4">
                <div className="p-4 rounded-xl bg-muted/30 text-sm border border-border/30">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Current Plan</span>
                    <span className="font-semibold">{profile?.plan_name || 'Free'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">New Plan</span>
                    <span className="font-semibold text-primary">
                      {discountApplied ? 'Premium (₹99 referral)' : 'Premium'} – ₹{discountApplied ? '99' : '199'}/month
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleUpgrade}
                  disabled={creating}
                  className="w-full h-14 text-lg gradient-primary shadow-glow hover:shadow-glow-lg transition-all pulse-glow font-bold"
                >
                  {creating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Crown className="w-5 h-5 mr-2" />
                      {discountApplied ? 'Upgrade to Premium (₹99)' : 'Upgrade to Premium'}
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5 bg-muted/30 px-3 py-1.5 rounded-full">
                    <Shield className="w-3.5 h-3.5 text-primary" />
                    <span className="font-medium">Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-muted/30 px-3 py-1.5 rounded-full">
                    <Zap className="w-3.5 h-3.5 text-warning" />
                    <span className="font-medium">Instant Access</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-muted/30 px-3 py-1.5 rounded-full">
                    <Star className="w-3.5 h-3.5 text-accent" />
                    <span className="font-medium">Cancel Anytime</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
