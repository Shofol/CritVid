import { useState, useRef, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAudioRecorderBasic } from './useAudioRecorderBasic';
import { useVideoActions } from './useVideoActions';
import { useTimelineActions } from './useTimelineActions';
import { safeArrayAccess } from '@/lib/utils';

interface DrawAction {
  path: { x: number; y: number }[];
  timestamp: number;
  startTime: number;
  endTime: number;
  color: string;
  width: number;
  id?: string;
}

interface TimelineEvent {
  type: 'pause' | 'resume' | 'seek' | 'play';
  timestamp: number;
  time: number;
  duration?: number;
  id?: string;
}

interface CritiqueSession {
  videoUrl: string;
  audioUrl: string | null;
  drawActions: DrawAction[];
  videoActions: any[];
  timelineEvents: TimelineEvent[];
  createdAt: string;
  id: string;
}

export const useUnifiedCritiqueFixed = (videoRef: React.RefObject<HTMLVideoElement>, videoUrl: string) => {
  const { videoId } = useParams<{ videoId: string }>();
  const [drawActions, setDrawActionsState] = useState<DrawAction[]>([]);
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const cleanupRef = useRef<(() => void)[]>([]);
  
  const {
    isRecording,
    recordedAudioUrl,
    permissionStatus,
    errorMessage,
    requestMicrophonePermission,
    startRecording,
    stopRecording,
    clearRecording
  } = useAudioRecorderBasic({
    onError: (error) => {
      console.error('Audio recording error:', error);
      setIsDrawingEnabled(false);
      setIsInitializing(false);
    }
  });
  
  const { videoActions, addVideoAction, clearVideoActions } = useVideoActions();
  const { timelineEvents, addTimelineEvent, clearTimelineEvents } = useTimelineActions();

  // Cleanup function
  const performCleanup = useCallback(() => {
    console.log('🧹 Performing cleanup...');
    
    cleanupRef.current.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    });
    cleanupRef.current = [];
    
    setIsDrawingEnabled(false);
    setIsInitializing(false);
  }, []);

  useEffect(() => {
    return () => {
      performCleanup();
    };
  }, [performCleanup]);

  const addDrawAction = useCallback((action: DrawAction) => {
    if (!action || !isDrawingEnabled || !isRecording) {
      console.warn('⚠️ Cannot add draw action:', { action: !!action, isDrawingEnabled, isRecording });
      return;
    }
    
    const currentTime = videoRef.current?.currentTime || 0;
    
    // Enhanced action with proper timing for fade-out
    const enhancedAction = {
      ...action,
      id: action.id || `draw_${Date.now()}_${Math.random()}`,
      startTime: currentTime,
      endTime: currentTime + 1, // 1 second duration for fade-out
      timestamp: Date.now()
    };
    
    console.log('📝 Adding draw action with fade timing:', enhancedAction);
    setDrawActionsState(prev => safeArrayAccess([...safeArrayAccess(prev), enhancedAction]));
  }, [isDrawingEnabled, isRecording, videoRef]);

  const clearCanvas = useCallback(() => {
    console.log('🧹 Clearing visual canvas only (timeline preserved)');
  }, []);

  const handleVideoAction = useCallback((action: any) => {
    if (!videoRef.current || !action || !isRecording) return;
    
    const currentTime = videoRef.current.currentTime;
    const timestamp = Date.now();
    
    console.log('🎮 Video action:', action.type, 'at time:', currentTime);
    
    // Enhanced action with pause duration tracking for timeline simulation
    const enhancedAction = {
      type: action.type,
      time: currentTime,
      timestamp,
      duration: action.duration || (action.type === 'pause' ? 2 : 0), // Default 2s pause
      id: `${action.type}_${currentTime}_${timestamp}`,
      ...action
    };
    
    if (typeof addVideoAction === 'function') {
      addVideoAction(enhancedAction);
    }
    
    if (typeof addTimelineEvent === 'function') {
      addTimelineEvent(enhancedAction);
    }
  }, [addVideoAction, addTimelineEvent, isRecording, videoRef]);

  const startCritique = useCallback(async () => {
    if (isRecording || isInitializing) {
      console.warn('⚠️ Already recording or initializing');
      return;
    }
    
    setIsInitializing(true);
    console.log('🎬 Starting critique session');
    
    try {
      if (permissionStatus !== 'granted') {
        const hasPermission = await requestMicrophonePermission();
        if (!hasPermission) {
          setIsInitializing(false);
          throw new Error('Microphone permission required');
        }
      }
      
      // Clear previous data
      if (typeof clearVideoActions === 'function') clearVideoActions();
      if (typeof clearTimelineEvents === 'function') clearTimelineEvents();
      setDrawActionsState([]);
      if (typeof clearRecording === 'function') clearRecording();
      
      // Start audio recording
      await startRecording();
      console.log('🎤 Audio recording started successfully');
      
      // Enable drawing after successful audio start
      setIsDrawingEnabled(true);
      setIsInitializing(false);
      
    } catch (error) {
      console.error('❌ Failed to start critique:', error);
      setIsDrawingEnabled(false);
      setIsInitializing(false);
      throw error;
    }
  }, [isRecording, isInitializing, permissionStatus, requestMicrophonePermission, startRecording, clearVideoActions, clearTimelineEvents, clearRecording]);

  // Enhanced stopCritique with complete media cleanup
  const stopCritique = useCallback(async () => {
    if (!isRecording && !isInitializing) {
      console.warn('⚠️ No active recording to stop');
      return;
    }
    
    console.log('🛑 Stopping critique session - cleaning up all media');
    
    try {
      // Disable drawing immediately
      setIsDrawingEnabled(false);
      
      // Stop video if playing
      const video = videoRef.current;
      if (video && !video.paused) {
        video.pause();
        console.log('⏸️ Video paused');
      }
      
      // Stop audio recording
      if (isRecording) {
        await stopRecording();
        console.log('🎤 Audio recording stopped');
      }
      
      // Stop any ongoing audio playback
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach(audio => {
        if (!audio.paused) {
          audio.pause();
          console.log('🔇 Audio playback stopped');
        }
      });
      
      // Clear initialization state
      setIsInitializing(false);
      
      // Perform cleanup
      performCleanup();
      
      console.log('✅ All recording activities stopped successfully');
      
    } catch (error) {
      console.error('❌ Failed to stop critique:', error);
      setIsInitializing(false);
      performCleanup();
    }
  }, [isRecording, isInitializing, stopRecording, performCleanup, videoRef]);

  const saveDraft = useCallback(async () => {
    if (isRecording) {
      console.warn('⚠️ Cannot save while recording');
      return;
    }
    
    setIsSaving(true);
    console.log('💾 Saving critique draft with timeline data...');
    
    try {
      const session: CritiqueSession = {
        videoUrl,
        audioUrl: recordedAudioUrl,
        drawActions: safeArrayAccess(drawActions),
        videoActions: safeArrayAccess(videoActions),
        timelineEvents: safeArrayAccess(timelineEvents),
        createdAt: new Date().toISOString(),
        id: videoId || 'demo'
      };
      
      localStorage.setItem(`critique_draft_${videoId || 'demo'}`, JSON.stringify(session));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('✅ Critique draft saved with', {
        drawActions: session.drawActions.length,
        timelineEvents: session.timelineEvents.length,
        hasAudio: !!session.audioUrl
      });
    } catch (error) {
      console.error('❌ Failed to save critique draft:', error);
    } finally {
      setIsSaving(false);
    }
  }, [isRecording, drawActions, videoActions, timelineEvents, recordedAudioUrl, videoUrl, videoId]);

  const hasRecordedData = recordedAudioUrl || safeArrayAccess(drawActions).length > 0 || safeArrayAccess(videoActions).length > 0;

  return {
    isRecording: isRecording || isInitializing,
    recordedAudioUrl,
    drawActions: safeArrayAccess(drawActions),
    setDrawActions: addDrawAction,
    videoActions: safeArrayAccess(videoActions),
    timelineEvents: safeArrayAccess(timelineEvents),
    isDrawingEnabled,
    isSaving,
    hasRecordedData,
    permissionStatus,
    errorMessage,
    startCritique,
    stopCritique,
    saveDraft,
    handleVideoAction,
    clearCanvas
  };
};