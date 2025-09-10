-- Fix security warnings by setting search_path on functions
CREATE OR REPLACE FUNCTION public.update_credit_purchase_available()
RETURNS TRIGGER AS $$
BEGIN
  NEW.available_amount = NEW.amount - NEW.used_amount;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;