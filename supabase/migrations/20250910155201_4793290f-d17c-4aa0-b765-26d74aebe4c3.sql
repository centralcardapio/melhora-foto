-- Create a table to track individual credit purchases with expiration
CREATE TABLE IF NOT EXISTS public.credit_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  amount INTEGER NOT NULL,
  used_amount INTEGER NOT NULL DEFAULT 0,
  available_amount INTEGER NOT NULL,
  purchase_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expiration_date TIMESTAMP WITH TIME ZONE NOT NULL,
  purchase_type TEXT NOT NULL DEFAULT 'paid', -- 'paid' or 'free'
  order_reference TEXT, -- for tracking stripe payments
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.credit_purchases ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own credit purchases" 
ON public.credit_purchases 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own credit purchases" 
ON public.credit_purchases 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own credit purchases" 
ON public.credit_purchases 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create a table to track credit usage history
CREATE TABLE IF NOT EXISTS public.credit_usage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  credit_purchase_id UUID NOT NULL REFERENCES public.credit_purchases(id) ON DELETE CASCADE,
  amount_used INTEGER NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  photo_transformation_id UUID REFERENCES public.photo_transformations(id) ON DELETE SET NULL,
  description TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE public.credit_usage_history ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can view their own credit usage history" 
ON public.credit_usage_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own credit usage history" 
ON public.credit_usage_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update available credits when used_amount changes
CREATE OR REPLACE FUNCTION public.update_credit_purchase_available()
RETURNS TRIGGER AS $$
BEGIN
  NEW.available_amount = NEW.amount - NEW.used_amount;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_credit_purchase_available_trigger
  BEFORE UPDATE ON public.credit_purchases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_credit_purchase_available();

-- Create function to get user's total available credits (non-expired)
CREATE OR REPLACE FUNCTION public.get_user_available_credits(user_id_param UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN COALESCE(
    (SELECT SUM(available_amount) 
     FROM public.credit_purchases 
     WHERE user_id = user_id_param 
       AND available_amount > 0 
       AND expiration_date > now()
    ), 0
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to use credits (FIFO - oldest first)
CREATE OR REPLACE FUNCTION public.use_credits(user_id_param UUID, credits_to_use INTEGER, description_param TEXT, photo_transformation_id_param UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  purchase_record RECORD;
  remaining_to_use INTEGER := credits_to_use;
  credits_to_use_from_purchase INTEGER;
BEGIN
  -- Check if user has enough credits
  IF public.get_user_available_credits(user_id_param) < credits_to_use THEN
    RETURN FALSE;
  END IF;

  -- Use credits from oldest purchases first
  FOR purchase_record IN 
    SELECT * FROM public.credit_purchases 
    WHERE user_id = user_id_param 
      AND available_amount > 0 
      AND expiration_date > now()
    ORDER BY purchase_date ASC
  LOOP
    IF remaining_to_use <= 0 THEN
      EXIT;
    END IF;

    -- Calculate how many credits to use from this purchase
    credits_to_use_from_purchase := LEAST(remaining_to_use, purchase_record.available_amount);
    
    -- Update the purchase record
    UPDATE public.credit_purchases 
    SET used_amount = used_amount + credits_to_use_from_purchase
    WHERE id = purchase_record.id;
    
    -- Record the usage
    INSERT INTO public.credit_usage_history (user_id, credit_purchase_id, amount_used, description, photo_transformation_id)
    VALUES (user_id_param, purchase_record.id, credits_to_use_from_purchase, description_param, photo_transformation_id_param);
    
    remaining_to_use := remaining_to_use - credits_to_use_from_purchase;
  END LOOP;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the create_initial_credits function to use the new structure
CREATE OR REPLACE FUNCTION public.create_initial_credits(user_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Create initial free credits with 30-day expiration
  INSERT INTO public.credit_purchases (user_id, amount, available_amount, purchase_type, expiration_date)
  VALUES (user_id_param, 2, 2, 'free', now() + interval '30 days');
  
  -- Also maintain backward compatibility with existing photo_credits table
  INSERT INTO public.photo_credits (user_id, total_purchased, total_used, available)
  VALUES (user_id_param, 2, 0, 2)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;