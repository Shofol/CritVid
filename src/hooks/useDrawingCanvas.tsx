import { useState, useRef, useCallback } from 'react';
import { DrawingState, DrawingStroke } from '@/types/critiqueStudio';

/**
 * Hook for managing a drawing canvas over a video
 */
export function useDrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawMode: false,
    currentColor: '#ff0000', // Default red
    strokeWidth: 3,
    strokes: [],
  });

  // Track current drawing state
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef<DrawingStroke | null>(null);

  // Toggle draw mode
  const toggleDrawMode = useCallback(() => {
    setDrawingState(prev => ({
      ...prev,
      isDrawMode: !prev.isDrawMode,
    }));
  }, []);

  // Set drawing color
  const setColor = useCallback((color: string) => {
    setDrawingState(prev => ({
      ...prev,
      currentColor: color,
    }));
  }, []);

  // Set stroke width
  const setStrokeWidth = useCallback((width: number) => {
    setDrawingState(prev => ({
      ...prev,
      strokeWidth: width,
    }));
  }, []);

  // Handle mouse down to start drawing
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>, currentTime: number) => {
      if (!drawingState.isDrawMode) return;

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
        color: drawingState.currentColor,
        width: drawingState.strokeWidth,
        timestamp: currentTime,
        duration: 5, // Default duration in seconds
      };
    },
    [drawingState.isDrawMode, drawingState.currentColor, drawingState.strokeWidth]
  );

  // Handle mouse move to continue drawing
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
    setDrawingState(prev => ({
      ...prev,
      strokes: [...prev.strokes, currentStrokeRef.current!],
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

    // Draw all saved strokes
    drawingState.strokes.forEach(stroke => {
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
  }, [drawingState.strokes]);

  // Filter strokes to show only those that should be visible at the current time
  const getVisibleStrokes = useCallback(
    (currentTime: number) => {
      return drawingState.strokes.filter(
        stroke => currentTime >= stroke.timestamp && currentTime <= stroke.timestamp + stroke.duration
      );
    },
    [drawingState.strokes]
  );

  // Clear all strokes
  const clearStrokes = useCallback(() => {
    setDrawingState(prev => ({
      ...prev,
      strokes: [],
    }));

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

  return {
    canvasRef,
    drawingState,
    toggleDrawMode,
    setColor,
    setStrokeWidth,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    drawStrokes,
    getVisibleStrokes,
    clearStrokes,
    resizeCanvas,
  };
}
