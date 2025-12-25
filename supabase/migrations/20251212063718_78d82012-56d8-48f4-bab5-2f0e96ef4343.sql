-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Anyone can view profiles for leaderboards" ON public.profiles;

-- Create a secure view for leaderboards that only exposes non-sensitive fields
CREATE OR REPLACE VIEW public.leaderboard_profiles AS
SELECT 
  user_id,
  full_name
FROM public.profiles;

-- Grant SELECT on the view to authenticated and anon users
GRANT SELECT ON public.leaderboard_profiles TO authenticated, anon;