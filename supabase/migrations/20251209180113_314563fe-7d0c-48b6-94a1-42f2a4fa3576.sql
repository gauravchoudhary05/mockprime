-- Add public read access to test_attempts for leaderboards
CREATE POLICY "Anyone can view test attempts for leaderboards" 
ON public.test_attempts 
FOR SELECT 
USING (true);

-- Add public read access to profiles for leaderboards (only name)
CREATE POLICY "Anyone can view profiles for leaderboards" 
ON public.profiles 
FOR SELECT 
USING (true);