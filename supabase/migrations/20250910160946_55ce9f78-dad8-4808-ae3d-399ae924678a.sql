-- Migrate existing credits from photo_credits to credit_purchases
INSERT INTO public.credit_purchases (user_id, amount, used_amount, available_amount, purchase_date, expiration_date, purchase_type)
SELECT 
  user_id,
  total_purchased as amount,
  total_used as used_amount,
  available as available_amount,
  created_at as purchase_date,
  created_at + interval '30 days' as expiration_date,
  'free' as purchase_type
FROM public.photo_credits
WHERE user_id NOT IN (SELECT DISTINCT user_id FROM public.credit_purchases);

-- Add 10 credits purchase for amonepri@gmail.com user today
INSERT INTO public.credit_purchases (user_id, amount, used_amount, available_amount, purchase_date, expiration_date, purchase_type, order_reference)
VALUES (
  'f3b9571a-e5eb-4491-a32b-ec5fc5a37473',
  10,
  0,
  10,
  now(),
  now() + interval '30 days',
  'paid',
  'ORDER-' || extract(epoch from now())::text
);