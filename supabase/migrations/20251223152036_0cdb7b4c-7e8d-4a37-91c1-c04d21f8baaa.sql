-- First drop the RLS policies that depend on user_id
DROP POLICY IF EXISTS "Users can view their own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can insert their own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can update their own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can delete their own preferences" ON public.user_preferences;

-- Now we can safely modify the column
-- Drop the user_id_new column if it was created from previous failed attempt
ALTER TABLE public.user_preferences DROP COLUMN IF EXISTS user_id_new;

-- Change the user_id column type from TEXT to UUID
ALTER TABLE public.user_preferences 
ALTER COLUMN user_id TYPE UUID USING user_id::UUID;

-- Enable RLS if not already enabled
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Recreate policies with proper UUID type comparison
CREATE POLICY "Users can view their own preferences"
ON public.user_preferences
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
ON public.user_preferences
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
ON public.user_preferences
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences"
ON public.user_preferences
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);