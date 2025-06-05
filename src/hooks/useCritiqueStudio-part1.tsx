import { useState, useCallback, useRef, useEffect } from 'react';
import { useAudioRecorder } from './useAudioRecorder';
import { useVideoActions } from './useVideoActions';
import { CritiqueData, DrawingStroke, TimelineAction } from '@/types/critiqueStudio';
import { saveCritiqueRecording } from '@/lib/critiqueStorage';

interface CritiqueStudioOptions {
  videoId?: string;
  videoElement?: HTMLVideoElement | null;
}

interface CritiqueStudioState {
  isRecording: boolean;
  isPreviewMode: boolean;
  isDrawMode: boolean;
  currentColor: string;
  strokeWidth: number;
  drawings: DrawingStroke[];
  currentVideoTime: number;
  error: string | null;
}

export function useCritiqueStudio(options: CritiqueStudioOptions = {}) {
  // State for the critique studio
  const [state, setState] = useState<CritiqueStudioState>({
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

  // Update video reference if provided in options
  useEffect(() => {
    if (options.videoElement) {
      videoRef.current = options.videoElement;
    }
  }, [options.videoElement]);

  // Toggle draw mode
  const toggleDrawMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      isDrawMode: !prev.isDrawMode,
    }));
  }, []);

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