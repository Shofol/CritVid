import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { safeArrayAccess } from '@/lib/utils';

interface DrawingCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasSize: { width: number; height: number };
  drawColor: string;
  drawWidth: number;
  setDrawColor: (color: string) => void;
  setDrawWidth: (width: number) => void;
  isDrawingEnabled: boolean;
  addDrawAction: (action: any) => void;
  handleClearCanvas: () => void;
  updateCanvasSize: () => void;
}

interface DrawAction {
  path: { x: number; y: number }[];
  timestamp: number;
  startTime: number;
  endTime: number;
  color: string;
  width: number;
  id: string;
}

const DRAWING_FADE_DURATION = 1; // 1 second auto-fade

const PlaybackTrackerDrawing: React.FC<DrawingCanvasProps> = ({
  canvasRef,
  videoRef,
  canvasSize,
  drawColor,
  drawWidth,
  setDrawColor,
  setDrawWidth,
  isDrawingEnabled,
  addDrawAction,
  handleClearCanvas,
  updateCanvasSize
}) => {
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [liveDrawings, setLiveDrawings] = useState<DrawAction[]>([]);
  const cleanupRef = useRef<(() => void)[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const isDrawingRef = useRef(false);

  // Cleanup function
  const performCleanup = useCallback(() => {
    console.log('🧹 Cleaning up drawing canvas...');
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    cleanupRef.current.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        console.error('Drawing cleanup error:', error);
      }
    });
    cleanupRef.current = [];
    
    setIsDrawing(false);
    setCurrentPath([]);
    isDrawingRef.current = false;
  }, []);

  useEffect(() => {
    if (!isDrawingEnabled) {
      performCleanup();
    }
    
    return () => {
      performCleanup();
    };
  }, [isDrawingEnabled, performCleanup]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedMetadata = () => updateCanvasSize();
      const handleResize = () => updateCanvasSize();
      
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('resize', handleResize);
      window.addEventListener('resize', handleResize);
      
      cleanupRef.current.push(() => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('resize', handleResize);
        window.removeEventListener('resize', handleResize);
      });
      
      if (video.readyState >= 1) {
        updateCanvasSize();
      }
    }
  }, [videoRef, updateCanvasSize]);

  // Auto-fade animation with lifespan management
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || !isDrawingEnabled) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderDrawings = () => {
      if (!isDrawingEnabled) return;
      
      try {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const currentTime = video.currentTime;
        
        liveDrawings.forEach((drawing) => {
          if (!drawing || !Array.isArray(drawing.path) || drawing.path.length === 0) return;
          
          // Check if drawing is within its lifespan
          if (currentTime >= drawing.startTime && currentTime <= drawing.endTime) {
            // Calculate fade based on time remaining
            const timeRemaining = drawing.endTime - currentTime;
            const fadeProgress = timeRemaining / DRAWING_FADE_DURATION;
            const opacity = Math.max(0.1, Math.min(1, fadeProgress));
            
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = drawing.color || '#ff0000';
            ctx.lineWidth = drawing.width || 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            const firstPoint = drawing.path[0];
            if (firstPoint) {
              ctx.beginPath();
              ctx.moveTo(firstPoint.x, firstPoint.y);
              
              for (let i = 1; i < drawing.path.length; i++) {
                const point = drawing.path[i];
                if (point) {
                  ctx.lineTo(point.x, point.y);
                }
              }
              
              ctx.stroke();
            }
          }
        });
        
        ctx.globalAlpha = 1;
      } catch (error) {
        console.error('Drawing render error:', error);
      }
    };

    const animate = () => {
      renderDrawings();
      if (isDrawingEnabled) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    cleanupRef.current.push(() => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    });
  }, [canvasRef, videoRef, isDrawingEnabled, liveDrawings]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = 1;
    
    let currentDrawPath: { x: number; y: number }[] = [];

    const getMousePos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleStart = (pos: { x: number; y: number }) => {
      if (!isDrawingEnabled) return;
      
      isDrawingRef.current = true;
      setIsDrawing(true);
      currentDrawPath = [pos];
      setCurrentPath(safeArrayAccess([pos]));
      
      console.log('🎨 Drawing started with auto-fade');
    };

    const handleMove = (pos: { x: number; y: number }) => {
      if (!isDrawingRef.current || !isDrawingEnabled) return;
      
      currentDrawPath.push(pos);
      setCurrentPath(safeArrayAccess([...currentDrawPath]));
    };

    const handleEnd = () => {
      if (!isDrawingRef.current || !videoRef.current || !isDrawingEnabled) return;
      
      isDrawingRef.current = false;
      setIsDrawing(false);
      
      if (currentDrawPath.length > 0) {
        const currentTime = videoRef.current.currentTime;
        const drawAction: DrawAction = {
          path: safeArrayAccess([...currentDrawPath]),
          timestamp: currentTime,
          startTime: currentTime,
          endTime: currentTime + DRAWING_FADE_DURATION, // Auto-fade after 1 second
          color: drawColor || '#ff0000',
          width: drawWidth || 2,
          id: `draw_${Date.now()}_${Math.random()}`
        };
        
        console.log('🎨 Creating draw action with auto-fade:', drawAction);
        addDrawAction(drawAction);
        
        // Add to live drawings with auto-fade
        setLiveDrawings(prev => [...prev, drawAction]);
        
        // Auto-remove from live drawings after fade duration
        setTimeout(() => {
          setLiveDrawings(prev => prev.filter(d => d.id !== drawAction.id));
        }, DRAWING_FADE_DURATION * 1000 + 100); // Small buffer
      }
      setCurrentPath([]);
    };

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      handleStart(getMousePos(e));
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      handleMove(getMousePos(e));
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      handleEnd();
    };

    const handleMouseLeave = (e: MouseEvent) => {
      e.preventDefault();
      handleEnd();
    };

    if (isDrawingEnabled) {
      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseup", handleMouseUp);
      canvas.addEventListener("mouseleave", handleMouseLeave);

      cleanupRef.current.push(() => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseup", handleMouseUp);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      });
    }
  }, [drawColor, drawWidth, isDrawingEnabled, videoRef, addDrawAction, canvasRef]);

  // Clear only visual canvas, preserve timeline
  const handleClearCanvasVisual = () => {
    console.log('🧹 Clearing visual canvas only (preserving timeline)');
    setLiveDrawings([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    // Note: NOT calling handleClearCanvas to preserve timeline
  };

  const safeCurrentPath = safeArrayAccess(currentPath);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className={`absolute top-0 left-0 ${isDrawingEnabled ? 'cursor-crosshair' : 'pointer-events-none'}`}
        style={{ 
          pointerEvents: isDrawingEnabled ? 'auto' : 'none',
          width: '100%',
          height: '100%',
          touchAction: 'none',
          zIndex: isDrawingEnabled ? 10 : 1,
          opacity: 1,
          backgroundColor: 'transparent'
        }}
      />
      
      {isDrawingEnabled && (
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border space-y-2 z-20">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium">Color:</label>
            <input
              type="color"
              value={drawColor || '#ff0000'}
              onChange={(e) => setDrawColor(e.target.value)}
              className="w-8 h-6 rounded border"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium">Width:</label>
            <input
              type="range"
              min="1"
              max="10"
              value={drawWidth || 2}
              onChange={(e) => setDrawWidth(Number(e.target.value))}
              className="w-16"
            />
            <span className="text-xs">{drawWidth || 2}px</span>
          </div>
          <Button
            onClick={handleClearCanvasVisual}
            size="sm"
            variant="outline"
            className="w-full text-xs"
          >
            Clear Canvas
          </Button>
          {isDrawing && (
            <div className="text-xs text-blue-600 font-medium">
              ✏️ Drawing... ({safeCurrentPath.length} points)
            </div>
          )}
          <div className="text-xs text-green-600">
            🎨 Live: {liveDrawings.length} drawings (auto-fade: {DRAWING_FADE_DURATION}s)
          </div>
        </div>
      )}
    </>
  );
};

export default PlaybackTrackerDrawing;