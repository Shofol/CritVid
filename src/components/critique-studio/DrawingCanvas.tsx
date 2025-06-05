import React, { useRef, useEffect, useState } from 'react';

interface DrawingCanvasProps {
  containerRef: React.RefObject<HTMLDivElement>;
  isActive: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  isRecording: boolean;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  containerRef,
  isActive,
  videoRef,
  isRecording
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{x: number, y: number} | null>(null);
  const currentStrokeRef = useRef<ImageData | null>(null);
  const [currentPath, setCurrentPath] = useState<{x: number, y: number}[]>([]);

  // Set up canvas dimensions
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      
      if (canvas && container) {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [containerRef]);

  // Enhanced drawing with real-time visibility
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx || !isActive) return;

    // Configure drawing style for smooth curves
    ctx.strokeStyle = '#00FF00'; // Green
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = 'source-over';

    const getEventPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;
      
      if ('touches' in e) {
        const touch = e.touches[0] || e.changedTouches[0];
        clientX = touch.clientX;
        clientY = touch.clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      isDrawingRef.current = true;
      const pos = getEventPos(e);
      lastPointRef.current = pos;
      setCurrentPath([pos]);
      
      // Save canvas state before starting new stroke
      currentStrokeRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Start new path
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    };

    const continueDrawing = (e: MouseEvent | TouchEvent) => {
      if (!isDrawingRef.current || !lastPointRef.current) return;
      e.preventDefault();
      
      const currentPos = getEventPos(e);
      
      setCurrentPath(prev => {
        const newPath = [...prev, currentPos];
        
        // Clear canvas and restore previous state
        if (currentStrokeRef.current) {
          ctx.putImageData(currentStrokeRef.current, 0, 0);
        }
        
        // Redraw entire current stroke for smooth appearance
        if (newPath.length > 1) {
          ctx.strokeStyle = '#00FF00';
          ctx.lineWidth = 4;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          
          ctx.beginPath();
          ctx.moveTo(newPath[0].x, newPath[0].y);
          
          for (let i = 1; i < newPath.length; i++) {
            ctx.lineTo(newPath[i].x, newPath[i].y);
          }
          
          ctx.stroke();
        }
        
        return newPath;
      });
      
      lastPointRef.current = currentPos;
    };

    const stopDrawing = (e?: MouseEvent | TouchEvent) => {
      if (e) e.preventDefault();
      if (isDrawingRef.current) {
        ctx.closePath();
      }
      isDrawingRef.current = false;
      lastPointRef.current = null;
      setCurrentPath([]);
      currentStrokeRef.current = null;
    };

    // Mouse events
    const handleMouseDown = (e: MouseEvent) => startDrawing(e);
    const handleMouseMove = (e: MouseEvent) => continueDrawing(e);
    const handleMouseUp = (e: MouseEvent) => stopDrawing(e);
    const handleMouseLeave = () => stopDrawing();
    
    // Touch events
    const handleTouchStart = (e: TouchEvent) => startDrawing(e);
    const handleTouchMove = (e: TouchEvent) => continueDrawing(e);
    const handleTouchEnd = (e: TouchEvent) => stopDrawing(e);

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    
    // Add touch event listeners with passive: false to prevent scrolling
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });
    canvas.addEventListener("touchcancel", handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute top-0 left-0 w-full h-full ${
        isActive ? 'cursor-crosshair' : 'pointer-events-none'
      }`}
      style={{
        touchAction: 'none'
      }}
      data-testid="drawing-canvas"
    />
  );
};

export default DrawingCanvas;