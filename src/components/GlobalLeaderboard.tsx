import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Trophy, Medal, Award, Loader2, Users } from 'lucide-react';

interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  total_tests: number;
  avg_percentage: number;
  total_points: number;
}

export function GlobalLeaderboard() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      // Use secure RPC function that aggregates data server-side
      const { data, error } = await supabase
        .rpc('get_global_leaderboard') as { 
          data: LeaderboardEntry[] | null; 
          error: Error | null 
        };

      if (error) throw error;

      const leaderboardData = data || [];

      // Find current user rank
      const rank = leaderboardData.findIndex(entry => entry.user_id === user?.id) + 1;
      setUserRank(rank > 0 ? rank : null);

      setLeaderboard(leaderboardData.slice(0, 10));
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-500/10 border-yellow-500/20';
      case 2:
        return 'bg-gray-400/10 border-gray-400/20';
      case 3:
        return 'bg-amber-600/10 border-amber-600/20';
      default:
        return 'bg-muted/50';
    }
  };

  if (loading) {
    return (
      <Card className="shadow-card border-0">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card border-0">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Global Leaderboard
        </CardTitle>
        {userRank && (
          <p className="text-sm text-muted-foreground">Your Rank: #{userRank}</p>
        )}
      </CardHeader>
      <CardContent>
        {leaderboard.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No leaderboard data yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry, index) => {
              const rank = index + 1;
              const isCurrentUser = entry.user_id === user?.id;
              
              return (
                <div
                  key={entry.user_id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    isCurrentUser 
                      ? 'bg-primary/10 border-primary/20' 
                      : getRankBg(rank)
                  }`}
                >
                  <div className="flex-shrink-0">
                    {getRankIcon(rank)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm truncate ${isCurrentUser ? 'text-primary' : ''}`}>
                      {entry.full_name}
                      {isCurrentUser && <span className="ml-2 text-xs">(You)</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {entry.total_tests} tests • {entry.avg_percentage.toFixed(1)}% avg
                    </p>
                  </div>
                  <Badge className="gradient-primary text-primary-foreground border-0 font-bold">
                    {entry.total_points} pts
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
