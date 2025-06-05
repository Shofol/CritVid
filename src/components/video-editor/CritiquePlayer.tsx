import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import VideoPlayer from './VideoPlayer';
import { VideoAction } from '@/types/critiqueTypes';

interface CritiquePlayerProps {
  videoSrc?: string;
  audioSrc?: string | null;
  videoActions?: VideoAction[];
  drawingData?: any;
  onPlaybackComplete?: () => void;
}

const CritiquePlayer: React.FC<CritiquePlayerProps> = ({
  videoSrc,
  audioSrc,
  videoActions = [],
  drawingData,
  onPlaybackComplete
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const actionsTimeoutRef = useRef<Record<number, NodeJS.Timeout>>({});
  
  // Log sources for debugging
  useEffect(() => {
    console.log('CritiquePlayer: Video source:', videoSrc);
    console.log('CritiquePlayer: Audio source:', audioSrc);
  }, [videoSrc, audioSrc]);
  
  // Clear all timeouts on unmount
  useEffect(() => {
    return () => {
      // Clear any pending timeouts
      Object.values(actionsTimeoutRef.current).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, []);

  // Set up synchronized playback
  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    
    if (!video || !videoSrc) return;
    
    if (!audio || !audioSrc) {
      // If no audio, just set up video handlers
      const handleVideoPlay = () => setIsPlaying(true);
      const handleVideoPause = () => setIsPlaying(false);
      const handleTimeUpdate = () => setCurrentTime(video.currentTime);
      const handleEnded = () => {
        setIsPlaying(false);
        onPlaybackComplete?.();
      };
      
      video.addEventListener('play', handleVideoPlay);
      video.addEventListener('pause', handleVideoPause);
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('ended', handleEnded);
      
      return () => {
        video.removeEventListener('play', handleVideoPlay);
        video.removeEventListener('pause', handleVideoPause);
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('ended', handleEnded);
      };
    }
    
    // Set up event listeners for synchronization with audio
    const handleVideoPlay = () => {
      if (audio.paused) {
        audio.currentTime = video.currentTime;
        audio.play().catch(err => {
          console.error('Error playing audio:', err);
          setAudioError('Failed to play audio. The audio file may be corrupted.');
        });
      }
      setIsPlaying(true);
    };
    
    const handleVideoPause = () => {
      if (!audio.paused) {
        audio.pause();
      }
      setIsPlaying(false);
    };
    
    const handleVideoSeeked = () => {
      audio.currentTime = video.currentTime;
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      onPlaybackComplete?.();
    };
    
    // Add event listeners
    video.addEventListener('play', handleVideoPlay);
    video.addEventListener('pause', handleVideoPause);
    video.addEventListener('seeked', handleVideoSeeked);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    
    // Handle audio errors
    audio.addEventListener('error', () => {
      console.error('Audio error:', audio.error);
      setAudioError('Failed to load audio. Please check the audio file.');
    });
    
    // Clean up
    return () => {
      video.removeEventListener('play', handleVideoPlay);
      video.removeEventListener('pause', handleVideoPause);
      video.removeEventListener('seeked', handleVideoSeeked);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', () => {});
    };
  }, [audioSrc, videoSrc, onPlaybackComplete]);
  
  // Schedule video actions when playback starts
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc || !isPlaying || !videoActions || videoActions.length === 0) return;
    
    // Clear any existing timeouts
    Object.values(actionsTimeoutRef.current).forEach(timeout => {
      clearTimeout(timeout);
    });
    actionsTimeoutRef.current = {};
    
    // Get the current playback time in milliseconds
    const currentTimeMs = video.currentTime * 1000;
    
    // Schedule all actions that should occur after the current time
    videoActions.forEach((action, index) => {
      if (action.timestamp > currentTimeMs) {
        const delay = action.timestamp - currentTimeMs;
        
        actionsTimeoutRef.current[index] = setTimeout(() => {
          if (!video) return;
          
          // Execute the action
          switch (action.type) {
            case 'play':
              video.play().catch(err => {
                console.error('Error playing video during action replay:', err);
                setVideoError('Failed to play video during action replay.');
              });
              break;
            case 'pause':
              video.pause();
              break;
            case 'seek':
              if (action.videoTime !== undefined) {
                video.currentTime = action.videoTime;
              }
              break;
          }
        }, delay);
      }
    });
    
    // Clean up timeouts when playback stops
    return () => {
      Object.values(actionsTimeoutRef.current).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, [isPlaying, videoActions, videoSrc]);
  
  // Handle video error
  const handleVideoError = (error: Error) => {
    console.error('Video error in CritiquePlayer:', error);
    setVideoError('Failed to load video. Please check format or source.');
  };
  
  // If no video source, show a message
  if (!videoSrc) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md p-8" style={{ minHeight: '300px' }}>
        <p className="text-lg font-medium mb-4">Please select or upload a video to begin.</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col space-y-4">
      {videoError && (
        <Alert variant="destructive">
          <AlertDescription>{videoError}</AlertDescription>
        </Alert>
      )}
      
      {audioError && (
        <Alert variant="destructive">
          <AlertDescription>{audioError}</AlertDescription>
        </Alert>
      )}
      
      <div className="relative">
        {/* Video Player */}
        <VideoPlayer
          videoSrc={videoSrc}
          controls={true}
          onError={handleVideoError}
        />
        
        {/* Audio Element (hidden) */}
        {audioSrc && (
          <audio 
            ref={audioRef} 
            src={audioSrc} 
            onError={() => setAudioError('Failed to load audio. The audio file may be corrupted.')}
            hidden 
          />
        )}
      </div>
      
      {/* Actions List */}
      {videoActions && videoActions.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2">Recorded Actions</h3>
            <div className="max-h-40 overflow-y-auto">
              <ul className="space-y-1">
                {videoActions.map((action, index) => {
                  const timestamp = action.timestamp;
                  const seconds = Math.floor(timestamp / 1000);
                  const minutes = Math.floor(seconds / 60);
                  const remainingSeconds = seconds % 60;
                  const formattedTime = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
                  
                  return (
                    <li key={index} className="text-sm">
                      <span className="font-mono">{formattedTime}</span>: 
                      <span className="capitalize ml-2">{action.type}</span>
                      {action.videoTime !== undefined && (
                        <span className="ml-2">at {action.videoTime.toFixed(2)}s</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CritiquePlayer;
