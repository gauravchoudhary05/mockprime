import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
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

  const handleUpgrade = async () => {
    setCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
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
        description: 'Unlock all mock tests – ₹199/month',
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
              description: "Welcome to MockPrime Premium! All tests are now unlocked.",
            });

            refreshProfile();
            navigate('/mock-tests');
          } catch (err: any) {
            console.error('Verification error:', err);
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
    'All 5 Full Mock Tests',
    'Previous Year Papers',
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
            <h1 className="text-2xl font-display font-bold mb-2">You're on Premium!</h1>
            <p className="text-muted-foreground mb-6">
              All tests are unlocked. Enjoy your premium access!
              {profile?.pro_until && (
                <span className="block mt-2">
                  Valid until: {new Date(profile.pro_until).toLocaleDateString()}
                </span>
              )}
            </p>
            <Button onClick={() => navigate('/mock-tests')} className="gradient-primary">
              Start Practicing
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
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-4 gradient-primary text-primary-foreground border-0">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Unlock All Mock Tests
            </h1>
            <p className="text-muted-foreground text-lg">
              Get unlimited access to all practice materials
            </p>
          </div>

          <Card className="shadow-card border-0 mb-6 overflow-hidden">
            <div className="gradient-primary p-6 text-primary-foreground">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">₹199</span>
                <span className="text-primary-foreground/80">/month</span>
              </div>
              {orderData?.proRata && (
                <p className="text-sm mt-2 text-primary-foreground/90">
                  Pay only ₹{orderData.amountDisplay} today (pro-rated)
                </p>
              )}
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-4">
                <div className="p-4 rounded-lg bg-muted/50 text-sm">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Current Plan</span>
                    <span className="font-medium">{profile?.plan_name || 'Free'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">New Plan</span>
                    <span className="font-medium text-primary">Premium – ₹199/month</span>
                  </div>
                </div>

                <Button 
                  onClick={handleUpgrade}
                  disabled={creating}
                  className="w-full h-12 text-lg gradient-primary"
                >
                  {creating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Crown className="w-5 h-5 mr-2" />
                      Upgrade to Premium
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Secure Payment
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Instant Access
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Cancel Anytime
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
