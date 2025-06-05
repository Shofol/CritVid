import React, { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  isPlaying: boolean;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onSeeked: () => void;
  onDurationChange: (duration: number) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  isPlaying,
  currentTime,
  onTimeUpdate,
  onPlay,
  onPause,
  onSeeked,
  onDurationChange,
  videoRef,
}) => {
  const prevTimeRef = useRef(currentTime);
  
  // Handle play/pause
  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err);
      });
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, videoRef]);
  
  // Handle seeking
  useEffect(() => {
    if (!videoRef.current) return;
    
    // Only update if the time difference is significant (to avoid infinite loops)
    if (Math.abs(videoRef.current.currentTime - currentTime) > 0.5) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime, videoRef]);
  
  // Set up event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleTimeUpdate = () => {
      if (video.currentTime !== prevTimeRef.current) {
        prevTimeRef.current = video.currentTime;
        onTimeUpdate(video.currentTime);
      }
    };
    
    const handlePlay = () => {
      onPlay();
    };
    
    const handlePause = () => {
      onPause();
    };
    
    const handleSeeked = () => {
      onSeeked();
    };
    
    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        onDurationChange(video.duration);
      }
    };
    
    // Add event listeners
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    // If video is already loaded, set duration
    if (video.duration && !isNaN(video.duration)) {
      onDurationChange(video.duration);
    }
    
    return () => {
      // Remove event listeners
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoRef, onTimeUpdate, onPlay, onPause, onSeeked, onDurationChange]);
  
  return (
    <video 
      ref={videoRef}
      src={videoUrl}
      className="w-full rounded-md"
      playsInline
      preload="auto"
    />
  );
};

export default VideoPlayer;
