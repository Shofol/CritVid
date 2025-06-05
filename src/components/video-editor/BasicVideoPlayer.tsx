import React, { useEffect, useRef, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { getFallbackVideoUrl } from '@/lib/videoService';

interface BasicVideoPlayerProps {
  videoSrc?: string;
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
  width?: string | number;
  height?: string | number;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (time: number) => void;
  onSeeked?: (time: number) => void;
  onError?: (error: Error) => void;
}

/**
 * A simplified video player component that directly handles video element without complex hooks
 * This is a fallback in case the main VideoPlayer component has issues
 */
const BasicVideoPlayer: React.FC<BasicVideoPlayerProps> = ({
  videoSrc,
  autoPlay = false,
  muted = false,
  controls = true,
  width = '100%',
  height = 'auto',
  className = '',
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onSeeked,
  onError
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fallbackUsed, setFallbackUsed] = useState(false);

  // Log video source for debugging
  useEffect(() => {
    console.log('BasicVideoPlayer: Video source:', videoSrc);
    
    // Reset error state when video source changes
    setError(null);
    setFallbackUsed(false);
    
    // Only set loading if we have a video source
    if (videoSrc) {
      setIsLoading(true);
    }
  }, [videoSrc]);

  // Set up event listeners
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

    const handleEnded = () => {
      console.log('Video ended');
      onEnded?.();
    };

    const handleTimeUpdate = () => {
      onTimeUpdate?.(video.currentTime);
    };

    const handleSeeked = () => {
      console.log('Video seeked to:', video.currentTime);
      onSeeked?.(video.currentTime);
    };

    const handleLoadStart = () => {
      console.log('Video load started');
      setIsLoading(true);
    };

    const handleLoadedData = () => {
      console.log('Video data loaded successfully');
      setIsLoading(false);
    };

    const handleError = () => {
      // Get more detailed error information
      let errorMessage = 'Video loading error';
      if (video.error) {
        switch (video.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = 'You aborted the video playback';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = 'A network error caused the video download to fail';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = 'The video playback was aborted due to a corruption problem';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = 'The video format is not supported or the video file was not found';
            break;
          default:
            errorMessage = `An unknown error occurred: ${video.error.message}`;
        }
      }
      
      console.error('Video error:', errorMessage);
      setError(errorMessage);
      setIsLoading(false);
      
      // Try fallback if not already using it
      if (!fallbackUsed && videoSrc !== getFallbackVideoUrl()) {
        console.log('Attempting to use fallback video');
        video.src = getFallbackVideoUrl();
        video.load();
        setFallbackUsed(true);
      } else if (onError) {
        onError(new Error(errorMessage));
      }
    };

    // Add event listeners
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    // Clean up
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [onPlay, onPause, onEnded, onTimeUpdate, onSeeked, onError, videoSrc, fallbackUsed]);

  // If no video source is provided, show a message
  if (!videoSrc) {
    return (
      <div className={`relative ${className} flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md`} style={{ width, height: height || '300px' }}>
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
      
      {error && !fallbackUsed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-10 p-4">
          <Alert variant="destructive" className="mb-4 max-w-md">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={() => {
            if (videoRef.current) {
              videoRef.current.src = getFallbackVideoUrl();
              videoRef.current.load();
              setFallbackUsed(true);
              setError(null);
            }
          }}>Try Fallback Video</Button>
        </div>
      )}
      
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        autoPlay={autoPlay}
        muted={muted}
        controls={controls}
        playsInline
        crossOrigin="anonymous"
      >
        {/* Primary source */}
        <source src={videoSrc} type="video/mp4" />
        
        {/* Fallback source */}
        {videoSrc !== getFallbackVideoUrl() && (
          <source src={getFallbackVideoUrl()} type="video/mp4" />
        )}
        
        {/* Message for browsers that don't support video */}
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default BasicVideoPlayer;
