-- Setup script for dance-critiques bucket
-- Run this in your Supabase SQL Editor

-- 1. Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('dance-critiques', 'dance-critiques', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public access for reading files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'dance-critiques');

-- 3. Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload dance critiques"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'dance-critiques');

-- 4. Allow authenticated users to update their own files
CREATE POLICY "Users can update own dance critiques"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'dance-critiques')
WITH CHECK (bucket_id = 'dance-critiques');

-- 5. Allow authenticated users to delete their own files
CREATE POLICY "Users can delete own dance critiques"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'dance-critiques');

-- 6. Check if the bucket was created successfully
SELECT * FROM storage.buckets WHERE id = 'dance-critiques';

-- 7. Check if policies were created successfully
SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%dance%';
