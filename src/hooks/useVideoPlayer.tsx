import { useState, useEffect, useRef } from 'react';

interface UseVideoPlayerProps {
  src?: string;
  autoPlay?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: Error) => void;
  onTimeUpdate?: (time: number) => void;
}

interface UseVideoPlayerReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  duration: number;
  currentTime: number;
  play: () => Promise<void>;
  pause: () => void;
  seek: (time: number) => void;
  togglePlay: () => void;
}

/**
 * Custom hook for video player functionality
 */
export const useVideoPlayer = ({
  src,
  autoPlay = false,
  onPlay,
  onPause,
  onEnded,
  onError,
  onTimeUpdate
}: UseVideoPlayerProps): UseVideoPlayerReturn => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Log video source for debugging
  useEffect(() => {
    console.log('useVideoPlayer: Video source:', src);
    if (src) {
      setError(null);
      setIsLoading(true);
    }
  }, [src]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Set up event handlers
    const handlePlay = () => {
      console.log('Video playing');
      setIsPlaying(true);
      if (onPlay) onPlay();
    };

    const handlePause = () => {
      console.log('Video paused');
      setIsPlaying(false);
      if (onPause) onPause();
    };

    const handleEnded = () => {
      console.log('Video ended');
      setIsPlaying(false);
      if (onEnded) onEnded();
    };

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
      if (onTimeUpdate) onTimeUpdate(videoElement.currentTime);
    };

    const handleDurationChange = () => {
      console.log('Video duration:', videoElement.duration);
      setDuration(videoElement.duration || 0);
    };

    const handleLoadStart = () => {
      console.log('Video load started');
      setIsLoading(true);
    };

    const handleLoadedData = () => {
      console.log('Video data loaded');
      setIsLoading(false);
      setDuration(videoElement.duration || 0);
    };

    const handleError = () => {
      setIsLoading(false);
      
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

    // Add event listeners
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('durationchange', handleDurationChange);
    videoElement.addEventListener('loadstart', handleLoadStart);
    videoElement.addEventListener('loadeddata', handleLoadedData);
    videoElement.addEventListener('error', handleError);

    // Set initial autoplay if needed
    if (autoPlay) {
      videoElement.play().catch(err => {
        console.error('Autoplay failed:', err);
        // Most browsers require user interaction before autoplay
        if (onError) onError(new Error('Autoplay failed: ' + err.message));
      });
    }

    // Clean up
    return () => {
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('durationchange', handleDurationChange);
      videoElement.removeEventListener('loadstart', handleLoadStart);
      videoElement.removeEventListener('loadeddata', handleLoadedData);
      videoElement.removeEventListener('error', handleError);
    };
  }, [src, autoPlay, onPlay, onPause, onEnded, onTimeUpdate, onError]);

  // Play function
  const play = async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play();
      } catch (err) {
        console.error('Error playing video:', err);
        if (onError) onError(err instanceof Error ? err : new Error(String(err)));
      }
    }
  };

  // Pause function
  const pause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // Seek function
  const seek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      void play();
    }
  };

  return {
    videoRef,
    isPlaying,
    isLoading,
    error,
    duration,
    currentTime,
    play,
    pause,
    seek,
    togglePlay
  };
};

export default useVideoPlayer;