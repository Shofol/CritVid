/**
 * Utility for managing persistent test video in the video library
 */

import { supabase } from './supabase';
import { VIDEO_UPLOADS_BUCKET } from './storage';
import { VideoSubmissionExtended } from '@/types/videoLibrary';

// Constants
const TEST_VIDEO_KEY = 'persistent_test_video';
const TEST_VIDEO_PATH = '/sample-dance-video.mp4';

/**
 * Registers a test video in the user's library
 * @returns The registered test video object
 */
export async function registerTestVideo(): Promise<VideoSubmissionExtended> {
  // Check if we already have a test video in localStorage
  const existingTestVideo = localStorage.getItem(TEST_VIDEO_KEY);
  if (existingTestVideo) {
    return JSON.parse(existingTestVideo);
  }

  // Create a new test video entry
  const testVideo: VideoSubmissionExtended = {
    id: 'test-video-' + Date.now(),
    dancerId: 'current-user',
    title: 'Test Dance Routine',
    danceStyle: 'Contemporary',
    videoUrl: TEST_VIDEO_PATH,
    thumbnailUrl: '/placeholder.svg',
    feedbackRequested: 'This is a persistent test video for development',
    status: 'completed',
    createdAt: new Date().toISOString(),
    isTestVideo: true
  };

  // Store in localStorage for persistence
  localStorage.setItem(TEST_VIDEO_KEY, JSON.stringify(testVideo));

  // Try to upload to Supabase if available
  try {
    // Fetch the sample video file
    const response = await fetch(TEST_VIDEO_PATH);
    if (!response.ok) throw new Error('Failed to fetch sample video');
    
    const videoBlob = await response.blob();
    const videoFile = new File([videoBlob], 'sample-dance-video.mp4', { type: 'video/mp4' });
    
    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(VIDEO_UPLOADS_BUCKET)
      .upload(`test/${testVideo.id}.mp4`, videoFile, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (!error && data) {
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(VIDEO_UPLOADS_BUCKET)
        .getPublicUrl(`test/${testVideo.id}.mp4`);
      
      // Update the video URL
      testVideo.videoUrl = urlData.publicUrl;
      localStorage.setItem(TEST_VIDEO_KEY, JSON.stringify(testVideo));
    }
  } catch (error) {
    console.warn('Failed to upload test video to Supabase, using local path', error);
  }

  return testVideo;
}

/**
 * Gets the test video if it exists
 * @returns The test video or null if not found
 */
export function getTestVideo(): VideoSubmissionExtended | null {
  const testVideo = localStorage.getItem(TEST_VIDEO_KEY);
  return testVideo ? JSON.parse(testVideo) : null;
}

/**
 * Checks if a video is the test video
 * @param videoId The video ID to check
 * @returns True if it's the test video
 */
export function isTestVideo(videoId: string): boolean {
  const testVideo = getTestVideo();
  return testVideo ? testVideo.id === videoId : false;
}
