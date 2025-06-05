/**
 * Service for storing and retrieving critique recordings
 */

import { CritiqueData } from '@/types/critiqueStudio';

// Mock function to save critique data to localStorage
export const saveCritique = (critiqueData: CritiqueData): Promise<string> => {
  return new Promise((resolve) => {
    // Generate a simple ID for the critique
    const id = `critique_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // Store the critique data in localStorage
    try {
      // Convert audioBlob to base64 string for storage
      if (critiqueData.audioBlob) {
        const reader = new FileReader();
        reader.readAsDataURL(critiqueData.audioBlob);
        reader.onloadend = () => {
          // Replace the Blob with the URL in the stored version
          const storableData = {
            ...critiqueData,
            audioUrl: reader.result as string,
            audioBlob: undefined // Remove the Blob as it can't be stored in JSON
          };
          
          localStorage.setItem(`critique_${id}`, JSON.stringify(storableData));
          console.log('Critique saved successfully:', id);
          resolve(id);
        };
      } else {
        // If no audio blob, just store the data directly
        localStorage.setItem(`critique_${id}`, JSON.stringify(critiqueData));
        console.log('Critique saved successfully (no audio):', id);
        resolve(id);
      }
    } catch (error) {
      console.error('Error saving critique:', error);
      resolve(id); // Still return the ID even if there was an error
    }
  });
};

// Mock function to get critique data from localStorage
export const getCritique = async (id: string): Promise<CritiqueData | null> => {
  try {
    const data = localStorage.getItem(`critique_${id}`);
    if (!data) return null;
    
    const parsedData = JSON.parse(data) as CritiqueData;
    
    // Convert base64 audio back to Blob if needed
    if (parsedData.audioUrl && parsedData.audioUrl.startsWith('data:')) {
      const response = await fetch(parsedData.audioUrl);
      const blob = await response.blob();
      parsedData.audioBlob = blob;
    }
    
    return parsedData;
  } catch (error) {
    console.error('Error retrieving critique:', error);
    return null;
  }
};

// Get all saved critiques
export const getAllCritiques = (): Promise<CritiqueData[]> => {
  return new Promise((resolve) => {
    const critiques: CritiqueData[] = [];
    
    try {
      // Iterate through localStorage to find all critiques
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('critique_')) {
          const data = localStorage.getItem(key);
          if (data) {
            const parsedData = JSON.parse(data) as CritiqueData;
            critiques.push(parsedData);
          }
        }
      }
    } catch (error) {
      console.error('Error retrieving all critiques:', error);
    }
    
    resolve(critiques);
  });
};

// Delete a critique
export const deleteCritique = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      localStorage.removeItem(`critique_${id}`);
      resolve(true);
    } catch (error) {
      console.error('Error deleting critique:', error);
      resolve(false);
    }
  });
};

// Function to save critique recording with video ID
export const saveCritiqueRecording = async (videoId: string, data: any): Promise<string> => {
  console.log('Saving critique recording for video:', videoId, data);
  return saveCritique({
    videoId,
    ...data,
    timestamp: Date.now(),
  });
};

// Function to save audio blob
export const saveAudioBlob = async (videoId: string, blob: Blob): Promise<string> => {
  console.log('Saving audio blob for video:', videoId, 'size:', blob.size);
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  // In a real app, you would upload this to storage
  // For now, we'll just return the URL
  return url;
};

// Function to get critique recording
export const getCritiqueRecording = async (id: string): Promise<any> => {
  console.log('Getting critique recording:', id);
  return getCritique(id);
};
