-- Create user_styles table to store selected style for each user
CREATE TABLE public.user_styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  selected_style TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_styles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own style" ON public.user_styles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own style" ON public.user_styles
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own style" ON public.user_styles
FOR UPDATE USING (auth.uid() = user_id);

-- Create unique constraint to ensure one style per user
ALTER TABLE public.user_styles ADD CONSTRAINT unique_user_style UNIQUE (user_id);