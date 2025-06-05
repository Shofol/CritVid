import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import VideoPlayer from './VideoPlayer';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useVideoActions } from '@/hooks/useVideoActions';
import { useDrawingCanvas } from '@/hooks/useDrawingCanvas';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CritiqueRecorderProps {
  videoSrc: string;
  videoId: string;
  onSave?: (audioBlob: Blob, drawingData: any, videoActions: any) => void;
  onDiscard?: () => void;
}

const CritiqueRecorder: React.FC<CritiqueRecorderProps> = ({
  videoSrc,
  videoId,
  onSave,
  onDiscard
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showDrawingTools, setShowDrawingTools] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  
  // Log video source for debugging
  useEffect(() => {
    console.log('CritiqueRecorder: Using video source:', videoSrc);
  }, [videoSrc]);
  
  // Initialize hooks
  const { state: audioState, controls: audioControls } = useAudioRecorder({
    onStop: (blob) => {
      console.log('Recording stopped, blob size:', blob.size);
    }
  });
  
  const { state: actionsState, controls: actionsControls } = useVideoActions();
  
  const { canvasRef, state: drawingState, controls: drawingControls } = useDrawingCanvas({
    videoElement: videoRef.current
  });
  
  // Update video reference for actions tracking
  useEffect(() => {
    if (videoRef.current) {
      // This would be handled by the useVideoActions hook in a real implementation
    }
  }, [videoRef.current]);
  
  // Handle recording state changes
  const startRecording = async () => {
    if (videoRef.current) {
      try {
        // Start audio recording
        await audioControls.startRecording();
        
        // Start tracking video actions
        actionsControls.startRecording();
        
        // Play the video
        videoRef.current.play().catch(err => {
          console.error('Error playing video:', err);
          setVideoError('Failed to play video. Please check if the video file is valid.');
        });
        
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting recording:', error);
        setVideoError('Failed to start recording. Please check your microphone permissions.');
      }
    }
  };
  
  const stopRecording = async () => {
    // Stop audio recording
    const audioBlob = await audioControls.stopRecording();
    
    // Stop tracking video actions
    actionsControls.stopRecording();
    
    // Pause the video
    if (videoRef.current) {
      videoRef.current.pause();
    }
    
    setIsRecording(false);
    
    // Call onSave callback with all data
    if (audioBlob && onSave) {
      onSave(audioBlob, drawingControls.getDrawingData(), actionsState.actions);
    }
  };
  
  const discardRecording = () => {
    // Clear all recording data
    audioControls.clearRecording();
    actionsControls.clearActions();
    drawingControls.clear();
    
    setIsRecording(false);
    
    // Call onDiscard callback
    if (onDiscard) {
      onDiscard();
    }
  };
  
  // Handle drawing events
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!showDrawingTools) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    drawingControls.startDrawing(x, y);
  };
  
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!showDrawingTools || !drawingState.isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    drawingControls.draw(x, y);
  };
  
  const handleCanvasMouseUp = () => {
    if (!showDrawingTools) return;
    drawingControls.stopDrawing();
  };
  
  // Handle video error
  const handleVideoError = (error: Error) => {
    console.error('Video error in CritiqueRecorder:', error);
    setVideoError('Failed to load video. Please check format or source.');
  };
  
  return (
    <div className="flex flex-col space-y-4" ref={containerRef}>
      {videoError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{videoError}</AlertDescription>
        </Alert>
      )}
      
      <div className="relative">
        {/* Video Player */}
        <VideoPlayer
          videoSrc={videoSrc}
          onPlay={() => actionsState.isRecording && actionsControls.logAction('play')}
          onPause={() => actionsState.isRecording && actionsControls.logAction('pause')}
          onSeeked={(time) => actionsState.isRecording && actionsControls.logAction('seek', time)}
          onError={handleVideoError}
          controls={!isRecording}
          muted={isRecording} // Mute video during recording to prevent feedback
        />
        
        {/* Drawing Canvas */}
        <canvas
          ref={canvasRef}
          className={`absolute top-0 left-0 w-full h-full ${showDrawingTools ? 'cursor-crosshair' : 'pointer-events-none'}`}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          {/* Recording Status */}
          {isRecording && (
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse mr-2"></div>
              <span>Recording: {Math.floor(audioState.elapsedTime / 1000)}s</span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          {/* Drawing Tools Toggle */}
          <Button
            variant={showDrawingTools ? "default" : "outline"}
            onClick={() => setShowDrawingTools(!showDrawingTools)}
            disabled={!isRecording}
          >
            {showDrawingTools ? "Hide Drawing" : "Show Drawing"}
          </Button>
          
          {/* Recording Controls */}
          {!isRecording ? (
            <Button onClick={startRecording} variant="default">
              Start Recording
            </Button>
          ) : (
            <>
              <Button onClick={stopRecording} variant="default">
                Stop & Save
              </Button>
              <Button onClick={discardRecording} variant="destructive">
                Discard
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Drawing Tools */}
      {showDrawingTools && isRecording && (
        <Card>
          <CardContent className="p-4">
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => drawingControls.setColor('#ff0000')}
                className="w-8 h-8 p-0 bg-red-500"
              />
              <Button 
                variant="outline" 
                onClick={() => drawingControls.setColor('#00ff00')}
                className="w-8 h-8 p-0 bg-green-500"
              />
              <Button 
                variant="outline" 
                onClick={() => drawingControls.setColor('#0000ff')}
                className="w-8 h-8 p-0 bg-blue-500"
              />
              <Button 
                variant="outline" 
                onClick={() => drawingControls.setColor('#ffff00')}
                className="w-8 h-8 p-0 bg-yellow-500"
              />
              <Button 
                variant="outline" 
                onClick={() => drawingControls.clear()}
              >
                Clear
              </Button>
              <Button 
                variant="outline" 
                onClick={() => drawingControls.undo()}
              >
                Undo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CritiqueRecorder;
