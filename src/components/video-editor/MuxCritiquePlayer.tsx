import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { AudioMixSettings } from '@/types/drawingTypes';
import { VideoTimestamp } from '@/types/muxTypes';

interface MuxCritiquePlayerProps {
  videoUrl: string;
  audioUrl?: string | null;
  drawingData?: string | null;
}

const MuxCritiquePlayer: React.FC<MuxCritiquePlayerProps> = ({
  videoUrl,
  audioUrl,
  drawingData
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSettings, setAudioSettings] = useState<AudioMixSettings>({
    videoVolume: 0.5,
    critiqueVolume: 1.0
  });
  const [timestamps, setTimestamps] = useState<VideoTimestamp[]>([]);
  
  // Extract videoId from URL for loading timestamps
  const getVideoId = () => {
    const urlParts = videoUrl.split('/');
    return urlParts[urlParts.length - 1].split('.')[0] || 'sample';
  };
  
  // Load timestamps from localStorage
  useEffect(() => {
    const videoId = getVideoId();
    try {
      const savedTimestamps = localStorage.getItem(`timestamps_${videoId}`);
      if (savedTimestamps) {
        setTimestamps(JSON.parse(savedTimestamps));
      }
    } catch (err) {
      console.error('Error loading timestamps:', err);
    }
  }, [videoUrl]);
  
  // Apply timestamps during playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video || timestamps.length === 0) return;
    
    let currentTimestampIndex = 0;
    
    const handleTimeUpdate = () => {
      // Check if we need to apply any timestamps
      while (
        currentTimestampIndex < timestamps.length && 
        video.currentTime >= timestamps[currentTimestampIndex].time
      ) {
        const timestamp = timestamps[currentTimestampIndex];
        
        // If this timestamp indicates a pause, pause the video
        if (timestamp.isPaused) {
          video.pause();
        }
        
        currentTimestampIndex++;
      }
    };
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [timestamps]);
  
  // Sync audio with video
  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    
    if (!video || !audio || !audioUrl) return;
    
    // Apply volume settings
    video.volume = audioSettings.videoVolume;
    audio.volume = audioSettings.critiqueVolume;
    
    const handlePlay = () => {
      audio.currentTime = video.currentTime;
      audio.play().catch(err => {
        console.error('Error playing audio:', err);
      });
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      audio.pause();
      setIsPlaying(false);
    };
    
    const handleSeek = () => {
      audio.currentTime = video.currentTime;
    };
    
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('seeked', handleSeek);
    
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('seeked', handleSeek);
    };
  }, [audioUrl, audioSettings]);
  
  // Draw annotations when drawing data is available
  useEffect(() => {
    if (!drawingData || !canvasRef.current || !videoRef.current) return;
    
    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const parsedDrawingData = JSON.parse(drawingData);
      
      // Set canvas dimensions to match video
      const resizeCanvas = () => {
        if (canvas && video) {
          const rect = video.getBoundingClientRect();
          canvas.width = rect.width;
          canvas.height = rect.height;
        }
      };
      
      const drawAnnotationsForTime = () => {
        if (!ctx || !parsedDrawingData) return;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const currentTime = video.currentTime;
        
        // Draw only paths that should be visible at the current time
        parsedDrawingData.paths.forEach(path => {
          if (!path.points || path.points.length < 2) return;
          
          // Default duration is 5 seconds if not specified
          const duration = path.duration || 5;
          const endTime = path.timestamp + duration;
          
          if (currentTime >= path.timestamp && currentTime <= endTime) {
            ctx.beginPath();
            ctx.moveTo(path.points[0].x, path.points[0].y);
            
            for (let i = 1; i < path.points.length; i++) {
              ctx.lineTo(path.points[i].x, path.points[i].y);
            }
            
            ctx.strokeStyle = path.color || '#ff0000';
            ctx.lineWidth = path.width || 3;
            ctx.stroke();
          }
        });
      };
      
      resizeCanvas();
      
      // Update drawings when video time changes
      const handleTimeUpdate = () => {
        drawAnnotationsForTime();
      };
      
      // Handle window resize
      window.addEventListener('resize', resizeCanvas);
      video.addEventListener('timeupdate', handleTimeUpdate);
      
      return () => {
        window.removeEventListener('resize', resizeCanvas);
        video.removeEventListener('timeupdate', handleTimeUpdate);
      };
    } catch (err) {
      console.error('Error processing drawing data:', err);
    }
  }, [drawingData]);

  const handleVideoLoad = () => {
    setIsLoading(false);
  };
  
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video error in MuxCritiquePlayer:', e);
    setIsLoading(false);
    setError('Unable to load video. Please try another video or check your connection.');
    
    // Try to use a fallback video source
    if (videoRef.current) {
      console.log('MuxCritiquePlayer: Attempting to load fallback video');
      videoRef.current.src = '/sample-dance-video.mp4';
      videoRef.current.load();
    }
  };

  const handleVolumeChange = (newSettings: AudioMixSettings) => {
    setAudioSettings(newSettings);
    
    // Apply settings immediately
    if (videoRef.current) {
      videoRef.current.volume = newSettings.videoVolume;
    }
    
    if (audioRef.current) {
      audioRef.current.volume = newSettings.critiqueVolume;
    }
  };

  const handleRefresh = () => {
    if (videoRef.current) {
      videoRef.current.load();
    }
    if (audioRef.current && audioUrl) {
      audioRef.current.load();
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
            Critique Playback
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            title="Refresh playback"
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
            src={videoUrl}
            className="w-full h-full object-contain"
            poster="/placeholder.svg"
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
            controls
            playsInline
            preload="auto"
            muted={false}
            crossOrigin="anonymous"
          />
          
          {/* Canvas for drawing annotations */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-20"
          />
          
          {/* Audio element for critique */}
          {audioUrl && (
            <audio 
              ref={audioRef} 
              src={audioUrl} 
              className="hidden" // Hide the audio element as it's controlled by video
              preload="auto"
            />
          )}
        </div>
        
        {/* Audio Volume Controls - Removed for simplicity */}
        
        <div className="mt-4 p-3 bg-muted rounded-md">
          <p className="text-sm">
            This playback includes all pauses, drawings, and audio from the original critique.
            {timestamps.length > 0 && (
              <span className="text-green-500"> {timestamps.length} timestamp markers loaded.</span>
            )}
          </p>
          
          {audioUrl && isPlaying && (
            <p className="text-green-500 flex items-center mt-2">
              <AlertCircle className="w-4 h-4 mr-2" />
              Audio critique is playing in sync with the video
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MuxCritiquePlayer;
