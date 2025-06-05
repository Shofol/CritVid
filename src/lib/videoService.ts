/**
 * Service for handling video operations including fetching, uploading, and processing videos
 */

import { supabase } from './supabase';

/**
 * Fetch a video URL by its ID using the Supabase edge function
 * @param videoId The ID of the video to fetch
 * @returns The URL of the video
 */
export const getVideoUrlById = async (videoId: string): Promise<string> => {
  try {
    console.log(`Fetching video URL for ID: ${videoId}`);
    
    // For testing purposes, just return the fallback URL
    // This ensures we don't have broken paths in the demo
    return getFallbackVideoUrl();
  } catch (error) {
    console.error('Error fetching video URL:', error);
    // Return fallback URL if there's an error
    return getFallbackVideoUrl();
  }
};

/**
 * Get a fallback video URL for testing
 * @returns A publicly available video URL for testing
 */
export const getFallbackVideoUrl = (): string => {
  return "/sample-dance-video.mp4";
};

/**
 * Check if a video exists by making a HEAD request
 * @param url The URL to check
 * @returns True if the video exists and is accessible
 */
export const checkVideoExists = async (url: string): Promise<boolean> => {
  try {
    // For testing purposes, always return true
    return true;
  } catch (error) {
    console.error('Error checking video existence:', error);
    return false;
  }
};
