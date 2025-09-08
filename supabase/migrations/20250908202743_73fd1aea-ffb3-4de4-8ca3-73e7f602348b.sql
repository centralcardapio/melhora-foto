-- Fix the remaining function with missing search_path
-- The initialize_user_credits function still needs proper search_path

-- Drop and recreate the initialize_user_credits function with proper search_path
DROP FUNCTION IF EXISTS public.initialize_user_credits();

CREATE OR REPLACE FUNCTION public.initialize_user_credits()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.photo_credits (user_id, total_purchased, total_used, available)
  VALUES (NEW.id, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;