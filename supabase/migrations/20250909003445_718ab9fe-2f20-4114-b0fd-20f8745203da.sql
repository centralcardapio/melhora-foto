-- Create table for storing photo transformations
CREATE TABLE public.photo_transformations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  original_image_url text NOT NULL,
  original_image_name text NOT NULL,
  transformed_images jsonb NOT NULL DEFAULT '[]', -- Array of transformed image URLs and metadata
  status text NOT NULL DEFAULT 'processing', -- processing, completed, failed
  feedback jsonb DEFAULT '{}', -- User feedback for each transformation
  reprocessing_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.photo_transformations ENABLE ROW LEVEL SECURITY;

-- Create policies for photo_transformations
CREATE POLICY "Users can view their own photo transformations" 
ON public.photo_transformations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own photo transformations" 
ON public.photo_transformations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own photo transformations" 
ON public.photo_transformations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photo transformations" 
ON public.photo_transformations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_photo_transformations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_photo_transformations_updated_at
BEFORE UPDATE ON public.photo_transformations
FOR EACH ROW
EXECUTE FUNCTION public.update_photo_transformations_updated_at();