import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { getFallbackVideoUrl } from '@/lib/videoService';

interface SimpleVideoPlayerProps {
  videoSrc?: string;
  controls?: boolean;
  muted?: boolean;
  autoPlay?: boolean;
  className?: string;
  onError?: (error: Error) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (time: number) => void;
}

/**
 * A simplified video player component with basic error handling
 */
const SimpleVideoPlayer = forwardRef<HTMLVideoElement, SimpleVideoPlayerProps>((
  {
    videoSrc,
    controls = true,
    muted = false,
    autoPlay = false,
    className = '',
    onError,
    onPlay,
    onPause,
    onTimeUpdate
  }, ref
) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Forward the ref to parent components
  useImperativeHandle(ref, () => videoRef.current!, []);

  // Handle video source changes
  useEffect(() => {
    console.log('SimpleVideoPlayer: Video source:', videoSrc);
    setError(null);
    
    if (videoSrc) {
      setIsLoading(true);
    }
  }, [videoSrc]);

  // Set up event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      console.log('Video playing');
      onPlay?.();
    };

    const handlePause = () => {
      console.log('Video paused');
      onPause?.();
    };

    const handleTimeUpdate = () => {
      onTimeUpdate?.(video.currentTime);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleLoadedData = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      setIsLoading(false);
      
      let errorMessage = 'Failed to load video';
      if (video.error) {
        errorMessage = `Video error: ${video.error.code}`;
      }
      
      console.error('Video error:', errorMessage);
      setError(errorMessage);
      
      if (onError) {
        onError(new Error(errorMessage));
      }
    };

    // Add event listeners
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    // Clean up
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [onPlay, onPause, onTimeUpdate, onError]);

  // If no video source is provided
  if (!videoSrc) {
    return (
      <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md h-64">
        <div className="text-center p-4">
          <p className="text-lg font-medium">Please select a video to begin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-10 p-4">
          <Alert variant="destructive" className="mb-4 max-w-md">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={() => {
            if (videoRef.current) {
              videoRef.current.src = getFallbackVideoUrl();
              videoRef.current.load();
              setError(null);
            }
          }}>
            Try Fallback Video
          </Button>
        </div>
      )}
      
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        controls={controls}
        muted={muted}
        autoPlay={autoPlay}
        playsInline
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
});

SimpleVideoPlayer.displayName = 'SimpleVideoPlayer';

export default SimpleVideoPlayer;
