import { useState, useRef, useEffect, useCallback } from 'react';
import { VideoPlayerState } from '@/types/critiqueStudio';

/**
 * Hook for managing a basic video player
 * @param videoUrl URL of the video to play
 */
export function useVideoPlayerBasic(videoUrl: string) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playerState, setPlayerState] = useState<VideoPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isLoading: true,
    error: null,
  });

  // Initialize video element
  useEffect(() => {
    if (videoRef.current && videoUrl) {
      videoRef.current.src = videoUrl;
      videoRef.current.load();
    }
  }, [videoUrl]);

  // Set up event listeners
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleTimeUpdate = () => {
      setPlayerState(prev => ({
        ...prev,
        currentTime: videoElement.currentTime,
      }));
    };

    const handleDurationChange = () => {
      setPlayerState(prev => ({
        ...prev,
        duration: videoElement.duration,
      }));
    };

    const handleLoadedData = () => {
      setPlayerState(prev => ({
        ...prev,
        isLoading: false,
        duration: videoElement.duration,
      }));
    };

    const handleError = () => {
      setPlayerState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Error loading video',
      }));
    };

    const handlePlay = () => {
      setPlayerState(prev => ({ ...prev, isPlaying: true }));
    };

    const handlePause = () => {
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
    };

    // Add event listeners
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('durationchange', handleDurationChange);
    videoElement.addEventListener('loadeddata', handleLoadedData);
    videoElement.addEventListener('error', handleError);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);

    // Clean up
    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('durationchange', handleDurationChange);
      videoElement.removeEventListener('loadeddata', handleLoadedData);
      videoElement.removeEventListener('error', handleError);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
    };
  }, []);

  // Play/pause control
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;

    if (playerState.isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  }, [playerState.isPlaying]);

  // Seek control
  const seek = useCallback((time: number) => {
    if (!videoRef.current) return;
    
    videoRef.current.currentTime = time;
    setPlayerState(prev => ({ ...prev, currentTime: time }));
  }, []);

  // Volume control
  const setVolume = useCallback((volume: number) => {
    if (!videoRef.current) return;
    
    const clampedVolume = Math.max(0, Math.min(1, volume));
    videoRef.current.volume = clampedVolume;
    setPlayerState(prev => ({ ...prev, volume: clampedVolume }));
  }, []);

  return {
    videoRef,
    playerState,
    togglePlay,
    seek,
    setVolume,
  };
}
