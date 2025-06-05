/**
 * Mux API integration for video processing
 */

// Constants for Mux API
const MUX_API_URL = 'https://api.mux.com';

/**
 * Creates a new Mux upload URL for direct browser uploads
 * @param filename The name of the file to be uploaded
 * @returns The upload URL and ID
 */
export async function createMuxUploadUrl(filename: string) {
  try {
    // Use the Supabase function to create a Mux upload URL
    const response = await fetch(
      'https://tasowytszirhdvdiwuia.supabase.co/functions/v1/create-mux-upload',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create upload URL: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating Mux upload URL:', error);
    throw error;
  }
}

/**
 * Tracks the status of a Mux asset
 * @param assetId The Mux asset ID to track
 * @returns The current status of the asset
 */
export async function checkMuxAssetStatus(assetId: string) {
  try {
    const response = await fetch(
      'https://tasowytszirhdvdiwuia.supabase.co/functions/v1/check-mux-asset',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assetId }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to check asset status: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking Mux asset status:', error);
    throw error;
  }
}

/**
 * Gets a playback URL for a Mux asset
 * @param assetId The Mux asset ID
 * @returns The playback URL for the asset
 */
export async function getMuxPlaybackUrl(assetId: string) {
  try {
    const response = await fetch(
      'https://tasowytszirhdvdiwuia.supabase.co/functions/v1/get-mux-playback-url',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assetId }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get playback URL: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting Mux playback URL:', error);
    throw error;
  }
}
