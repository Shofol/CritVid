/**
 * Service for handling audio recordings storage and conversion
 */

import { supabase } from './supabase';

/**
 * Check if critique data exists for a video
 * @param videoId The ID of the video to check
 * @returns Boolean indicating if critique data exists
 */
export const hasCritiqueData = (videoId: string): boolean => {
  // Check local storage for critique data
  const audioKey = `critique_audio_${videoId}`;
  const drawingKey = `critique_drawings_${videoId}`;
  return localStorage.getItem(audioKey) !== null || localStorage.getItem(drawingKey) !== null;
};

/**
 * Retrieve audio data for a video
 * @param videoId The ID of the video
 * @returns URL of the audio recording or null if not found
 */
export const retrieveAudioData = (videoId: string): string | null => {
  const audioKey = `critique_audio_${videoId}`;
  return localStorage.getItem(audioKey);
};

/**
 * Get drawing data for a video
 * @param videoId The ID of the video
 * @returns Drawing data object or null if not found
 */
export const getDrawingData = (videoId: string): any | null => {
  const drawingKey = `critique_drawings_${videoId}`;
  const data = localStorage.getItem(drawingKey);
  return data ? JSON.parse(data) : null;
};

/**
 * Convert a Blob to base64 string
 * @param blob The blob to convert
 * @returns Promise resolving to base64 string
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:audio/webm;base64,")
      const base64 = base64String.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Save audio recording to the backend
 * @param videoId The ID of the video being critiqued
 * @param audioBlob The audio blob to save
 * @returns Promise resolving to the audio URL
 */
export const saveAudioRecording = async (videoId: string, audioBlob: Blob): Promise<string> => {
  try {
    if (!audioBlob) {
      throw new Error('No audio blob provided');
    }
    
    console.log(`Saving audio recording for video ID: ${videoId}, size: ${audioBlob.size} bytes`);
    
    // Convert blob to base64 for API transport
    const audioBase64 = await blobToBase64(audioBlob);
    
    // Call the Supabase function to save the critique recording
    const response = await fetch(
      'https://tasowytszirhdvdiwuia.supabase.co/functions/v1/f75ac083-a74d-42fa-839b-977997362947',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId,
          audioBase64,
          timestamp: Date.now(),
        }),
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to save audio recording: ${errorText}`);
    }
    
    const data = await response.json();
    return data.id;
    
  } catch (error) {
    console.error('Error saving audio recording:', error);
    throw error;
  }
};

/**
 * Store audio data and return a URL
 * @param audioBlob The audio blob to store
 * @param videoId The ID of the video being critiqued
 * @returns Promise resolving to the audio URL
 */
export const storeAudioData = async (audioBlob: Blob, videoId: string): Promise<string> => {
  return await saveAudioRecording(videoId, audioBlob);
};

/**
 * Debug function to check audio storage
 * @param videoId The video ID to check
 */
export const debugAudioStorage = (videoId: string): void => {
  console.log(`Debugging audio storage for video ID: ${videoId}`);
  // Additional debug logic could be added here
};
