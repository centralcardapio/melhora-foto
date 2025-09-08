-- Fix database functions permissions and search_path security issues
-- Drop all triggers first, then functions, then recreate everything

-- Drop triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_photo_credits_updated_at ON photo_credits;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user_signup();
DROP FUNCTION IF EXISTS public.update_photo_credits_updated_at();

-- Recreate handle_new_user_signup with proper security settings
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

-- Recreate update_photo_credits_updated_at with proper search_path
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

-- Recreate the triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_signup();

CREATE TRIGGER update_photo_credits_updated_at
  BEFORE UPDATE ON public.photo_credits
  FOR EACH ROW EXECUTE PROCEDURE public.update_photo_credits_updated_at();