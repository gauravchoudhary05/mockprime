import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Trophy, Medal, Award, Loader2 } from 'lucide-react';

interface TestLeaderboardEntry {
  user_id: string;
  full_name: string;
  score: number;
  percentage: number;
  time_taken: number;
}

interface TestLeaderboardProps {
  testName: string;
  className?: string;
}

export function TestLeaderboard({ testName, className = '' }: TestLeaderboardProps) {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<TestLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    fetchTestLeaderboard();
  }, [testName]);

  const fetchTestLeaderboard = async () => {
    try {
      // Use secure RPC function that returns only necessary data
      const { data, error } = await supabase
        .rpc('get_test_leaderboard', { test_name_param: testName }) as { 
          data: TestLeaderboardEntry[] | null; 
          error: Error | null 
        };

      if (error) throw error;

      const leaderboardData = data || [];

      // Find current user rank
      const rank = leaderboardData.findIndex(e => e.user_id === user?.id) + 1;
      setUserRank(rank > 0 ? rank : null);

      setLeaderboard(leaderboardData.slice(0, 5));
    } catch (error) {
      console.error('Error fetching test leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 2:
        return <Medal className="w-4 h-4 text-gray-400" />;
      case 3:
        return <Award className="w-4 h-4 text-amber-600" />;
      default:
        return <span className="text-xs font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-4 ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className={`text-center py-4 text-muted-foreground ${className}`}>
        <p className="text-xs">No attempts yet</p>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">Top Performers</p>
        {userRank && (
          <Badge variant="outline" className="text-xs">
            Your Rank: #{userRank}
          </Badge>
        )}
      </div>
      {leaderboard.map((entry, index) => {
        const rank = index + 1;
        const isCurrentUser = entry.user_id === user?.id;
        
        return (
          <div
            key={entry.user_id}
            className={`flex items-center gap-2 p-2 rounded text-xs ${
              isCurrentUser ? 'bg-primary/10' : 'bg-muted/50'
            }`}
          >
            <div className="flex-shrink-0 w-5">{getRankIcon(rank)}</div>
            <div className="flex-1 min-w-0 truncate">
              {entry.full_name}
              {isCurrentUser && <span className="text-primary"> (You)</span>}
            </div>
            <span className="font-medium">{entry.percentage.toFixed(0)}%</span>
          </div>
        );
      })}
    </div>
  );
}
