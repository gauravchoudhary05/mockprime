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
    <div className="min-h-screen bg-background flex flex-col">
      {/* App Header */}
      <header className="pt-8 pb-4 px-4 text-center safe-area-top">
        <div className="flex flex-col items-center gap-2">
          <img
            src={mockprimeLogo}
            alt="MockPrime"
            className="h-16 w-auto object-contain"
          />
          <p className="text-sm text-muted-foreground">
            Delhi Police Exam Preparation
          </p>
        </div>
      </header>

      {/* Auth Form */}
      <main className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-md">
          {isLogin ? <LoginForm /> : <SignupForm />}

          <p className="text-center mt-6 text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-medium hover:underline"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-muted-foreground safe-area-bottom">
        © {new Date().getFullYear()} MockPrime
      </footer>
    </div>
  );
}
