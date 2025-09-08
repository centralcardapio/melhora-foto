-- Fix the handle_new_user_signup function to have proper permissions
-- and fix search_path security issues

-- Drop existing function
DROP FUNCTION IF EXISTS public.handle_new_user_signup();

-- Recreate with proper security settings
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert initial photo credits for new user
  INSERT INTO public.photo_credits (user_id, total_purchased, total_used, available)
  VALUES (NEW.id, 2, 0, 2);
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE LOG 'Error creating initial credits for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create the trigger if it doesn't exist
CREATE TRIGGER IF NOT EXISTS on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_signup();

-- Also fix the other function's search_path
DROP FUNCTION IF EXISTS public.update_photo_credits_updated_at();

CREATE OR REPLACE FUNCTION public.update_photo_credits_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  -- Recalculate available credits
  NEW.available = NEW.total_purchased - NEW.total_used;
  RETURN NEW;
END;
$$;