import { useState } from "react";
import { Navigate } from "react-router-dom";
import { LoginForm } from "../components/auth/LoginForm";
import { SignupForm } from "../components/auth/SignupForm";
import { useAuth } from "../hooks/useAuth";
import { Loader2 } from "lucide-react";
import mockprimeLogo from "../assets/mockprime-logo.png";

export default function Index() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Decorative animated orbs */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float-slow pointer-events-none" />
      <div className="absolute bottom-20 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float-delayed pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl animate-float pointer-events-none" />

      {/* App Header */}
      <header className="pt-8 pb-4 px-4 text-center safe-area-top relative z-10">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <img
              src={mockprimeLogo}
              alt="MockPrime"
              className="h-16 w-auto object-contain drop-shadow-lg"
            />
            <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl -z-10 animate-pulse-slow" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            Delhi Police Exam Preparation
          </p>
        </div>
      </header>

      {/* Auth Form */}
      <main className="flex-1 flex items-center justify-center px-4 pb-8 relative z-10">
        <div className="w-full max-w-md animate-slide-up">
          {isLogin ? <LoginForm /> : <SignupForm />}

          <p className="text-center mt-6 text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-semibold hover:underline transition-colors"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-muted-foreground safe-area-bottom relative z-10">
        © {new Date().getFullYear()} MockPrime
      </footer>
    </div>
  );
}
