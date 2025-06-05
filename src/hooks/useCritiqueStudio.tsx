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

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      // Start audio recording
      await audioRecorder.startRecording();
      
      // Start tracking video actions
      actionsControls.startRecording();
      
      // Update state
      setState(prev => ({
        ...prev,
        isRecording: true,
        isPreviewMode: false,
      }));
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error; // Re-throw to allow handling in the component
    }
  }, [audioRecorder, actionsControls]);

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
      }));
      
      return audioBlob;
    } catch (error) {
      console.error('Error stopping recording:', error);
      return null;
    }
  }, [audioRecorder, actionsControls]);

  // Save critique
  const saveCritique = useCallback(async () => {
    if (!options.videoId) {
      console.error('Cannot save critique: No video ID provided');
      return null;
    }
    
    try {
      // Create critique data object
      const critiqueData: CritiqueData = {
        videoId: options.videoId,
        audioBlob: audioRecorder.state.audioBlob,
        drawings: state.drawings,
        timelineActions: actionsState.actions as unknown as TimelineAction[],
        duration: audioRecorder.state.elapsedTime / 1000, // Convert ms to seconds
        createdAt: Date.now(),
      };
      
      // Save to backend
      const critiqueId = await saveCritiqueRecording(options.videoId, critiqueData);
      
      return critiqueId;
    } catch (error) {
      console.error('Error saving critique:', error);
      return null;
    }
  }, [options.videoId, audioRecorder.state, state.drawings, actionsState.actions]);

  // Enter preview mode
  const startPreview = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPreviewMode: true,
      isRecording: false,
    }));
    
    // Reset video to beginning
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(err => console.error('Error playing video:', err));
    }
  }, []);

  // Exit preview mode
  const stopPreview = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPreviewMode: false,
    }));
  }, []);

  // Handle drawing on canvas
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!state.isDrawMode) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      isDrawingRef.current = true;

      // Get canvas position relative to viewport
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // Create a new stroke
      currentStrokeRef.current = {
        points: [{ x, y }],
        color: state.currentColor,
        width: state.strokeWidth,
        timestamp: state.currentVideoTime,
        duration: 5, // Default duration in seconds
      };
    },
    [state.isDrawMode, state.currentColor, state.strokeWidth, state.currentVideoTime]
  );

  // Handle mouse move while drawing
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawingRef.current || !currentStrokeRef.current) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      // Get canvas position
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // Add point to current stroke
      currentStrokeRef.current.points.push({ x, y });

      // Redraw canvas
      drawStrokes();
    },
    []
  );

  // Handle mouse up to finish drawing
  const handleMouseUp = useCallback(() => {
    if (!isDrawingRef.current || !currentStrokeRef.current) return;

    // Add the completed stroke to the state
    setState(prev => ({
      ...prev,
      drawings: [...prev.drawings, currentStrokeRef.current!],
    }));

    // Reset drawing state
    isDrawingRef.current = false;
    currentStrokeRef.current = null;
  }, []);

  // Draw all strokes on the canvas
  const drawStrokes = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get visible strokes based on current video time
    const visibleStrokes = state.isPreviewMode
      ? state.drawings.filter(
          stroke => state.currentVideoTime >= stroke.timestamp && 
                   state.currentVideoTime <= stroke.timestamp + stroke.duration
        )
      : state.drawings;

    // Draw all visible strokes
    visibleStrokes.forEach(stroke => {
      if (stroke.points.length < 2) return;

      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      // Scale points to canvas size
      const startX = stroke.points[0].x * canvas.width;
      const startY = stroke.points[0].y * canvas.height;
      ctx.moveTo(startX, startY);

      for (let i = 1; i < stroke.points.length; i++) {
        const x = stroke.points[i].x * canvas.width;
        const y = stroke.points[i].y * canvas.height;
        ctx.lineTo(x, y);
      }

      ctx.stroke();
    });

    // Draw current stroke if exists
    if (currentStrokeRef.current && currentStrokeRef.current.points.length > 1) {
      const stroke = currentStrokeRef.current;
      
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      // Scale points to canvas size
      const startX = stroke.points[0].x * canvas.width;
      const startY = stroke.points[0].y * canvas.height;
      ctx.moveTo(startX, startY);

      for (let i = 1; i < stroke.points.length; i++) {
        const x = stroke.points[i].x * canvas.width;
        const y = stroke.points[i].y * canvas.height;
        ctx.lineTo(x, y);
      }

      ctx.stroke();
    }
  }, [state.drawings, state.currentVideoTime, state.isPreviewMode]);

  // Update current video time
  const updateCurrentTime = useCallback((time: number) => {
    setState(prev => ({
      ...prev,
      currentVideoTime: time,
    }));
  }, []);

  // Clear all drawings
  const clearDrawings = useCallback(() => {
    setState(prev => ({
      ...prev,
      drawings: [],
    }));

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Undo last drawing
  const undoLastDrawing = useCallback(() => {
    setState(prev => ({
      ...prev,
      drawings: prev.drawings.slice(0, -1),
    }));

    drawStrokes();
  }, [drawStrokes]);

  // Set drawing color
  const setColor = useCallback((color: string) => {
    setState(prev => ({
      ...prev,
      currentColor: color,
    }));
  }, []);

  // Set stroke width
  const setStrokeWidth = useCallback((width: number) => {
    setState(prev => ({
      ...prev,
      strokeWidth: width,
    }));
  }, []);

  // Resize canvas to match container
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    drawStrokes();
  }, [drawStrokes]);

  // Effect to update canvas when video time changes
  useEffect(() => {
    if (state.isPreviewMode) {
      drawStrokes();
    }
  }, [state.currentVideoTime, state.isPreviewMode, drawStrokes]);

  return {
    state,
    videoRef,
    canvasRef,
    audioState: audioRecorder.state,
    actionsState,
    toggleDrawMode,
    startRecording,
    stopRecording,
    saveCritique,
    startPreview,
    stopPreview,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    drawStrokes,
    updateCurrentTime,
    clearDrawings,
    undoLastDrawing,
    setColor,
    setStrokeWidth,
    resizeCanvas,
  };
}
