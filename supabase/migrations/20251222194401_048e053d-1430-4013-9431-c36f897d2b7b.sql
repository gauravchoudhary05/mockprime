-- Update the get_global_leaderboard function with new point system
-- Points based on score: 70-79=1pt, 80-89=2pt, 90-99=3pt, 100+=4pt

CREATE OR REPLACE FUNCTION public.get_global_leaderboard()
RETURNS TABLE(user_id uuid, full_name text, total_tests bigint, avg_percentage numeric, total_points bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    ta.user_id,
    COALESCE(p.full_name, 'Anonymous') as full_name,
    COUNT(ta.id) as total_tests,
    ROUND(AVG(ta.percentage), 1) as avg_percentage,
    SUM(
      CASE 
        WHEN ta.score >= 100 THEN 4
        WHEN ta.score >= 90 THEN 3
        WHEN ta.score >= 80 THEN 2
        WHEN ta.score >= 70 THEN 1
        ELSE 0
      END
    )::bigint as total_points
  FROM public.test_attempts ta
  LEFT JOIN public.profiles p ON ta.user_id = p.user_id
  GROUP BY ta.user_id, p.full_name
  ORDER BY total_points DESC
  LIMIT 100
$$;