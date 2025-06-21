-- RLS Policy for video-uploads bucket - READ ONLY ACCESS
-- This policy gives READ-ONLY access to all authenticated users to the video-uploads bucket and all its folders

-- NOTE: This script should be run in the Supabase Dashboard SQL Editor
-- Make sure you're logged in as a superuser or have the necessary permissions

-- First, check if RLS is already enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'storage' AND tablename = 'objects';

-- Enable RLS on the storage.objects table if not already enabled
-- Note: This might require superuser privileges
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies for the video-uploads bucket to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users to view video uploads" ON storage.objects;

-- Policy for SELECT (download/view) access only
CREATE POLICY "Allow authenticated users to view video uploads" ON storage.objects
    FOR SELECT
    USING (
        bucket_id = 'video-uploads'
        AND auth.role() = 'authenticated'
    );

-- Verify the policy was created
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
AND policyname LIKE '%video%';

-- Alternative approach: If the above doesn't work, you can also set bucket policies
-- through the Supabase Dashboard or use the storage API

-- Check current bucket policies
SELECT * FROM storage.buckets WHERE id = 'video-uploads';
