-- Development setup for dance-critiques bucket (allows anonymous uploads)
-- Run this in your Supabase SQL Editor for development/testing

-- 1. Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('dance-critiques', 'dance-critiques', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public access for reading files
CREATE POLICY "Public read access to dance critiques"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'dance-critiques');

-- 3. Allow public uploads (for development/demo purposes)
CREATE POLICY "Public upload access to dance critiques"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'dance-critiques');

-- 4. Allow public updates (for development/demo purposes)
CREATE POLICY "Public update access to dance critiques"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'dance-critiques')
WITH CHECK (bucket_id = 'dance-critiques');

-- 5. Allow public deletes (for development/demo purposes)
CREATE POLICY "Public delete access to dance critiques"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'dance-critiques');

-- 6. Check if the bucket was created successfully
SELECT * FROM storage.buckets WHERE id = 'dance-critiques';

-- 7. Check if policies were created successfully
SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%dance%';
