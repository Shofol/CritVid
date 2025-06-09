# Dance Critiques Bucket Upload Fix

## Issue Description

Videos were not saving to the "dance-critiques" bucket because:

1. **Missing Bucket Configuration**: The "dance-critiques" bucket was not defined in the storage configuration file (`src/lib/storage.ts`)
2. **Wrong Bucket Target**: The `uploadRecordedVideo` function was uploading to the "video-uploads" bucket instead of "dance-critiques"
3. **Hardcoded URL Reference**: The app had a hardcoded URL referencing the "dance-critiques" bucket in `PlaybackTrackerPageFixed.tsx` but no corresponding upload functionality

## Root Cause

Looking at the code structure:

- `src/lib/storage.ts` only defined two buckets: `VIDEO_UPLOADS_BUCKET = "video-uploads"` and `PROCESSED_CRITIQUES_BUCKET = "processed-critiques"`
- The `uploadRecordedVideo` function was uploading critique recordings to the "video-uploads" bucket
- However, there was a hardcoded reference to a "dance-critiques" bucket in the video URL

## Solution Implemented

### 1. Added Dance Critiques Bucket Configuration

**File**: `src/lib/storage.ts`

- Added `export const DANCE_CRITIQUES_BUCKET = "dance-critiques";`
- Updated `uploadRecordedVideo` function to upload to `DANCE_CRITIQUES_BUCKET` instead of `VIDEO_UPLOADS_BUCKET`
- Updated function comments to reflect the correct bucket usage

### 2. Updated Storage Management Interface

**File**: `src/pages/admin/StorageManagement.tsx`

- Added import for `DANCE_CRITIQUES_BUCKET`
- Added state variable `danceCritiqueFiles` to track files in the dance critiques bucket
- Updated `loadFiles` function to handle the new bucket
- Added a new card in the storage overview section for "Dance Critiques"
- Added a new tab in the file browser for "Dance Critiques"
- Changed grid layout from 3 columns to 4 columns to accommodate the new bucket

### 3. Function Behavior Changes

- **Before**: `uploadRecordedVideo()` saved critique recordings to "video-uploads" bucket
- **After**: `uploadRecordedVideo()` saves critique recordings to "dance-critiques" bucket

## Files Modified

1. `src/lib/storage.ts` - Added bucket constant and updated upload function
2. `src/pages/admin/StorageManagement.tsx` - Added management interface for new bucket

## Next Steps Required

### 1. Create the Supabase Bucket

The "dance-critiques" bucket needs to be created in your Supabase project:

```sql
-- In Supabase SQL Editor or Dashboard
INSERT INTO storage.buckets (id, name, public)
VALUES ('dance-critiques', 'dance-critiques', true);
```

### 2. Set Bucket Permissions

Ensure proper RLS policies are set for the bucket:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'dance-critiques');

-- Allow public read access if needed
CREATE POLICY "Allow public read" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'dance-critiques');
```

### 3. Test the Upload Functionality

1. Start a critique recording session
2. Stop the recording
3. Click "Upload to Cloud" button
4. Verify the file appears in the dance-critiques bucket in Supabase Storage

## Code Flow

1. User records a critique → `useUnifiedCritiqueScreenRecording` creates video blob
2. User clicks "Upload to Cloud" → `PlaybackTrackerFixed.handleUploadRecording()` is called
3. Function calls `uploadRecordedVideo(recordedVideoBlob)` from `src/lib/storage.ts`
4. Upload function now correctly uploads to "dance-critiques" bucket instead of "video-uploads"

## Verification

After creating the bucket in Supabase, the upload should work correctly and videos should appear in the "dance-critiques" bucket, which can be managed through the admin interface.
