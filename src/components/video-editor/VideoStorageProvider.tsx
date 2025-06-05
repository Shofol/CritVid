import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { saveCritique, getCritique, CritiqueStorageData } from '@/lib/critiqueStorage';
import { TimestampedDrawing } from '@/types/drawingTypes';
import { debugAudioStorage } from '@/lib/audioStorage';

interface VideoStorageContextType {
  saveCritiqueToCloud: (videoId: string, audioBlob?: Blob, drawingData?: TimestampedDrawing) => Promise<CritiqueStorageData>;
  loadCritiqueFromCloud: (videoId: string) => Promise<CritiqueStorageData | null>;
  currentCritique: CritiqueStorageData | null;
  isLoading: boolean;
  error: string | null;
  storageStatus: {
    localStorage: boolean;
    sessionStorage: boolean;
    memoryCache: boolean;
  };
}

const VideoStorageContext = createContext<VideoStorageContextType | undefined>(undefined);

export const useVideoStorage = () => {
  const context = useContext(VideoStorageContext);
  if (context === undefined) {
    throw new Error('useVideoStorage must be used within a VideoStorageProvider');
  }
  return context;
};

interface VideoStorageProviderProps {
  children: ReactNode;
  userId?: string;
}

// Check if storage is available
const checkStorageAvailability = () => {
  const storageStatus = {
    localStorage: false,
    sessionStorage: false,
    memoryCache: true // Memory cache is always available
  };
  
  // Test localStorage
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    storageStatus.localStorage = true;
  } catch (e) {
    console.warn('localStorage is not available:', e);
  }
  
  // Test sessionStorage
  try {
    const testKey = '__storage_test__';
    sessionStorage.setItem(testKey, testKey);
    sessionStorage.removeItem(testKey);
    storageStatus.sessionStorage = true;
  } catch (e) {
    console.warn('sessionStorage is not available:', e);
  }
  
  return storageStatus;
};

export const VideoStorageProvider: React.FC<VideoStorageProviderProps> = ({ children, userId }) => {
  const [currentCritique, setCurrentCritique] = useState<CritiqueStorageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storageStatus, setStorageStatus] = useState(() => checkStorageAvailability());

  // Check storage availability on mount
  useEffect(() => {
    setStorageStatus(checkStorageAvailability());
  }, []);

  const saveCritiqueToCloud = async (
    videoId: string,
    audioBlob?: Blob,
    drawingData?: TimestampedDrawing
  ): Promise<CritiqueStorageData> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Saving critique for video ${videoId}`, {
        hasAudio: !!audioBlob,
        audioSize: audioBlob?.size,
        hasDrawing: !!drawingData,
        storageStatus
      });
      
      const result = await saveCritique(videoId, audioBlob, drawingData, userId);
      setCurrentCritique(result);
      
      // Debug storage after save
      if (audioBlob) {
        debugAudioStorage(videoId);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error saving critique';
      console.error('Error in saveCritiqueToCloud:', errorMessage);
      setError(errorMessage);
      
      // Return a minimal object even on error to prevent crashes
      return {
        videoId,
        createdAt: new Date().toISOString(),
        userId
      };
    } finally {
      setIsLoading(false);
    }
  };

  const loadCritiqueFromCloud = async (videoId: string): Promise<CritiqueStorageData | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Loading critique for video ${videoId}`, { storageStatus });
      
      // Debug storage before load
      debugAudioStorage(videoId);
      
      const result = await getCritique(videoId, userId);
      setCurrentCritique(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error loading critique';
      console.error('Error in loadCritiqueFromCloud:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    saveCritiqueToCloud,
    loadCritiqueFromCloud,
    currentCritique,
    isLoading,
    error,
    storageStatus
  };

  return (
    <VideoStorageContext.Provider value={value}>
      {children}
    </VideoStorageContext.Provider>
  );
};
