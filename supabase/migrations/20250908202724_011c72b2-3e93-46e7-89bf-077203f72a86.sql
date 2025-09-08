-- Fix RLS policies for photo_credits table to allow system inserts
-- The issue is that the trigger function cannot insert due to RLS policies

-- Create a security definer function that bypasses RLS for initial credit creation
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

-- Update the handle_new_user_signup function to use the new function
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