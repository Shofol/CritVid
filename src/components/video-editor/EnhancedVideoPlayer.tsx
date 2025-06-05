import React from 'react';
import useVideoPlayer from '@/hooks/useVideoPlayer';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface EnhancedVideoPlayerProps {
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
 * Enhanced video player component that uses the useVideoPlayer hook
 */
const EnhancedVideoPlayer: React.FC<EnhancedVideoPlayerProps> = ({
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
  const {
    videoRef,
    isPlaying,
    isLoading,
    error,
    duration,
    currentTime,
    togglePlay
  } = useVideoPlayer({
    src,
    autoPlay,
    onPlay,
    onPause,
    onEnded,
    onError,
    onTimeUpdate
  });

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
        controls={controls}
        muted={muted}
        loop={loop}
        playsInline
        onClick={controls ? undefined : togglePlay}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {!controls && isPlaying && (
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
          {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} / 
          {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
        </div>
      )}
    </div>
  );
};

export default EnhancedVideoPlayer;
