import { useState, useCallback } from 'react';
import { safeArrayAccess } from '@/lib/utils';

interface VideoAction {
  type: 'pause' | 'play' | 'seek' | 'audio_start' | 'audio_stop';
  time: number;
  timestamp: number;
  duration?: number;
  fromTime?: number;
  toTime?: number;
}

export function useVideoActions() {
  const [videoActions, setVideoActions] = useState<VideoAction[]>([]);

  const addVideoAction = useCallback((action: VideoAction) => {
    if (!action || typeof action !== 'object') {
      console.warn('Invalid video action:', action);
      return;
    }
    
    console.log('📹 Adding video action:', action);
    setVideoActions(prev => {
      const safeActions = safeArrayAccess(prev);
      return [...safeActions, action];
    });
  }, []);

  const clearVideoActions = useCallback(() => {
    console.log('🧹 Clearing video actions');
    setVideoActions([]);
  }, []);

  return {
    videoActions: safeArrayAccess(videoActions),
    addVideoAction,
    clearVideoActions
  };
}