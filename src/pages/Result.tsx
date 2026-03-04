import { useLocation, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Navbar } from '../components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { TestLeaderboard } from '../components/TestLeaderboard';
import {
  Trophy,
  CheckCircle,
  XCircle,
  MinusCircle,
  Clock,
  Home,
  RotateCcw,
  BookOpen,
  Users
} from 'lucide-react';

interface ResultState {
  score: number;
  maxScore: number;
  percentage: number;
  correct: number;
  wrong: number;
  unattempted: number;
  timeTaken: number;
  testName: string;
}

export default function Result() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const state = location.state as ResultState | null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  if (!state) {
    return <Navigate to="/dashboard" replace />;
  }

  const { score, maxScore, percentage, correct, wrong, unattempted, timeTaken, testName } = state;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = () => {
    if (percentage >= 70) return 'text-success';
    if (percentage >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreMessage = () => {
    if (percentage >= 80) return 'Excellent! Outstanding performance! 🎉';
    if (percentage >= 70) return 'Great job! You did very well! 👏';
    if (percentage >= 50) return 'Good effort! Keep practicing! 💪';
    if (percentage >= 30) return 'You can do better! Study more and try again.';
    return 'Don\'t give up! Practice makes perfect.';
  };

  const total = correct + wrong + unattempted;

  const statsData = [
    { icon: CheckCircle, value: correct, label: 'Correct', iconBg: 'from-emerald-500 to-green-600', textColor: 'text-success' },
    { icon: XCircle, value: wrong, label: 'Wrong', iconBg: 'from-red-500 to-rose-600', textColor: 'text-destructive' },
    { icon: MinusCircle, value: unattempted, label: 'Skipped', iconBg: 'from-slate-400 to-slate-500', textColor: '' },
    { icon: Clock, value: formatTime(timeTaken), label: 'Time Taken', iconBg: 'from-blue-500 to-indigo-600', textColor: '' },
  ];

  return (
    <div className="min-h-screen bg-background animated-gradient-bg">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          {/* Score Card */}
          <Card className="shadow-card border-0 mb-6 overflow-hidden animate-scale-in">
            <div className="gradient-primary p-8 text-center text-primary-foreground relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute top-4 left-8 w-20 h-20 border border-white/10 rounded-full" />
              <div className="absolute bottom-2 right-12 w-14 h-14 border border-white/10 rounded-full" />
              <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-white/5 rounded-full" />

              <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 shadow-lg border border-white/20">
                  <Trophy className="w-10 h-10 opacity-90" />
                </div>
                <h1 className="text-3xl font-display font-bold mb-2">Test Completed!</h1>
                <p className="opacity-80 font-medium">{testName}</p>
              </div>
            </div>
            <CardContent className="p-8 text-center">
              <div className="mb-6 relative">
                {/* Radial glow behind score */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className={`w-40 h-40 rounded-full blur-3xl opacity-20 ${percentage >= 70 ? 'bg-success' : percentage >= 40 ? 'bg-warning' : 'bg-destructive'
                    }`} />
                </div>
                <p className="text-6xl font-display font-bold mb-2 text-gradient relative">
                  {percentage.toFixed(1)}%
                </p>
                <p className="text-2xl font-semibold">
                  <span className={getScoreColor()}>{score.toFixed(1)}</span>
                  <span className="text-muted-foreground"> / {maxScore}</span>
                </p>
              </div>
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${percentage >= 70 ? 'bg-success/10 text-success' :
                  percentage >= 40 ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'
                }`}>
                {getScoreMessage()}
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {statsData.map((stat, index) => (
              <Card key={stat.label} className="shadow-card border-0 animate-fade-in card-hover-lift" style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
                <CardContent className="pt-6 text-center">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.iconBg} flex items-center justify-center mx-auto mb-3 shadow-md`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Analysis */}
          <Card className="shadow-card border-0 mb-6 animate-fade-in gradient-accent-top overflow-hidden" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle className="font-display">Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold">Accuracy</span>
                  <span className="text-sm text-muted-foreground font-medium">
                    {total - unattempted > 0
                      ? ((correct / (total - unattempted)) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
                <Progress
                  value={total - unattempted > 0 ? (correct / (total - unattempted)) * 100 : 0}
                  className="h-3"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold">Attempt Rate</span>
                  <span className="text-sm text-muted-foreground font-medium">
                    {((total - unattempted) / total * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={(total - unattempted) / total * 100}
                  className="h-3"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
                <div className="text-center p-3 rounded-xl bg-muted/30">
                  <p className="text-sm text-muted-foreground">Questions</p>
                  <p className="text-xl font-bold">{total}</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted/30">
                  <p className="text-sm text-muted-foreground">Attempted</p>
                  <p className="text-xl font-bold">{total - unattempted}</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted/30">
                  <p className="text-sm text-muted-foreground">Score</p>
                  <p className="text-xl font-bold">{score.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Leaderboard */}
          <Card className="shadow-card border-0 mb-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="font-display flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TestLeaderboard testName={testName} />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <Link to={`/solutions/${encodeURIComponent(testName)}`} className="w-full">
              <Button variant="outline" size="lg" className="w-full hover:border-primary/40">
                <BookOpen className="w-4 h-4 mr-2" />
                View Solutions
              </Button>
            </Link>
            <Link to="/mock-tests" className="w-full">
              <Button size="lg" className="w-full gradient-primary shadow-glow hover:shadow-glow-lg transition-all">
                <RotateCcw className="w-4 h-4 mr-2" />
                Another Test
              </Button>
            </Link>
          </div>

          <div className="flex justify-center mt-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <Link to="/dashboard">
              <Button variant="ghost" size="lg">
                <Home className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
