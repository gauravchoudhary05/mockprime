-- Drop the view and recreate with SECURITY INVOKER
DROP VIEW IF EXISTS public.leaderboard_profiles;

-- Create view with SECURITY INVOKER (default, but explicit for clarity)
CREATE VIEW public.leaderboard_profiles 
WITH (security_invoker = true) AS
SELECT 
  user_id,
  full_name
FROM public.profiles;

-- Grant SELECT on the view
GRANT SELECT ON public.leaderboard_profiles TO authenticated, anon;