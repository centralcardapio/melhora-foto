-- Complete cleanup and recreation of all auth-related functions and triggers
-- This will fix all the permission and search_path issues

-- Drop all triggers first (including any we might have missed)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_credits ON auth.users;
DROP TRIGGER IF EXISTS update_photo_credits_updated_at ON photo_credits;

-- Drop all functions
DROP FUNCTION IF EXISTS public.handle_new_user_signup() CASCADE;
DROP FUNCTION IF EXISTS public.initialize_user_credits() CASCADE;
DROP FUNCTION IF EXISTS public.update_photo_credits_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.create_initial_credits(uuid);

-- Create the security definer function for creating initial credits
CREATE OR REPLACE FUNCTION public.create_initial_credits(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.photo_credits (user_id, total_purchased, total_used, available)
  VALUES (user_id_param, 2, 0, 2);
END;
$$;

-- Create the trigger function that will be called when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Use the security definer function to bypass RLS
  PERFORM public.create_initial_credits(NEW.id);
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE LOG 'Error creating initial credits for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create the function for updating photo credits timestamps
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

-- Create the triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_signup();

CREATE TRIGGER update_photo_credits_updated_at
  BEFORE UPDATE ON public.photo_credits
  FOR EACH ROW EXECUTE PROCEDURE public.update_photo_credits_updated_at();