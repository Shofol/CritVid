import { supabase } from './supabase';

interface AudioStorageResult {
  previewId: string;
  rawId: string;
}

/**
 * Convert a Blob to base64 string
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64 = base64String.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Save both preview and raw audio recordings using existing function
 */
export const saveDualAudioRecordings = async (
  videoId: string,
  previewBlob: Blob,
  rawBlob: Blob
): Promise<AudioStorageResult> => {
  try {
    console.log(`Saving dual audio for video ID: ${videoId}`);
    console.log(`Preview size: ${previewBlob.size} bytes, Raw size: ${rawBlob.size} bytes`);
    
    const [previewBase64, rawBase64] = await Promise.all([
      blobToBase64(previewBlob),
      blobToBase64(rawBlob)
    ]);
    
    // Save preview audio (for muxing with video)
    const previewResponse = await fetch(
      'https://tasowytszirhdvdiwuia.supabase.co/functions/v1/f75ac083-a74d-42fa-839b-977997362947',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId,
          audioBase64: previewBase64,
          timestamp: Date.now(),
          audioType: 'preview'
        })
      }
    );
    
    if (!previewResponse.ok) {
      throw new Error(`Failed to save preview audio: ${await previewResponse.text()}`);
    }
    
    // Save raw audio (for AI transcription)
    const rawResponse = await fetch(
      'https://tasowytszirhdvdiwuia.supabase.co/functions/v1/f75ac083-a74d-42fa-839b-977997362947',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId,
          audioBase64: rawBase64,
          timestamp: Date.now(),
          audioType: 'raw'
        })
      }
    );
    
    if (!rawResponse.ok) {
      throw new Error(`Failed to save raw audio: ${await rawResponse.text()}`);
    }
    
    const previewData = await previewResponse.json();
    const rawData = await rawResponse.json();
    
    return {
      previewId: previewData.id,
      rawId: rawData.id
    };
    
  } catch (error) {
    console.error('Error saving dual audio recordings:', error);
    throw error;
  }
};

/**
 * Retrieve preview audio for playback
 */
export const getPreviewAudio = async (videoId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('critiques')
      .select('audio_url')
      .eq('video_id', videoId)
      .eq('audio_type', 'preview')
      .single();
    
    if (error) {
      console.error('Error fetching preview audio:', error);
      return null;
    }
    
    return data?.audio_url || null;
  } catch (error) {
    console.error('Error getting preview audio:', error);
    return null;
  }
};

/**
 * Retrieve raw audio for AI processing
 */
export const getRawAudio = async (videoId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('critiques')
      .select('audio_url')
      .eq('video_id', videoId)
      .eq('audio_type', 'raw')
      .single();
    
    if (error) {
      console.error('Error fetching raw audio:', error);
      return null;
    }
    
    return data?.audio_url || null;
  } catch (error) {
    console.error('Error getting raw audio:', error);
    return null;
  }
};

/**
 * Check if dual audio exists for a video
 */
export const hasDualAudioData = async (videoId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('critiques')
      .select('id')
      .eq('video_id', videoId)
      .in('audio_type', ['preview', 'raw']);
    
    if (error) {
      console.error('Error checking dual audio data:', error);
      return false;
    }
    
    return (data?.length || 0) >= 2;
  } catch (error) {
    console.error('Error checking dual audio data:', error);
    return false;
  }
};