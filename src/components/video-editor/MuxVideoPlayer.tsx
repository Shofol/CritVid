import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, AlertCircle, RefreshCw } from 'lucide-react';
import { VideoTimestamp } from '@/types/muxTypes';

interface MuxVideoPlayerProps {
  videoUrl: string;
  onToggleRecording?: () => void;
  isRecording?: boolean;
  onDrawing?: () => void;
  videoId?: string;
}

const MuxVideoPlayer: React.FC<MuxVideoPlayerProps> = ({
  videoUrl,
  onToggleRecording,
  isRecording = false,
  onDrawing,
  videoId = 'sample'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timestamps, setTimestamps] = useState<VideoTimestamp[]>([]);
  
  useEffect(() => {
    setIsLoading(true);
    setError(null);
  }, [videoUrl]);
  
  const handleDrawingToggle = () => {
    setIsDrawingMode(!isDrawingMode);
    if (onDrawing) {
      onDrawing();
    }
    
    // When entering drawing mode, pause the video
    if (!isDrawingMode && videoRef.current) {
      videoRef.current.pause();
      
      // Record this timestamp with pause state
      addTimestamp(true);
    }
  };
  
  const handleVideoLoad = () => {
    setIsLoading(false);
  };
  
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video error in MuxVideoPlayer:', e);
    setIsLoading(false);
    setError('Unable to load video. Please check your connection.');
    
    // Try to use a fallback video source
    if (videoRef.current) {
      console.log('MuxVideoPlayer: Attempting to load fallback video');
      videoRef.current.load(); // This will try the fallback source
    }
  };

  const handleStartRecording = () => {
    if (onToggleRecording) {
      onToggleRecording();
      
      // Start the video playback when recording starts
      if (!isRecording && videoRef.current) {
        // Reset timestamps when starting a new recording
        setTimestamps([]);
        videoRef.current.play().catch(err => {
          console.error('Error playing video:', err);
          setError('Could not start video playback. Please try again.');
        });
      }
    }
  };

  const addTimestamp = (isPaused: boolean) => {
    if (!isRecording || !videoRef.current) return;
    
    const currentTime = videoRef.current.currentTime;
    setTimestamps(prev => [...prev, { time: currentTime, isPaused }]);
    
    // Save timestamps to localStorage for the critique player to use
    try {
      localStorage.setItem(`timestamps_${videoId}`, JSON.stringify(timestamps));
    } catch (err) {
      console.error('Error saving timestamps:', err);
    }
  };

  // Handle video play/pause events during recording
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isRecording) return;
    
    const handlePlay = () => {
      addTimestamp(false); // Not paused
    };
    
    const handlePause = () => {
      addTimestamp(true); // Paused
    };
    
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [isRecording, videoId, timestamps]);

  const handleRefresh = () => {
    if (videoRef.current) {
      videoRef.current.load();
    }
    setError(null);
    setIsLoading(true);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Video className="w-5 h-5 mr-2" />
            Dance Video
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            title="Refresh video"
            type="button"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video bg-slate-950 rounded-md overflow-hidden w-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 z-10 p-4 text-center">
              <p className="text-red-400 mb-2">{error}</p>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleRefresh}
                type="button"
              >
                Try Again
              </Button>
            </div>
          )}
          
          <video 
            ref={videoRef}
            className="w-full h-full object-contain"
            poster="/placeholder.svg"
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
            controls
            playsInline
            preload="auto"
            muted={false}
            crossOrigin="anonymous"
          >
            <source src={videoUrl} type="video/mp4" />
            <source src="/sample-dance-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        <div className="flex justify-between mt-4">
          <Button
            variant={isDrawingMode ? "default" : "outline"}
            onClick={handleDrawingToggle}
            className="flex-1 mr-2"
            type="button"
          >
            {isDrawingMode ? "Drawing Mode Active" : "Enable Drawing"}
          </Button>
          
          <Button
            variant={isRecording ? "destructive" : "default"}
            onClick={handleStartRecording}
            className="flex-1 ml-2"
            type="button"
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MuxVideoPlayer;
