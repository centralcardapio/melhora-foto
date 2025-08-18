-- Create photo_credits table to track user photo credits
CREATE TABLE public.photo_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_purchased INTEGER NOT NULL DEFAULT 0,
  total_used INTEGER NOT NULL DEFAULT 0,
  available INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.photo_credits ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own credits
CREATE POLICY "Users can view their own photo credits" 
ON public.photo_credits 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy for users to update their own credits
CREATE POLICY "Users can update their own photo credits" 
ON public.photo_credits 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policy for inserting new photo credits
CREATE POLICY "Users can insert their own photo credits" 
ON public.photo_credits 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_photo_credits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  -- Recalculate available credits
  NEW.available = NEW.total_purchased - NEW.total_used;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp and available credits update
CREATE TRIGGER update_photo_credits_updated_at
BEFORE UPDATE ON public.photo_credits
FOR EACH ROW
EXECUTE FUNCTION public.update_photo_credits_updated_at();

-- Create function to initialize user credits
CREATE OR REPLACE FUNCTION public.initialize_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.photo_credits (user_id, total_purchased, total_used, available)
  VALUES (NEW.id, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create credits record when user signs up
CREATE TRIGGER on_auth_user_created_credits
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.initialize_user_credits();