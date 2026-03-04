import { useSearchParams, Link, Navigate } from "react-router-dom";
import { LoginForm } from "../components/auth/LoginForm";
import { SignupForm } from "../components/auth/SignupForm";
import { useAuth } from "../hooks/useAuth";
import { Navbar } from "../components/layout/Navbar";
import { Shield, BookOpen, Trophy, Clock, Sparkles, Target, Brain } from "lucide-react";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "login";
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="min-h-screen pt-16 flex">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8 relative">
          {/* Subtle floating orbs */}
          <div className="absolute top-20 left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none animate-float-slow" />
          <div className="absolute bottom-20 right-10 w-52 h-52 bg-accent/5 rounded-full blur-3xl pointer-events-none animate-float-delayed" />

          <div className="w-full max-w-md animate-slide-up relative z-10">
            {mode === "login" ? <LoginForm /> : <SignupForm />}
            <p className="text-center mt-6 text-muted-foreground">
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <Link
                    to="/auth?mode=signup"
                    className="text-primary hover:underline font-semibold"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link
                    to="/auth?mode=login"
                    className="text-primary hover:underline font-semibold"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Right Side - Features */}
        <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center p-12">
          {/* Animated mesh gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.3),transparent_50%)]" />

          {/* Floating decorative shapes */}
          <div className="absolute top-20 right-20 w-20 h-20 border border-white/10 rounded-2xl rotate-12 animate-float-slow" />
          <div className="absolute bottom-32 left-16 w-16 h-16 border border-white/10 rounded-full animate-float" />
          <div className="absolute top-1/3 right-1/4 w-10 h-10 bg-white/5 rounded-lg rotate-45 animate-float-delayed" />

          <div className="max-w-md text-primary-foreground relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
                <Shield className="w-7 h-7" />
              </div>
              <span className="font-display font-bold text-2xl">MockPrime</span>
            </div>
            <h2 className="text-3xl font-bold mb-4 leading-tight">
              Ace Your<br />
              <span className="text-white/90">Competitive Exam</span>
            </h2>
            <p className="text-primary-foreground/75 mb-10 text-lg leading-relaxed">
              Comprehensive mock tests and practice questions designed
              specifically for Competitive exams.
            </p>
            <div className="space-y-4">
              {[
                { icon: BookOpen, title: '1000+ Questions', desc: 'Curated question bank covering all topics' },
                { icon: Clock, title: 'Real Exam Simulation', desc: 'Experience actual exam conditions' },
                { icon: Trophy, title: 'Track Your Progress', desc: 'Detailed analytics and performance insights' },
              ].map((feature) => (
                <div key={feature.title} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{feature.title}</h3>
                    <p className="text-sm text-primary-foreground/60">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
