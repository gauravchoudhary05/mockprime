import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, FileText, Play, Lock, Crown, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { TestLeaderboard } from '@/components/TestLeaderboard';

interface TestCardProps {
  name: string;
  table: string;
  questions: number;
  duration: number;
  difficulty?: string;
  isFree?: boolean;
  isPremium: boolean;
  isLocked: boolean;
  badge?: string;
  index?: number;
  showLeaderboard?: boolean;
}

export function TestCard({
  name,
  table,
  questions,
  duration,
  difficulty,
  isFree = false,
  isPremium,
  isLocked,
  badge,
  index = 0,
  showLeaderboard = true,
}: TestCardProps) {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'bg-success/10 text-success border-success/20';
      case 'Medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'Hard': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Expert': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleStartClick = () => {
    if (isLocked) {
      navigate('/upgrade');
    } else {
      navigate(`/test/${table}`);
    }
  };

  const handleViewSolutions = () => {
    navigate(`/solutions/${table}`);
  };

  return (
    <Card 
      className={`shadow-card border-0 hover:shadow-glow transition-all duration-300 animate-fade-in group ${isLocked ? 'opacity-90' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="font-display text-base md:text-lg line-clamp-2">
              {name.includes('SSC GD') ? name : `Delhi Police 2026 - ${name}`}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <FileText className="w-4 h-4 flex-shrink-0" />
              {questions} Questions
            </CardDescription>
          </div>
          <div className="flex flex-col gap-1">
            {isFree && (
              <Badge className="bg-success/10 text-success border-success/20 whitespace-nowrap text-xs">
                FREE
              </Badge>
            )}
            {isLocked && (
              <Badge className="gradient-primary text-primary-foreground border-0 whitespace-nowrap text-xs">
                <Crown className="w-3 h-3 mr-1" />
                PRO
              </Badge>
            )}
            {difficulty && (
              <Badge variant="outline" className={`${getDifficultyColor(difficulty)} text-xs`}>
                {difficulty}
              </Badge>
            )}
            {badge && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 whitespace-nowrap text-xs">
                {badge}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{duration} mins</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 mb-3">
          <Button 
            onClick={handleStartClick}
            className={`flex-1 ${isLocked ? '' : 'gradient-primary'} group-hover:shadow-lg transition-shadow`}
            variant={isLocked ? 'outline' : 'default'}
            size="sm"
          >
            {isLocked ? (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Unlock
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start
              </>
            )}
          </Button>
          {!isLocked && (
            <Button 
              onClick={handleViewSolutions}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Solutions
            </Button>
          )}
        </div>

        {/* Expandable Leaderboard */}
        {showLeaderboard && !isLocked && (
          <>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground py-1 transition-colors"
            >
              {showDetails ? (
                <>
                  Hide Leaderboard <ChevronUp className="w-3 h-3" />
                </>
              ) : (
                <>
                  View Leaderboard <ChevronDown className="w-3 h-3" />
                </>
              )}
            </button>
            {showDetails && (
              <div className="mt-2 pt-2 border-t border-border">
                <TestLeaderboard testName={table} />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
