import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getFallbackVideoUrl } from '@/lib/videoService';
import { saveCritiqueRecording } from '@/lib/critiqueStorage';

interface AdvancedVideoEditorProps {
  videoId: string;
  videoUrl?: string;
  onSave?: () => void;
}

const AdvancedVideoEditor: React.FC<AdvancedVideoEditorProps> = ({
  videoId,
  videoUrl = getFallbackVideoUrl(),
  onSave
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingColor, setDrawingColor] = useState('#ff0000');
  const [drawingWidth, setDrawingWidth] = useState(3);
  const [error, setError] = useState<string | null>(null);
  const [videoActions, setVideoActions] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const timerRef = useRef<number | null>(null);
  
  // Set up canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (canvas && video) {
      // Set canvas dimensions to match video
      const resizeCanvas = () => {
        canvas.width = video.clientWidth;
        canvas.height = video.clientHeight;
      };
      
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      
      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }
  }, []);
  
  // Handle drawing on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isDrawing) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let isDrawingOnCanvas = false;
    let lastX = 0;
    let lastY = 0;
    
    const draw = (e: MouseEvent) => {
      if (!isDrawingOnCanvas || !canvas) return;
      
      ctx.strokeStyle = drawingColor;
      ctx.lineWidth = drawingWidth;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      
      const rect = canvas.getBoundingClientRect();
      if (rect && typeof e.clientX === 'number' && typeof e.clientY === 'number') {
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
        
        ctx.lineTo(lastX, lastY);
        ctx.stroke();
      }
    };
    
    const startDrawing = (e: MouseEvent) => {
      isDrawingOnCanvas = true;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      if (rect && typeof e.clientX === 'number' && typeof e.clientY === 'number') {
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
      }
    };
    
    const stopDrawing = () => {
      isDrawingOnCanvas = false;
    };
    
    // Safely add event listeners
    if (canvas) {
      canvas.addEventListener('mousedown', startDrawing);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', stopDrawing);
      canvas.addEventListener('mouseout', stopDrawing);
    }
    
    return () => {
      // Safely remove event listeners
      if (canvas) {
        canvas.removeEventListener('mousedown', startDrawing);
        canvas.removeEventListener('mousemove', draw);
        canvas.removeEventListener('mouseup', stopDrawing);
        canvas.removeEventListener('mouseout', stopDrawing);
      }
    };
  }, [isDrawing, drawingColor, drawingWidth]);
  
  // Handle recording
  const startRecording = () => {
    try {
      setIsRecording(true);
      setError(null);
      setSaveSuccess(false);
      setVideoActions([]);
      setRecordingTime(0);
      
      // Track video actions
      const video = videoRef.current;
      if (video) {
        video.onplay = () => {
          setVideoActions(prev => [...prev, { type: 'play', timestamp: Date.now() }]);
        };
        
        video.onpause = () => {
          setVideoActions(prev => [...prev, { type: 'pause', timestamp: Date.now() }]);
        };
        
        video.onseeked = () => {
          setVideoActions(prev => [...prev, { type: 'seek', timestamp: Date.now(), position: video.currentTime }]);
        };
      }
      
      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to start recording');
      setIsRecording(false);
    }
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Remove video event listeners
    const video = videoRef.current;
    if (video) {
      video.onplay = null;
      video.onpause = null;
      video.onseeked = null;
    }
  };
  
  const saveCritique = async () => {
    setIsSaving(true);
    
    try {
      // Get canvas data if drawing was used
      let drawingData = null;
      if (canvasRef.current) {
        drawingData = canvasRef.current.toDataURL();
      }
      
      // Save critique data
      const critiqueData = {
        videoId,
        videoActions,
        drawingData,
        recordingTime,
        timestamp: new Date().toISOString()
      };
      
      await saveCritiqueRecording(videoId, critiqueData);
      
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        if (onSave) onSave();
      }, 1500);
    } catch (err) {
      console.error('Error saving critique:', err);
      setError('Failed to save critique');
    } finally {
      setIsSaving(false);
    }
  };
  
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Advanced Video Editor</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {saveSuccess && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <AlertDescription>Critique saved successfully!</AlertDescription>
          </Alert>
        )}
        
        <div className="relative aspect-video bg-black rounded-md overflow-hidden">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            controls
            playsInline
          />
          
          <canvas
            ref={canvasRef}
            className={`absolute top-0 left-0 w-full h-full ${isDrawing ? 'cursor-crosshair' : 'pointer-events-none'}`}
          />
          
          {isRecording && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md flex items-center">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse mr-2"></div>
              <span className="text-xs font-medium">REC {recordingTime}s</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              disabled={isRecording || isSaving}
              className="flex items-center"
              type="button"
            >
              Start Recording
            </Button>
          ) : (
            <Button
              onClick={stopRecording}
              variant="destructive"
              className="flex items-center"
              type="button"
            >
              Stop Recording
            </Button>
          )}
          
          <Button
            variant={isDrawing ? "default" : "outline"}
            onClick={() => setIsDrawing(!isDrawing)}
            className="flex items-center"
            type="button"
          >
            {isDrawing ? "Drawing Mode On" : "Enable Drawing"}
          </Button>
          
          {isDrawing && (
            <Button
              variant="outline"
              onClick={clearCanvas}
              className="flex items-center"
              type="button"
            >
              Clear Drawing
            </Button>
          )}
          
          {!isRecording && videoActions.length > 0 && (
            <Button
              variant="outline"
              onClick={saveCritique}
              disabled={isSaving || saveSuccess}
              className="flex items-center ml-auto"
              type="button"
            >
              {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Critique'}
            </Button>
          )}
        </div>
        
        {isDrawing && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <div className="flex items-center gap-4">
              <div>
                <label className="text-sm font-medium">Color:</label>
                <input
                  type="color"
                  value={drawingColor}
                  onChange={(e) => setDrawingColor(e.target.value)}
                  className="ml-2 w-8 h-8 rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Width:</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={drawingWidth}
                  onChange={(e) => setDrawingWidth(parseInt(e.target.value))}
                  className="ml-2 w-24"
                />
              </div>
            </div>
          </div>
        )}
        
        {videoActions.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <h3 className="text-sm font-medium mb-2">Recorded Actions:</h3>
            <div className="max-h-32 overflow-y-auto text-xs">
              {videoActions.map((action, index) => (
                <div key={index} className="mb-1">
                  {action.type.toUpperCase()} at {new Date(action.timestamp).toLocaleTimeString()}
                  {action.type === 'seek' && ` to ${action.position.toFixed(2)}s`}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedVideoEditor;