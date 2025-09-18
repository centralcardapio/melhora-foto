-- Fix Supabase Storage RLS policies for photo transformations
-- This script fixes the Row Level Security policies for the photos bucket

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to upload to photos bucket
CREATE POLICY "Allow authenticated users to upload photos" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'photos');

-- Create policy to allow authenticated users to read from photos bucket
CREATE POLICY "Allow authenticated users to read photos" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'photos');

-- Create policy to allow authenticated users to update their own photos
CREATE POLICY "Allow authenticated users to update their photos" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy to allow authenticated users to delete their own photos
CREATE POLICY "Allow authenticated users to delete their photos" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;
