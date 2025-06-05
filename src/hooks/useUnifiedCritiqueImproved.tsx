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
  duration?: number;
  points?: { x: number; y: number }[];
  lineWidth?: number;
}

interface TimelineEvent {
  type: 'pause' | 'resume' | 'seek' | 'play';
  timestamp: number;
  time: number;
  duration?: number;
  id?: string;
  processed?: boolean;
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

export const useUnifiedCritiqueImproved = (videoRef: React.RefObject<HTMLVideoElement>, videoUrl: string) => {
  const { videoId } = useParams<{ videoId: string }>();
  const [drawActions, setDrawActionsState] = useState<DrawAction[]>([]);
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const cleanupRef = useRef<(() => void)[]>([]);
  const pauseStartTimeRef = useRef<number | null>(null);
  
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
    pauseStartTimeRef.current = null;
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
    
    const enhancedAction = {
      ...action,
      id: action.id || `draw_${Date.now()}_${Math.random()}`,
      startTime: currentTime,
      endTime: currentTime + 3, // 3 second duration for fade-out
      timestamp: currentTime,
      duration: 3,
      points: action.path || action.points || [],
      lineWidth: action.width || action.lineWidth || 3
    };
    
    console.log('📝 Adding draw action with enhanced timing:', enhancedAction);
    setDrawActionsState(prev => safeArrayAccess([...safeArrayAccess(prev), enhancedAction]));
  }, [isDrawingEnabled, isRecording, videoRef]);

  const handleVideoAction = useCallback((action: any) => {
    if (!videoRef.current || !action || !isRecording) return;
    
    const currentTime = videoRef.current.currentTime;
    const timestamp = Date.now();
    
    console.log('🎮 Video action:', action.type, 'at time:', currentTime);
    
    let duration = 0;
    
    if (action.type === 'pause') {
      pauseStartTimeRef.current = Date.now();
      duration = action.duration || 2000; // Default 2 seconds
    } else if (action.type === 'play' && pauseStartTimeRef.current) {
      duration = Date.now() - pauseStartTimeRef.current;
      pauseStartTimeRef.current = null;
    }
    
    const enhancedAction = {
      type: action.type,
      time: currentTime,
      timestamp: currentTime,
      duration,
      id: `${action.type}_${currentTime}_${timestamp}`,
      processed: false,
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
      
      if (typeof clearVideoActions === 'function') clearVideoActions();
      if (typeof clearTimelineEvents === 'function') clearTimelineEvents();
      setDrawActionsState([]);
      if (typeof clearRecording === 'function') clearRecording();
      pauseStartTimeRef.current = null;
      
      await startRecording();
      console.log('🎤 Audio recording started successfully');
      
      setIsDrawingEnabled(true);
      setIsInitializing(false);
      
    } catch (error) {
      console.error('❌ Failed to start critique:', error);
      setIsDrawingEnabled(false);
      setIsInitializing(false);
      throw error;
    }
  }, [isRecording, isInitializing, permissionStatus, requestMicrophonePermission, startRecording, clearVideoActions, clearTimelineEvents, clearRecording]);

  const stopCritique = useCallback(async () => {
    if (!isRecording && !isInitializing) {
      console.warn('⚠️ No active recording to stop');
      return;
    }
    
    console.log('🛑 Stopping critique session');
    
    try {
      setIsDrawingEnabled(false);
      
      const video = videoRef.current;
      if (video && !video.paused) {
        video.pause();
      }
      
      if (isRecording) {
        await stopRecording();
      }
      
      // Stop any audio elements
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach(audio => {
        if (!audio.paused) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
      
      setIsInitializing(false);
      performCleanup();
      
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
    console.log('💾 Saving critique draft...');
    
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
      console.log('✅ Critique draft saved');
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
    handleVideoAction
  };
};