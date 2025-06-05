import { useState, useCallback, useRef, useEffect } from 'react';
import { useAudioRecorder } from './useAudioRecorder';
import { useVideoActions } from './useVideoActions';
import { CritiqueData, DrawingStroke, TimelineAction } from '@/types/critiqueStudio';
import { saveCritiqueRecording } from '@/lib/critiqueStorage';

interface CritiqueStudioOptions {
  videoId?: string;
  videoElement?: HTMLVideoElement | null;
}

export function useCritiqueStudio(options: CritiqueStudioOptions = {}) {
  // State for the critique studio
  const [state, setState] = useState({
    isRecording: false,
    isPreviewMode: false,
    isDrawMode: false,
    currentColor: '#ff0000',
    strokeWidth: 3,
    drawings: [],
    currentVideoTime: 0,
    error: null
  });

  // Reference to the video element
  const videoRef = useRef<HTMLVideoElement | null>(options.videoElement || null);
  
  // Reference to the canvas element
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Drawing state
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef<DrawingStroke | null>(null);

  // Use the audio recorder hook
  const audioRecorder = useAudioRecorder({
    onError: (error) => {
      console.error('Audio recorder error:', error);
      setState(prev => ({ ...prev, error: `Audio recorder error: ${error.message}` }));
    }
  });
  
  // Use the video actions hook
  const { state: actionsState, controls: actionsControls } = useVideoActions({
    videoElement: videoRef.current,
  });

  // Request microphone permission explicitly before starting recording
  const requestMicrophonePermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // We immediately stop the stream as we only needed to request permission
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Microphone access is required. Please allow microphone access and try again.'
      }));
      return false;
    }
  }, []);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      // First explicitly request microphone permission
      const permissionGranted = await requestMicrophonePermission();
      if (!permissionGranted) {
        return;
      }
      
      // Start audio recording
      await audioRecorder.startRecording();
      
      // Start tracking video actions
      actionsControls.startRecording();
      
      // Update state
      setState(prev => ({
        ...prev,
        isRecording: true,
        isPreviewMode: false,
        error: null
      }));
    } catch (error) {
      console.error('Error starting recording:', error);
      setState(prev => ({ 
        ...prev, 
        error: `Error starting recording: ${error instanceof Error ? error.message : String(error)}` 
      }));
    }
  }, [audioRecorder, actionsControls, requestMicrophonePermission]);

  // Stop recording
  const stopRecording = useCallback(async () => {
    try {
      // Stop audio recording
      const audioBlob = await audioRecorder.stopRecording();
      
      // Stop tracking video actions
      actionsControls.stopRecording();
      
      // Update state
      setState(prev => ({
        ...prev,
        isRecording: false,
        error: null
      }));
      
      return audioBlob;
    } catch (error) {
      console.error('Error stopping recording:', error);
      setState(prev => ({ 
        ...prev, 
        error: `Error stopping recording: ${error instanceof Error ? error.message : String(error)}` 
      }));
      return null;
    }
  }, [audioRecorder, actionsControls]);

  // Simplified drawStrokes function
  const drawStrokes = useCallback(() => {
    // Simplified implementation
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Update current video time
  const updateCurrentTime = useCallback((time: number) => {
    setState(prev => ({ ...prev, currentVideoTime: time }));
  }, []);

  return {
    state,
    videoRef,
    canvasRef,
    audioState: audioRecorder.state,
    actionsState,
    startRecording,
    stopRecording,
    updateCurrentTime,
    drawStrokes
  };
}