import React, { useRef, useEffect, useState } from 'react';
import { DrawAction, TimelineEvent } from '@/types/critiqueTypes';

interface PlaybackPreviewPlayerImprovedProps {
  videoUrl: string;
  audioUrl?: string;
  drawActions: DrawAction[];
  timelineEvents: TimelineEvent[];
  onTimeUpdate?: (time: number) => void;
}

export default function PlaybackPreviewPlayerImproved({
  videoUrl,
  audioUrl,
  drawActions,
  timelineEvents,
  onTimeUpdate
}: PlaybackPreviewPlayerImprovedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    
    if (!video) return;

    const handleTimeUpdate = () => {
      const time = video.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
      
      if (audio && Math.abs(audio.currentTime - time) > 0.1) {
        audio.currentTime = time;
      }
      
      processTimelineEvents(time);
      drawCanvas(time);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setIsPaused(false);
      if (audio) audio.play();
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (audio) audio.pause();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, [audioUrl, timelineEvents, drawActions, onTimeUpdate]);

  const processTimelineEvents = (currentTime: number) => {
    const video = videoRef.current;
    if (!video || isPaused) return;

    const currentEvent = timelineEvents.find(event => 
      Math.abs(event.timestamp - currentTime) < 0.1 && !event.processed
    );

    if (currentEvent && currentEvent.type === 'pause') {
      setIsPaused(true);
      video.pause();
      
      const duration = currentEvent.duration || 1000;
      pauseTimeoutRef.current = setTimeout(() => {
        setIsPaused(false);
        video.play();
        currentEvent.processed = true;
      }, duration);
    }
  };

  const drawCanvas = (currentTime: number) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawActions.forEach(action => {
      if (currentTime >= action.timestamp && 
          currentTime <= action.timestamp + (action.duration || 3)) {
        
        const opacity = Math.max(0, 1 - (currentTime - action.timestamp) / (action.duration || 3));
        
        ctx.globalAlpha = opacity;
        ctx.strokeStyle = action.color || '#ff0000';
        ctx.lineWidth = action.lineWidth || 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        if (action.points && action.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(action.points[0].x, action.points[0].y);
          for (let i = 1; i < action.points.length; i++) {
            ctx.lineTo(action.points[i].x, action.points[i].y);
          }
          ctx.stroke();
        }
      }
    });
    
    ctx.globalAlpha = 1;
  };

  return (
    <div className="relative w-full">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-auto"
        controls
        playsInline
      />
      
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        width={800}
        height={600}
      />
      
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
        />
      )}
      
      {isPaused && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white text-lg font-semibold">
            Paused (as recorded)
          </div>
        </div>
      )}
    </div>
  );
}