import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { GrowthChart } from '@/components/GrowthChart';
import { GlobalLeaderboard } from '@/components/GlobalLeaderboard';
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  TrendingUp, 
  Target, 
  Brain,
  ChevronRight,
  Play,
  Crown,
  Lock,
  Loader2
} from 'lucide-react';

interface TestAttempt {
  id: string;
  test_name: string;
  score: number;
  max_score: number;
  percentage: number;
  correct_answers: number;
  wrong_answers: number;
  unattempted: number;
  time_taken: number;
  created_at: string;
}

interface Stats {
  totalTests: number;
  averageScore: number;
  bestScore: number;
  totalQuestions: number;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const { profile, isPremium, loading: profileLoading } = useProfile();
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [stats, setStats] = useState<Stats>({ totalTests: 0, averageScore: 0, bestScore: 0, totalQuestions: 0 });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const { data, error } = await supabase
        .from('test_attempts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      if (data) {
        setAttempts(data);
        
        const totalTests = data.length;
        const averageScore = totalTests > 0 
          ? data.reduce((acc, curr) => acc + curr.percentage, 0) / totalTests 
          : 0;
        const bestScore = totalTests > 0 
          ? Math.max(...data.map(d => d.percentage)) 
          : 0;
        const totalQuestions = data.reduce((acc, curr) => 
          acc + curr.correct_answers + curr.wrong_answers + curr.unattempted, 0);

        setStats({ totalTests, averageScore, bestScore, totalQuestions });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  // All mock tests for quick start section
  const allMockTests = [
    { name: 'Mock Test 1 (FREE)', table: 'Mock test 1', isFree: true },
    { name: 'Mock Test 2', table: 'Mock test 2', isPro: true },
    { name: 'Mock Test 3', table: 'Mock test 3', isPro: true },
    { name: 'Mock Test 4', table: 'Mock test 4', isPro: true },
    { name: 'Mock Test 5', table: 'Mock test 5', isPro: true },
    { name: 'Reasoning 1', table: 'Reasoning 1', isPro: true },
    { name: 'Reasoning 2', table: 'Reasoning 2', isPro: true },
    { name: 'Reasoning 3', table: 'Reasoning 3', isPro: true },
    { name: 'Maths 1', table: 'Maths 1', isPro: true },
    { name: 'Maths 2', table: 'Maths 2', isPro: true },
    { name: 'Computer 1', table: 'Computer 1', isPro: true },
    { name: 'General Awareness 1', table: 'General Awareness 1', isPro: true },
  ];

  const subjects = [
    { name: 'Reasoning', icon: Brain, color: 'bg-purple-500', tests: 7 },
    { name: 'Mathematics', icon: Target, color: 'bg-blue-500', tests: 6 },
    { name: 'General Awareness', icon: BookOpen, color: 'bg-green-500', tests: 5 },
    { name: 'Computer', icon: TrendingUp, color: 'bg-orange-500', tests: 5 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Header */}
        <div className="mb-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold mb-1">
                Welcome, {user.user_metadata?.full_name || user.email?.split('@')[0]}! 👋
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">Track your progress and continue your exam preparation.</p>
            </div>
            {isPremium ? (
              <Badge className="gradient-primary text-primary-foreground border-0 self-start">
                <Crown className="w-3 h-3 mr-1" />
                Premium Member
              </Badge>
            ) : (
              <Link to="/upgrade">
                <Button className="gradient-primary w-full sm:w-auto">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          <Card className="shadow-card border-0 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="pt-4 md:pt-6 px-3 md:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Tests Done</p>
                  <p className="text-2xl md:text-3xl font-bold">{stats.totalTests}</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="pt-4 md:pt-6 px-3 md:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Avg Score</p>
                  <p className="text-2xl md:text-3xl font-bold">{stats.averageScore.toFixed(0)}%</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="pt-4 md:pt-6 px-3 md:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Best Score</p>
                  <p className="text-2xl md:text-3xl font-bold">{stats.bestScore.toFixed(0)}%</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Target className="w-5 h-5 md:w-6 md:h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CardContent className="pt-4 md:pt-6 px-3 md:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">Questions</p>
                  <p className="text-2xl md:text-3xl font-bold">{stats.totalQuestions}</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-info/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-info" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Start Mock Test - All Tests */}
            <Card className="shadow-card border-0 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Play className="w-5 h-5 text-primary" />
                  Start Mock Test
                </CardTitle>
                <CardDescription>All available mock tests and practice papers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {allMockTests.map((test, index) => {
                    const isLocked = test.isPro && !isPremium;
                    return (
                      <Link
                        key={test.table}
                        to={isLocked ? '/upgrade' : `/test/${test.table}`}
                        className={`p-3 rounded-lg border transition-all text-sm ${
                          isLocked 
                            ? 'bg-muted/50 border-border hover:bg-muted' 
                            : test.isFree 
                              ? 'bg-success/10 border-success/20 hover:bg-success/20' 
                              : 'bg-card border-border hover:border-primary/50 hover:bg-primary/5'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate">{test.name}</span>
                          {isLocked ? (
                            <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <Play className="w-3 h-3 text-primary flex-shrink-0" />
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <div className="mt-4 flex gap-2">
                  <Link to="/mock-tests" className="flex-1">
                    <Button variant="outline" className="w-full">
                      View All Tests
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Delhi Police Mock Tests */}
            <Card className="shadow-card border-0 animate-fade-in" style={{ animationDelay: '0.55s' }}>
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  Delhi Police Mock Tests
                </CardTitle>
                <CardDescription>Practice with Delhi Police exam pattern</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { name: 'Mock 1 (FREE)', table: 'Delhi Police Mock 1', isFree: true },
                    { name: 'Mock 2', table: 'Delhi Police Mock 2', isPro: true },
                    { name: 'Mock 3', table: 'Delhi Police Mock 3', isPro: true },
                    { name: 'Mock 4', table: 'Delhi Police Mock 4', isPro: true },
                    { name: 'Mock 5', table: 'Delhi Police Mock 5', isPro: true },
                    { name: 'Mock 6', table: 'Delhi Police Mock 6', isPro: true },
                    { name: 'Mock 7', table: 'Delhi Police Mock 7', isPro: true },
                    { name: 'Mock 8', table: 'Delhi Police Mock 8', isPro: true },
                    { name: 'Mock 9', table: 'Delhi Police Mock 9', isPro: true },
                    { name: 'Mock 10', table: 'Delhi Police Mock 10', isPro: true },
                  ].map((test) => {
                    const isLocked = test.isPro && !isPremium;
                    return (
                      <Link
                        key={test.table}
                        to={isLocked ? '/upgrade' : `/test/${test.table}`}
                        className={`p-3 rounded-lg border transition-all text-sm ${
                          isLocked 
                            ? 'bg-muted/50 border-border hover:bg-muted' 
                            : test.isFree 
                              ? 'bg-success/10 border-success/20 hover:bg-success/20' 
                              : 'bg-card border-border hover:border-primary/50 hover:bg-primary/5'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate">{test.name}</span>
                          {isLocked ? (
                            <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <Play className="w-3 h-3 text-primary flex-shrink-0" />
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* SSC GD Mock Tests */}
            <Card className="shadow-card border-0 animate-fade-in" style={{ animationDelay: '0.58s' }}>
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-orange-500" />
                  SSC GD Mock Tests
                </CardTitle>
                <CardDescription>Practice with SSC GD exam pattern (Hindi & English)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* English Mocks */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">English Medium</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Array.from({ length: 10 }, (_, i) => ({
                      name: `English Mock ${i + 1}`,
                      table: `SSC GD English Mock ${i + 1}`,
                      isPro: true,
                    })).map((test) => {
                      const isLocked = !isPremium;
                      return (
                        <Link
                          key={test.table}
                          to={isLocked ? '/upgrade' : `/test/${test.table}`}
                          className={`p-3 rounded-lg border transition-all text-sm ${
                            isLocked 
                              ? 'bg-muted/50 border-border hover:bg-muted' 
                              : 'bg-card border-border hover:border-primary/50 hover:bg-primary/5'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate">{test.name}</span>
                            {isLocked ? (
                              <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <Play className="w-3 h-3 text-primary flex-shrink-0" />
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
                {/* Hindi Mocks */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Hindi Medium</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Array.from({ length: 10 }, (_, i) => ({
                      name: `Hindi Mock ${i + 1}`,
                      table: `SSC GD Hindi Mock ${i + 1}`,
                      isPro: true,
                    })).map((test) => {
                      const isLocked = !isPremium;
                      return (
                        <Link
                          key={test.table}
                          to={isLocked ? '/upgrade' : `/test/${test.table}`}
                          className={`p-3 rounded-lg border transition-all text-sm ${
                            isLocked 
                              ? 'bg-muted/50 border-border hover:bg-muted' 
                              : 'bg-card border-border hover:border-primary/50 hover:bg-primary/5'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate">{test.name}</span>
                            {isLocked ? (
                              <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <Play className="w-3 h-3 text-primary flex-shrink-0" />
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Growth Chart */}
            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <GrowthChart />
            </div>

            {/* Subject Progress */}
            <Card className="shadow-card border-0 animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg">Practice by Subject</CardTitle>
                <CardDescription>Choose a subject to practice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 md:space-y-3">
                {subjects.map((subject) => (
                  <Link
                    key={subject.name}
                    to={isPremium ? `/practice?subject=${subject.name.toLowerCase()}` : '/upgrade'}
                    className="flex items-center justify-between p-3 md:p-4 rounded-lg hover:bg-muted transition-colors group"
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={`w-9 h-9 md:w-10 md:h-10 rounded-lg ${subject.color} flex items-center justify-center`}>
                        <subject.icon className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm md:text-base">{subject.name}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">{subject.tests} sets</p>
                      </div>
                    </div>
                    {isPremium ? (
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-4 md:space-y-6">
            {/* Global Leaderboard */}
            <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <GlobalLeaderboard />
            </div>

            {/* Recent Activity */}
            <Card className="shadow-card border-0 animate-fade-in" style={{ animationDelay: '0.9s' }}>
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg">Recent Activity</CardTitle>
                <CardDescription>Your latest test attempts</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingData ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : attempts.length > 0 ? (
                  <div className="space-y-3">
                    {attempts.map((attempt) => (
                      <div key={attempt.id} className="p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-xs md:text-sm line-clamp-1">{attempt.test_name}</p>
                          <span className={`text-xs md:text-sm font-semibold ${
                            attempt.percentage >= 70 ? 'text-success' : 
                            attempt.percentage >= 40 ? 'text-warning' : 'text-destructive'
                          }`}>
                            {attempt.percentage.toFixed(0)}%
                          </span>
                        </div>
                        <Progress value={attempt.percentage} className="h-1.5 md:h-2" />
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{Math.floor(attempt.time_taken / 60)}m {attempt.time_taken % 60}s</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No tests attempted yet</p>
                    <p className="text-xs mt-1">Start a mock test to see your progress</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
