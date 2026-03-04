import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { Navbar } from '../components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { supabase } from '../integrations/supabase/client';
import { GrowthChart } from '../components/GrowthChart';
import { GlobalLeaderboard } from '../components/GlobalLeaderboard';
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

interface MockTest {
  name: string;
  table: string;
  isFree?: boolean;
  isPro?: boolean;
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

  // ✅ FIXED: Real table names - No more 42P01 "Mock test 1" errors
  const allMockTests: MockTest[] = [
    { name: 'Delhi Police Mock 1 (FREE)', table: 'Delhi Police Mock 1', isFree: true },
    { name: 'Delhi Police Mock 2', table: 'Delhi Police Mock 2', isPro: true },
    { name: 'Delhi Police Mock 3', table: 'Delhi Police Mock 3', isPro: true },
    { name: 'Delhi Police Mock 4', table: 'Delhi Police Mock 4', isPro: true },
    { name: 'Delhi Police Mock 5', table: 'Delhi Police Mock 5', isPro: true },
    { name: 'Reasoning 1', table: 'Reasoning 1', isPro: true },
    { name: 'Reasoning 2', table: 'Reasoning 2', isPro: true },
    { name: 'Reasoning 3', table: 'Reasoning 3', isPro: true },
    { name: 'Maths 1', table: 'Maths 1', isPro: true },
    { name: 'Maths 2', table: 'Maths 2', isPro: true },
    { name: 'Computer 1', table: 'Computer 1', isPro: true },
    { name: 'General Awareness 1', table: 'General Awareness 1', isPro: true },
  ];

  const delhiPoliceTests: MockTest[] = [
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
  ];

