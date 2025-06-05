import React, { useRef, useEffect, useState } from 'react';
import { Point, DrawingPath, TimestampedDrawing } from '@/types/drawingTypes';
import DrawingDurationControl from './DrawingDurationControl';

interface DrawingCanvasProps {
  isDrawing: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ isDrawing, videoRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawingActive, setIsDrawingActive] = useState(false);
  const [drawingData, setDrawingData] = useState<TimestampedDrawing>({ paths: [] });
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [currentColor, setCurrentColor] = useState('#00FF00');
  const [lineWidth, setLineWidth] = useState(4);
  const [drawingDuration, setDrawingDuration] = useState(5);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const currentStrokeRef = useRef<ImageData | null>(null);

  // Setup canvas to match video size
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const resizeCanvas = () => {
      const rect = video.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        contextRef.current = ctx;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = lineWidth;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(video);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      observer.disconnect();
    };
  }, [videoRef, currentColor, lineWidth]);

  // Enhanced drawing with real-time visibility
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || !isDrawing) return;

    const ctx = contextRef.current;
    if (!ctx) return;

    const getEventPos = (e: MouseEvent | TouchEvent): Point => {
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
      const pos = getEventPos(e);
      setIsDrawingActive(true);
      setCurrentPath([pos]);
      
      // Save canvas state before starting new stroke
      currentStrokeRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Configure drawing style
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalCompositeOperation = 'source-over';
      
      // Start new path
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    };

    const continueDrawing = (e: MouseEvent | TouchEvent) => {
      if (!isDrawingActive) return;
      e.preventDefault();
      
      const pos = getEventPos(e);
      setCurrentPath(prev => {
        const newPath = [...prev, pos];
        
        // Clear canvas and restore previous state
        if (currentStrokeRef.current) {
          ctx.putImageData(currentStrokeRef.current, 0, 0);
        }
        
        // Redraw entire current stroke for smooth appearance
        if (newPath.length > 1) {
          ctx.strokeStyle = currentColor;
          ctx.lineWidth = lineWidth;
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
    };

    const finishDrawing = (e?: MouseEvent | TouchEvent) => {
      if (e) e.preventDefault();
      
      if (currentPath.length < 2 || !video) {
        setIsDrawingActive(false);
        setCurrentPath([]);
        currentStrokeRef.current = null;
        return;
      }

      const newPath: DrawingPath = {
        points: currentPath,
        color: currentColor,
        width: lineWidth,
        timestamp: video.currentTime,
        duration: drawingDuration,
      };

      const updatedData = { paths: [...drawingData.paths, newPath] };
      setDrawingData(updatedData);
      localStorage.setItem(`drawing_${video.src}`, JSON.stringify(updatedData));

      setIsDrawingActive(false);
      setCurrentPath([]);
      currentStrokeRef.current = null;
    };

    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', continueDrawing);
    canvas.addEventListener('mouseup', finishDrawing);
    canvas.addEventListener('mouseleave', finishDrawing);
    
    // Touch events
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', continueDrawing, { passive: false });
    canvas.addEventListener('touchend', finishDrawing, { passive: false });
    canvas.addEventListener('touchcancel', finishDrawing, { passive: false });

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', continueDrawing);
      canvas.removeEventListener('mouseup', finishDrawing);
      canvas.removeEventListener('mouseleave', finishDrawing);
      
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', continueDrawing);
      canvas.removeEventListener('touchend', finishDrawing);
      canvas.removeEventListener('touchcancel', finishDrawing);
    };
  }, [isDrawing, isDrawingActive, currentPath, currentColor, lineWidth, drawingData, drawingDuration, videoRef]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-10 pointer-events-auto"
        style={{ 
          touchAction: 'none',
          opacity: 1,
          backgroundColor: 'transparent'
        }}
      />
      {isDrawing && (
        <div className="absolute bottom-4 left-4 z-20 bg-black/60 text-white p-2 rounded">
          <DrawingDurationControl 
            duration={drawingDuration} 
            onChange={(value) => setDrawingDuration(value)} 
          />
        </div>
      )}
    </div>
  );
};

export default DrawingCanvas;