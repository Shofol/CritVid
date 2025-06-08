import { safeArrayAccess } from "@/lib/utils";
import { Edit } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface DrawingCanvasProps {
  containerRef: React.RefObject<HTMLDivElement>;
  isActive: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  isRecording: boolean;
  onDrawAction?: (action: DrawAction) => void;
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

const DRAWING_FADE_DURATION = 1;

const DrawingCanvasFixed: React.FC<DrawingCanvasProps> = ({
  containerRef,
  isActive,
  videoRef,
  isRecording,
  onDrawAction,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>(
    []
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState("#ff0000");
  const [drawWidth, setDrawWidth] = useState(2);
  const [liveDrawings, setLiveDrawings] = useState<DrawAction[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 450 });
  const [isControlsExpanded, setIsControlsExpanded] = useState(true);
  const cleanupRef = useRef<(() => void)[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const isDrawingRef = useRef(false);

  const performCleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    cleanupRef.current.forEach((cleanup) => {
      try {
        cleanup();
      } catch (error) {
        console.error("Drawing cleanup error:", error);
      }
    });
    cleanupRef.current = [];

    setIsDrawing(false);
    setCurrentPath([]);
    isDrawingRef.current = false;
  }, []);

  useEffect(() => {
    if (!isActive) {
      performCleanup();
    }

    return () => {
      performCleanup();
    };
  }, [isActive, performCleanup]);

  const updateCanvasSize = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!container || !canvas || !video) return;

    const containerRect = container.getBoundingClientRect();
    const newWidth = containerRect.width;
    const newHeight = containerRect.height;

    if (newWidth > 0 && newHeight > 0) {
      setCanvasSize({ width: newWidth, height: newHeight });
      canvas.width = newWidth;
      canvas.height = newHeight;
      canvas.style.width = `${newWidth}px`;
      canvas.style.height = `${newHeight}px`;
    }
  }, [containerRef, videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedMetadata = () => updateCanvasSize();
      const handleResize = () => updateCanvasSize();

      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("resize", handleResize);
      window.addEventListener("resize", handleResize);

      cleanupRef.current.push(() => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("resize", handleResize);
        window.removeEventListener("resize", handleResize);
      });

      if (video.readyState >= 1) {
        updateCanvasSize();
      }
    }
  }, [videoRef, updateCanvasSize]);

  const renderLiveStroke = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    liveDrawings.forEach((drawing) => {
      if (drawing.path.length > 1) {
        ctx.globalAlpha = 1;
        ctx.strokeStyle = drawing.color;
        ctx.lineWidth = drawing.width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.beginPath();
        ctx.moveTo(drawing.path[0].x, drawing.path[0].y);
        for (let i = 1; i < drawing.path.length; i++) {
          ctx.lineTo(drawing.path[i].x, drawing.path[i].y);
        }
        ctx.stroke();
      }
    });

    if (currentPath.length > 0) {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = drawColor;
      ctx.lineWidth = drawWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i].x, currentPath[i].y);
      }
      ctx.stroke();
    }
  }, [currentPath, drawColor, drawWidth, liveDrawings]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      if (isActive) {
        renderLiveStroke();
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
  }, [isActive, renderLiveStroke]);

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

    const getMousePos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height),
      };
    };

    const handleStart = (pos: { x: number; y: number }) => {
      if (!isActive || !isRecording) return;

      isDrawingRef.current = true;
      setIsDrawing(true);
      currentDrawPath = [pos];
      setCurrentPath(safeArrayAccess([pos]));
    };

    const handleMove = (pos: { x: number; y: number }) => {
      if (!isDrawingRef.current || !isActive || !isRecording) return;

      currentDrawPath.push(pos);
      setCurrentPath(safeArrayAccess([...currentDrawPath]));
    };

    const handleEnd = () => {
      if (
        !isDrawingRef.current ||
        !videoRef.current ||
        !isActive ||
        !isRecording
      )
        return;

      isDrawingRef.current = false;
      setIsDrawing(false);

      if (currentDrawPath.length > 0) {
        const currentTime = videoRef.current.currentTime;
        const drawAction: DrawAction = {
          path: safeArrayAccess([...currentDrawPath]),
          timestamp: currentTime,
          startTime: currentTime,
          endTime: currentTime + DRAWING_FADE_DURATION,
          color: drawColor || "#ff0000",
          width: drawWidth || 2,
          id: `draw_${Date.now()}_${Math.random()}`,
        };

        console.log("✏️ Drawing action created:", drawAction);

        setLiveDrawings((prev) => [...prev, drawAction]);

        if (onDrawAction) {
          onDrawAction(drawAction);
        }

        setTimeout(
          () => {
            setLiveDrawings((prev) =>
              prev.filter((d) => d.id !== drawAction.id)
            );
          },
          DRAWING_FADE_DURATION * 1000 + 100
        );
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

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      handleStart(getMousePos(e));
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleMove(getMousePos(e));
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      handleEnd();
    };

    if (isActive && isRecording) {
      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseup", handleMouseUp);
      canvas.addEventListener("mouseleave", handleEnd);
      canvas.addEventListener("touchstart", handleTouchStart);
      canvas.addEventListener("touchmove", handleTouchMove);
      canvas.addEventListener("touchend", handleTouchEnd);

      cleanupRef.current.push(() => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseup", handleMouseUp);
        canvas.removeEventListener("mouseleave", handleEnd);
        canvas.removeEventListener("touchstart", handleTouchStart);
        canvas.removeEventListener("touchmove", handleTouchMove);
        canvas.removeEventListener("touchend", handleTouchEnd);
      });
    }
  }, [drawColor, drawWidth, isActive, isRecording, videoRef, onDrawAction]);

  // const handleClearCanvasVisual = () => {
  //   setLiveDrawings([]);
  //   const canvas = canvasRef.current;
  //   if (canvas) {
  //     const ctx = canvas.getContext("2d");
  //     if (ctx) {
  //       ctx.clearRect(0, 0, canvas.width, canvas.height);
  //     }
  //   }
  // };

  if (!isActive) {
    return null;
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className={`absolute z-10 top-0 left-0 ${isActive && isRecording ? "cursor-crosshair" : "pointer-events-none"}`}
        style={{
          pointerEvents: isActive && isRecording ? "auto" : "none",
          width: "100%",
          height: "100%",
          touchAction: "none",
          zIndex: isActive ? 10 : 1,
          opacity: 1,
          backgroundColor: "transparent",
        }}
      />

      {isActive && isRecording && (
        <>
          {isControlsExpanded ? (
            <div className="absolute top-20 right-4 bg-white p-3 rounded-sm shadow-lg border space-y-2 z-20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">
                  Drawing Controls
                </span>
                <button
                  onClick={() => setIsControlsExpanded(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  title="Minimize controls"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium">Color:</label>
                <input
                  type="color"
                  value={drawColor || "#ff0000"}
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
            </div>
          ) : (
            <button
              onClick={() => setIsControlsExpanded(true)}
              className="absolute top-20 right-4 p-0 h-10 w-10 flex items-center justify-center bg-white rounded-full shadow-lg border hover:bg-gray-50 z-20"
              title="Open drawing controls"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
        </>
      )}
    </>
  );
};

export default DrawingCanvasFixed;