  const subjects = [
    { name: 'Reasoning', icon: Brain, color: 'from-purple-500 to-violet-600', bgColor: 'bg-purple-500', tests: 7, tablePrefix: 'Reasoning' },
    { name: 'Mathematics', icon: Target, color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-500', tests: 6, tablePrefix: 'Maths' },
    { name: 'General Awareness', icon: BookOpen, color: 'from-emerald-500 to-green-600', bgColor: 'bg-green-500', tests: 5, tablePrefix: 'General Awareness' },
    { name: 'Computer', icon: TrendingUp, color: 'from-orange-500 to-amber-500', bgColor: 'bg-orange-500', tests: 5, tablePrefix: 'Computer' },
  ];

  const TestCard = ({ test }: { test: MockTest }) => {
    const isLocked = test.isPro && !isPremium;
    return (
      <Link
        key={test.table}
        to={isLocked ? '/upgrade' : `/test/${test.table}`}
        className={`group p-3 rounded-xl border transition-all duration-300 text-sm ${isLocked
            ? 'bg-muted/30 border-border/50 hover:bg-muted/60 hover:border-border'
            : test.isFree
              ? 'bg-success/5 border-success/20 hover:bg-success/15 hover:border-success/40 hover:shadow-glow-success'
              : 'bg-card border-border/50 hover:border-primary/40 hover:bg-primary/5 hover:shadow-glow'
          }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-medium truncate">{test.name}</span>
          {isLocked ? (
            <Lock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          ) : (
            <Play className="w-3.5 h-3.5 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
          )}
        </div>
      </Link>
    );
  };

  const statCardsData = [
    { label: 'Tests Done', value: stats.totalTests, icon: Trophy, iconBg: 'from-blue-500 to-indigo-600', borderClass: 'stat-card-primary' },
    { label: 'Avg Score', value: `${stats.averageScore.toFixed(0)}%`, icon: TrendingUp, iconBg: 'from-emerald-500 to-green-600', borderClass: 'stat-card-success' },
    { label: 'Best Score', value: `${stats.bestScore.toFixed(0)}%`, icon: Target, iconBg: 'from-amber-500 to-orange-500', borderClass: 'stat-card-warning' },
    { label: 'Questions', value: stats.totalQuestions, icon: BookOpen, iconBg: 'from-cyan-500 to-blue-500', borderClass: 'stat-card-info' },
  ];

  return (
    <div className="min-h-screen bg-background animated-gradient-bg">
      <Navbar />
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Header */}
        <div className="mb-8 animate-fade-in relative">
          {/* Decorative blob */}
          <div className="absolute -top-10 -right-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-5 -left-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold mb-1">
                Welcome, {user.user_metadata?.full_name || user.email?.split('@')[0]}! 👋
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">Track your progress and continue your exam preparation.</p>
            </div>
            {isPremium ? (
              <Badge className="gradient-primary text-primary-foreground border-0 self-start px-4 py-1.5 text-sm shadow-glow shimmer">
                <Crown className="w-3.5 h-3.5 mr-1.5" />
                Premium Member
              </Badge>
            ) : (
              <Link to="/upgrade">
                <Button className="gradient-primary w-full sm:w-auto shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:-translate-y-0.5">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
          {statCardsData.map((stat, index) => (
            <Card
              key={stat.label}
              className={`${stat.borderClass} shadow-card border-0 animate-fade-in card-hover-lift overflow-hidden`}
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              <CardContent className="pt-4 md:pt-6 px-3 md:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground font-medium">{stat.label}</p>
                    <p className="text-2xl md:text-3xl font-bold mt-0.5">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${stat.iconBg} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Start Mock Test - All Tests */}
            <Card className="shadow-card border-0 animate-fade-in gradient-accent-top overflow-hidden" style={{ animationDelay: '0.5s' }}>
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                  Start Mock Test
                </CardTitle>
                <CardDescription>All available mock tests and practice papers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {allMockTests.map((test) => (
                    <TestCard key={test.table} test={test} />
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <Link to="/mock-tests" className="flex-1">
                    <Button variant="outline" className="w-full group hover:border-primary/40">
                      View All Tests
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Delhi Police Mock Tests */}
            <Card className="shadow-card border-0 animate-fade-in overflow-hidden" style={{ animationDelay: '0.55s' }}>
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  Delhi Police Mock Tests
                </CardTitle>
                <CardDescription>Practice with Delhi Police exam pattern (100+ questions each)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {delhiPoliceTests.map((test) => (
                    <TestCard key={test.table} test={test} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* SSC GD Mock Tests */}
            <Card className="shadow-card border-0 animate-fade-in overflow-hidden" style={{ animationDelay: '0.58s' }}>
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  SSC GD Mock Tests
                  <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20 text-xs ml-1">New</Badge>
                </CardTitle>
                <CardDescription>Practice with SSC GD exam pattern (Hindi & English)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* English Mocks */}
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    English Medium
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Array.from({ length: 10 }, (_, i) => ({
                      name: `English Mock ${i + 1}`,
                      table: `SSC GD English Mock ${i + 1}`,
                      isPro: true,
                    })).map((test) => (
                      <TestCard key={test.table} test={test} />
                    ))}
                  </div>
                </div>
                {/* Hindi Mocks */}
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    Hindi Medium
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Array.from({ length: 10 }, (_, i) => ({
                      name: `Hindi Mock ${i + 1}`,
                      table: `SSC GD Hindi Mock ${i + 1}`,
                      isPro: true,
                    })).map((test) => (
                      <TestCard key={test.table} test={test} />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Growth Chart */}
            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <GrowthChart />
            </div>

            {/* Subject Progress */}
            <Card className="shadow-card border-0 animate-fade-in overflow-hidden" style={{ animationDelay: '0.7s' }}>
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg">Practice by Subject</CardTitle>
                <CardDescription>Choose a subject to practice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {subjects.map((subject) => (
                  <Link
                    key={subject.name}
                    to={isPremium ? `/practice?subject=${subject.tablePrefix.toLowerCase()}` : '/upgrade'}
                    className="flex items-center justify-between p-3 md:p-4 rounded-xl hover:bg-muted/80 transition-all duration-200 group border border-transparent hover:border-border/50"
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200`}>
                        <subject.icon className="w-5 h-5 md:w-5.5 md:h-5.5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm md:text-base">{subject.name}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">{subject.tests} sets available</p>
                      </div>
                    </div>
                    {isPremium ? (
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
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
            <Card className="shadow-card border-0 animate-fade-in overflow-hidden" style={{ animationDelay: '0.9s' }}>
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
                      <div key={attempt.id} className="p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors border border-border/30">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-xs md:text-sm line-clamp-1">{attempt.test_name}</p>
                          <Badge
                            variant="outline"
                            className={`text-xs font-bold px-2 ${attempt.percentage >= 70 ? 'bg-success/10 text-success border-success/30' :
                                attempt.percentage >= 40 ? 'bg-warning/10 text-warning border-warning/30' : 'bg-destructive/10 text-destructive border-destructive/30'
                              }`}
                          >
                            {attempt.percentage.toFixed(0)}%
                          </Badge>
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
                    <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 opacity-40" />
                    </div>
                    <p className="text-sm font-medium">No tests attempted yet</p>
                    <p className="text-xs mt-1 mb-4">Start a mock test to see your progress</p>
                    <Link to="/test/Delhi Police Mock 1">
                      <Button className="w-full gradient-primary shadow-glow hover:shadow-glow-lg transition-all">
                        <Play className="w-4 h-4 mr-2" />
                        Start Free Mock Test
                      </Button>
                    </Link>
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
