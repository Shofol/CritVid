import React, { useState, useEffect, useRef } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  src?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  width?: string | number;
  height?: string | number;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: Error) => void;
  onTimeUpdate?: (time: number) => void;
}

/**
 * Enhanced video player component with error handling and loading states
 */
const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  autoPlay = false,
  controls = true,
  muted = false,
  loop = false,
  width = '100%',
  height = 'auto',
  className = '',
  onPlay,
  onPause,
  onEnded,
  onError,
  onTimeUpdate
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  // Log the source URL for debugging
  useEffect(() => {
    console.log('VideoPlayer: Video source URL:', src);
    
    if (src) {
      setIsLoading(true);
      setError(null);
      setHasAttemptedLoad(false);
    }
  }, [src]);

  // Set up event handlers
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleLoadStart = () => {
      console.log('Video load started');
      setIsLoading(true);
      setError(null);
    };

    const handleLoadedData = () => {
      console.log('Video data loaded successfully');
      setIsLoading(false);
      setHasAttemptedLoad(true);
    };

    const handleError = () => {
      setIsLoading(false);
      setHasAttemptedLoad(true);
      
      let errorMessage = 'Failed to load video';
      
      if (videoElement.error) {
        switch (videoElement.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = 'Video playback was aborted';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = 'Network error occurred while loading the video';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = 'Video is corrupted or uses features not supported by your browser';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = 'Video format is not supported or the URL is invalid';
            break;
          default:
            errorMessage = `Unknown video error: ${videoElement.error.message}`;
        }
      }
      
      console.error('Video error:', errorMessage);
      setError(errorMessage);
      
      if (onError) {
        onError(new Error(errorMessage));
      }
    };

    const handlePlay = () => {
      console.log('Video playing');
      if (onPlay) onPlay();
    };

    const handlePause = () => {
      console.log('Video paused');
      if (onPause) onPause();
    };

    const handleEnded = () => {
      console.log('Video ended');
      if (onEnded) onEnded();
    };

    const handleTimeUpdate = () => {
      if (onTimeUpdate) onTimeUpdate(videoElement.currentTime);
    };

    // Add event listeners
    videoElement.addEventListener('loadstart', handleLoadStart);
    videoElement.addEventListener('loadeddata', handleLoadedData);
    videoElement.addEventListener('error', handleError);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('timeupdate', handleTimeUpdate);

    // Clean up
    return () => {
      videoElement.removeEventListener('loadstart', handleLoadStart);
      videoElement.removeEventListener('loadeddata', handleLoadedData);
      videoElement.removeEventListener('error', handleError);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [onPlay, onPause, onEnded, onError, onTimeUpdate]);

  // If no src is provided, show a message
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md ${className}`} 
           style={{ width, height: height === 'auto' ? '300px' : height }}>
        <div className="text-center p-4">
          <p className="text-lg font-medium">Please select or upload a video to begin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
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
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      )}
      
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        autoPlay={autoPlay}
        controls={controls}
        muted={muted}
        loop={loop}
        playsInline
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
