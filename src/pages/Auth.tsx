import { useSearchParams, Link, Navigate } from "react-router-dom";
import { LoginForm } from "../components/auth/LoginForm";
import { SignupForm } from "../components/auth/SignupForm";
import { useAuth } from "../hooks/useAuth";
import { Navbar } from "../components/layout/Navbar";
import { Shield, BookOpen, Trophy, Clock } from "lucide-react";

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
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {mode === "login" ? <LoginForm /> : <SignupForm />}
            <p className="text-center mt-6 text-muted-foreground">
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <Link
                    to="/auth?mode=signup"
                    className="text-primary hover:underline font-medium"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link
                    to="/auth?mode=login"
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Right Side - Features */}
        <div className="hidden lg:flex flex-1 gradient-primary items-center justify-center p-12">
          <div className="max-w-md text-primary-foreground">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7" />
              </div>
              <span className="font-display font-bold text-2xl">MockPrime</span>
            </div>
            <h2 className="text-3xl font-bold mb-6">
              Ace Your Competitive Exam
            </h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              Comprehensive mock tests and practice questions designed
              specifically for Competitive exams.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">1000+ Questions</h3>
                  <p className="text-sm text-primary-foreground/70">
                    Curated question bank covering all topics
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Real Exam Simulation</h3>
                  <p className="text-sm text-primary-foreground/70">
                    Experience actual exam conditions
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Track Your Progress</h3>
                  <p className="text-sm text-primary-foreground/70">
                    Detailed analytics and performance insights
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
