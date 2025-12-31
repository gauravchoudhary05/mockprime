// src/components/LoginForm.tsx - EXACT SIGNUPFORM MATCH (No Stats Bar for Login)
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, Sparkles, Shield, Zap, Users, Award } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);
  
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      setTermsError(true);
      return;
    }
    
    setTermsError(false);
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "✅ Welcome back!",
        description: "You've successfully logged in.",
      });
      navigate('/dashboard');
    }

    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md border-none shadow-2xl bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden mx-auto lg:mx-0">
      {/* 🔥 Header - SIMPLIFIED LIKE CURRENT */}
      <CardHeader className="text-center space-y-4 pb-10 pt-8 bg-gradient-to-b from-white/100 to-white/70 px-8">
        <div className="mx-auto w-20 h-20 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-xl border-4 border-white/50">
          <Sparkles className="w-9 h-9 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-slate-800 to-blue-900 bg-clip-text text-transparent">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-lg mt-2 text-slate-600 font-medium">
          Sign in to continue your exam preparation
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-8 pb-12 space-y-7">
        <form onSubmit={handleSubmit} className="space-y-7">
          
          {/* 🔥 Email - EXACT SAME AS SIGNUP */}
          <div className="space-y-3">
            <Label htmlFor="email" className="font-semibold text-lg text-slate-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-600" />
              Email Address
            </Label>
            <div className="relative bg-gradient-to-r from-slate-50/80 to-emerald-50/50 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-px shadow-sm">
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 pl-14 pr-6 text-lg bg-white/95 backdrop-blur-sm rounded-xl border-none focus:ring-4 focus:ring-emerald-500/30 shadow-inner font-medium"
                required
              />
              <Mail className="absolute left-6 top-4 h-6 w-6 text-slate-400" />
            </div>
          </div>

          {/* 🔥 Password - EXACT SAME AS SIGNUP */}
          <div className="space-y-3">
            <Label htmlFor="password" className="font-semibold text-lg text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-600" />
              Secure Password
            </Label>
            <div className="relative bg-gradient-to-r from-slate-50/80 to-purple-50/50 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-px shadow-sm">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 pl-14 pr-20 text-lg bg-white/95 backdrop-blur-sm rounded-xl border-none focus:ring-4 focus:ring-purple-500/30 shadow-inner font-medium"
                minLength={6}
                required
              />
              <Lock className="absolute left-6 top-4 h-6 w-6 text-slate-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-4 p-2 bg-white/80 hover:bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200/50 hover:scale-105"
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-slate-600" /> : <Eye className="h-5 w-5 text-slate-600" />}
              </button>
            </div>
          </div>

          {/* 🔥 Terms - EXACT SAME AS SIGNUP */}
          <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50/60 rounded-2xl border-2 border-slate-200/50 shadow-md backdrop-blur-sm">
            <div className="flex items-start space-x-4">
              <Checkbox
                id="terms-login"
                className="mt-1 h-6 w-6 border-2 border-slate-300 rounded-lg data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 shadow-sm"
                checked={termsAccepted}
                onCheckedChange={(checked) => {
                  setTermsAccepted(checked === true);
                  if (checked) setTermsError(false);
                }}
              />
              <label htmlFor="terms-login" className="text-base leading-relaxed cursor-pointer font-medium text-slate-800 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="font-semibold">Secure Agreement</span>
                </div>
                I agree to the{' '}
                <Link to="/legal?type=terms" target="_blank" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link to="/legal?type=privacy" target="_blank" className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            
            {termsError && (
              <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200/80 rounded-xl shadow-md backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="font-semibold text-red-900 text-sm">
                    Please accept Terms to continue
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 🔥 CTA Button - EXACT SAME AS SIGNUP */}
          <Button 
            type="submit" 
            disabled={loading || !termsAccepted}
            className="w-full h-16 text-xl font-bold shadow-2xl hover:shadow-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 hover:from-indigo-700 hover:via-blue-700 hover:to-purple-800 transform hover:-translate-y-1 transition-all duration-300 rounded-3xl border-0 text-white relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <Zap className="w-6 h-6 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Sign In Securely
                </>
              )}
            </span>
          </Button>
        </form>

        {/* 🔥 Footer - EXACT SAME AS SIGNUP */}
        <div className="pt-10 border-t-2 border-dashed border-slate-200 text-center">
          <p className="text-slate-600 text-base font-semibold">
            <Users className="w-5 h-5 inline text-blue-600 mr-2" />
            New to MockPrime?{' '}
            <Link 
              to="/auth?mode=signup" 
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1 group"
            >
              Create Account
              <Award className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
