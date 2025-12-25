import { Navigate, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Calculator, Globe, Monitor, Play, ArrowLeft, Lock, Crown, Loader2 } from 'lucide-react';

export default function Practice() {
  const { user, loading } = useAuth();
  const { isPremium, loading: profileLoading } = useProfile();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedSubject = searchParams.get('subject');

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

  const subjects = [
    {
      id: 'reasoning',
      name: 'Reasoning',
      icon: Brain,
      color: 'bg-purple-500',
      description: 'Logical reasoning, puzzles, and analytical thinking',
      sets: [
        { id: 1, name: 'Reasoning Set 1', table: 'Reasoning 1', questions: 25 },
        { id: 2, name: 'Reasoning Set 2', table: 'Reasoning 2', questions: 25 },
        { id: 3, name: 'Reasoning Set 3', table: 'Reasoning 3', questions: 25 },
        { id: 4, name: 'Reasoning Set 4', table: 'Reasoning  4', questions: 25 },
        { id: 5, name: 'Reasoning Set 5', table: 'Reasoning 5', questions: 25 },
        { id: 6, name: 'Reasoning Set 6', table: 'Reasoning 6', questions: 25 },
        { id: 7, name: 'Reasoning Set 7', table: 'Reasoning 7', questions: 25 },
      ]
    },
    {
      id: 'mathematics',
      name: 'Mathematics',
      icon: Calculator,
      color: 'bg-blue-500',
      description: 'Numerical ability, arithmetic, and quantitative aptitude',
      sets: [
        { id: 1, name: 'Maths Set 1', table: 'Maths 1', questions: 25 },
        { id: 2, name: 'Maths Set 2', table: 'Maths 2', questions: 25 },
        { id: 3, name: 'Maths Set 3', table: 'Maths 3', questions: 25 },
        { id: 4, name: 'Maths Set 4', table: 'Maths 4', questions: 25 },
        { id: 5, name: 'Maths Set 5', table: 'Maths 5', questions: 25 },
        { id: 6, name: 'Maths Set 6', table: 'Maths 6', questions: 25 },
      ]
    },
    {
      id: 'general awareness',
      name: 'General Awareness',
      icon: Globe,
      color: 'bg-green-500',
      description: 'Current affairs, history, geography, and general knowledge',
      sets: [
        { id: 1, name: 'GA Set 1', table: 'General Awareness 1', questions: 25 },
        { id: 2, name: 'GA Set 2', table: 'General Awareness 2', questions: 25 },
        { id: 3, name: 'GA Set 3', table: 'General Awareness 3', questions: 25 },
        { id: 4, name: 'GA Set 4', table: 'General Awareness 4', questions: 25 },
        { id: 5, name: 'GA Set 5', table: 'General Awareness 5', questions: 25 },
      ]
    },
    {
      id: 'computer',
      name: 'Computer',
      icon: Monitor,
      color: 'bg-orange-500',
      description: 'Basic computer knowledge and information technology',
      sets: [
        { id: 1, name: 'Computer Set 1', table: 'Computer 1', questions: 25 },
        { id: 2, name: 'Computer Set 2', table: 'Computer 2', questions: 25 },
        { id: 3, name: 'Computer Set 3', table: 'Computer 3', questions: 25 },
        { id: 4, name: 'Computer Set 4', table: 'Computer 4', questions: 25 },
        { id: 5, name: 'Computer Set 5', table: 'Computer 5', questions: 25 },
      ]
    },
  ];

  const currentSubject = selectedSubject 
    ? subjects.find(s => s.id === selectedSubject.toLowerCase())
    : null;

  const handleSetClick = (table: string) => {
    if (!isPremium) {
      navigate('/upgrade');
    } else {
      navigate(`/test/${table}`);
    }
  };

  if (currentSubject) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-20 pb-12">
          <div className="mb-6 animate-fade-in">
            <Link to="/practice" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Subjects
            </Link>
            <div className="flex items-center gap-3 md:gap-4">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${currentSubject.color} flex items-center justify-center flex-shrink-0`}>
                <currentSubject.icon className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold">{currentSubject.name}</h1>
                <p className="text-muted-foreground text-sm md:text-base">{currentSubject.description}</p>
              </div>
            </div>
          </div>

          {!isPremium && (
            <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                <span className="text-sm">Practice sets require Premium access</span>
              </div>
              <Link to="/upgrade">
                <Button size="sm" className="gradient-primary w-full sm:w-auto">
                  Upgrade Now
                </Button>
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {currentSubject.sets.map((set, index) => (
              <Card 
                key={set.id}
                className={`shadow-card border-0 hover:shadow-glow transition-all duration-300 animate-fade-in ${!isPremium ? 'opacity-90' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="font-display text-lg">{set.name}</CardTitle>
                      <CardDescription>{set.questions} Questions</CardDescription>
                    </div>
                    {!isPremium && (
                      <Badge className="gradient-primary text-primary-foreground border-0">
                        <Crown className="w-3 h-3 mr-1" />
                        PRO
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => handleSetClick(set.table)}
                    className={`w-full ${isPremium ? 'gradient-primary' : ''}`}
                    variant={isPremium ? 'default' : 'outline'}
                  >
                    {isPremium ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Practice
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Unlock
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="mb-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold mb-1">Practice Questions</h1>
              <p className="text-muted-foreground text-sm md:text-base">Choose a subject to practice and improve your skills</p>
            </div>
            {!isPremium && (
              <Link to="/upgrade">
                <Button className="gradient-primary w-full sm:w-auto">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {subjects.map((subject, index) => (
            <Link 
              key={subject.id} 
              to={`/practice?subject=${subject.id}`}
              className="block"
            >
              <Card 
                className="shadow-card border-0 hover:shadow-glow transition-all duration-300 h-full animate-fade-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${subject.color} flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0`}>
                      <subject.icon className="w-6 h-6 md:w-7 md:h-7 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="font-display text-lg md:text-xl">{subject.name}</CardTitle>
                      <CardDescription className="mt-1 text-sm line-clamp-2">{subject.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{subject.sets.length} Practice Sets</Badge>
                    <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform">
                      Start <Play className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
