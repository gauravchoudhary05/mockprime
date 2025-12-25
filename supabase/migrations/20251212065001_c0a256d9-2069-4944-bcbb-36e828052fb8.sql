-- Drop the view since it's causing issues
DROP VIEW IF EXISTS public.leaderboard_profiles;

-- Create a policy that allows SELECT on profiles but ONLY for user_id and full_name columns
-- Since PostgreSQL doesn't support column-level RLS, we'll use a function to get leaderboard data

-- Create a security definer function to get leaderboard profiles safely
CREATE OR REPLACE FUNCTION public.get_leaderboard_profiles()
RETURNS TABLE (user_id uuid, full_name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.user_id, p.full_name 
  FROM public.profiles p
  WHERE p.user_id IS NOT NULL
$$;