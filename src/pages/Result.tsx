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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          {/* Score Card */}
          <Card className="shadow-card border-0 mb-6 overflow-hidden animate-fade-in">
            <div className="gradient-primary p-8 text-center text-primary-foreground">
              <Trophy className="w-16 h-16 mx-auto mb-4 opacity-90" />
              <h1 className="text-3xl font-display font-bold mb-2">Test Completed!</h1>
              <p className="opacity-80">{testName}</p>
            </div>
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <p className="text-6xl font-display font-bold mb-2 text-gradient">
                  {percentage.toFixed(1)}%
                </p>
                <p className="text-2xl font-semibold">
                  <span className={getScoreColor()}>{score.toFixed(1)}</span>
                  <span className="text-muted-foreground"> / {maxScore}</span>
                </p>
              </div>
              <p className="text-lg text-muted-foreground">{getScoreMessage()}</p>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="shadow-card border-0 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <p className="text-2xl font-bold text-success">{correct}</p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </CardContent>
            </Card>

            <Card className="shadow-card border-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto mb-3">
                  <XCircle className="w-6 h-6 text-destructive" />
                </div>
                <p className="text-2xl font-bold text-destructive">{wrong}</p>
                <p className="text-sm text-muted-foreground">Wrong</p>
              </CardContent>
            </Card>

            <Card className="shadow-card border-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
                  <MinusCircle className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold">{unattempted}</p>
                <p className="text-sm text-muted-foreground">Skipped</p>
              </CardContent>
            </Card>

            <Card className="shadow-card border-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <p className="text-2xl font-bold">{formatTime(timeTaken)}</p>
                <p className="text-sm text-muted-foreground">Time Taken</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analysis */}
          <Card className="shadow-card border-0 mb-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle className="font-display">Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Accuracy</span>
                  <span className="text-sm text-muted-foreground">
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
                  <span className="text-sm font-medium">Attempt Rate</span>
                  <span className="text-sm text-muted-foreground">
                    {((total - unattempted) / total * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={(total - unattempted) / total * 100} 
                  className="h-3"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Questions</p>
                  <p className="text-xl font-bold">{total}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Attempted</p>
                  <p className="text-xl font-bold">{total - unattempted}</p>
                </div>
                <div className="text-center">
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
                <Users className="w-5 h-5 text-primary" />
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
              <Button variant="outline" size="lg" className="w-full">
                <BookOpen className="w-4 h-4 mr-2" />
                View Solutions
              </Button>
            </Link>
            <Link to="/mock-tests" className="w-full">
              <Button size="lg" className="w-full gradient-primary">
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
