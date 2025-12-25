-- Drop the overly permissive public policy
DROP POLICY IF EXISTS "Anyone can view test attempts for leaderboards" ON public.test_attempts;

-- Create a secure RPC function for global leaderboard data
-- This aggregates data server-side, only exposing necessary fields
CREATE OR REPLACE FUNCTION public.get_global_leaderboard()
RETURNS TABLE(
  user_id uuid,
  full_name text,
  total_tests bigint,
  avg_percentage numeric,
  total_points bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    ta.user_id,
    COALESCE(p.full_name, 'Anonymous') as full_name,
    COUNT(ta.id) as total_tests,
    ROUND(AVG(ta.percentage), 1) as avg_percentage,
    ROUND((AVG(ta.percentage) * 10) + (COUNT(ta.id) * 5))::bigint as total_points
  FROM public.test_attempts ta
  LEFT JOIN public.profiles p ON ta.user_id = p.user_id
  GROUP BY ta.user_id, p.full_name
  ORDER BY total_points DESC
  LIMIT 100
$$;

-- Create a secure RPC function for test-specific leaderboard data
CREATE OR REPLACE FUNCTION public.get_test_leaderboard(test_name_param text)
RETURNS TABLE(
  user_id uuid,
  full_name text,
  score numeric,
  percentage numeric,
  time_taken integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH best_scores AS (
    SELECT DISTINCT ON (ta.user_id)
      ta.user_id,
      ta.score,
      ta.percentage,
      ta.time_taken
    FROM public.test_attempts ta
    WHERE ta.test_name = test_name_param
    ORDER BY ta.user_id, ta.percentage DESC
  )
  SELECT 
    bs.user_id,
    COALESCE(p.full_name, 'Anonymous') as full_name,
    bs.score,
    bs.percentage,
    bs.time_taken
  FROM best_scores bs
  LEFT JOIN public.profiles p ON bs.user_id = p.user_id
  ORDER BY bs.percentage DESC
  LIMIT 10
$$;