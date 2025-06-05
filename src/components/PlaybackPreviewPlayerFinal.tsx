import React, { useRef, useEffect, useState } from 'react';
import { DrawAction, TimelineEvent } from '@/types/critiqueTypes';

interface PlaybackPreviewPlayerFinalProps {
  videoUrl: string;
  audioUrl?: string;
  drawActions: DrawAction[];
  timelineEvents: TimelineEvent[];
  onTimeUpdate?: (time: number) => void;
}

export default function PlaybackPreviewPlayerFinal({
  videoUrl,
  audioUrl,
  drawActions,
  timelineEvents,
  onTimeUpdate
}: PlaybackPreviewPlayerFinalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const processedEventsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    
    if (!video) return;

    const handleTimeUpdate = () => {
      const time = video.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
      
      // Sync audio with reduced glitching
      if (audio && !isPaused) {
        const timeDiff = Math.abs(audio.currentTime - time);
        if (timeDiff > 0.2) { // Only sync if significantly out of sync
          audio.currentTime = time;
        }
      }
      
      processTimelineEvents(time);
      drawCanvas(time);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setIsPaused(false);
      if (audio && !isPaused) {
        audio.play().catch(e => console.warn('Audio play failed:', e));
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (audio && !isPaused) {
        audio.pause();
      }
    };

    const handleLoadedData = () => {
      if (audio) {
        audio.currentTime = video.currentTime;
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('loadeddata', handleLoadedData);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('loadeddata', handleLoadedData);
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, [audioUrl, timelineEvents, drawActions, onTimeUpdate, isPaused]);

  const processTimelineEvents = (currentTime: number) => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video || isPaused) return;

    const currentEvent = timelineEvents.find(event => {
      const eventId = event.id || `${event.type}_${event.timestamp}`;
      const isAtTime = Math.abs(event.timestamp - currentTime) < 0.1;
      const notProcessed = !processedEventsRef.current.has(eventId);
      return isAtTime && notProcessed && event.type === 'pause';
    });

    if (currentEvent) {
      const eventId = currentEvent.id || `${currentEvent.type}_${currentEvent.timestamp}`;
      processedEventsRef.current.add(eventId);
      
      setIsPaused(true);
      video.pause();
      if (audio) audio.pause();
      
      // Use actual recorded pause duration or default
      const pauseDuration = currentEvent.duration || 2000;
      console.log(`⏸️ Pausing for ${pauseDuration}ms at ${currentTime}s`);
      
      pauseTimeoutRef.current = setTimeout(() => {
        setIsPaused(false);
        video.play();
        if (audio) {
          audio.currentTime = video.currentTime;
          audio.play().catch(e => console.warn('Audio resume failed:', e));
        }
      }, pauseDuration);
    }
  };

  const drawCanvas = (currentTime: number) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Update canvas size to match video
    const rect = video.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawActions.forEach(action => {
      const startTime = action.timestamp || action.startTime || 0;
      const duration = action.duration || 3;
      const endTime = startTime + duration;
      
      if (currentTime >= startTime && currentTime <= endTime) {
        const elapsed = currentTime - startTime;
        const opacity = Math.max(0, 1 - (elapsed / duration));
        
        ctx.globalAlpha = opacity;
        ctx.strokeStyle = action.color || '#ff0000';
        ctx.lineWidth = action.lineWidth || action.width || 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        const points = action.points || action.path || [];
        if (points && points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          ctx.stroke();
        }
      }
    });
    
    ctx.globalAlpha = 1;
  };

  // Reset processed events when video restarts
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleSeeked = () => {
      if (video.currentTime < 1) {
        processedEventsRef.current.clear();
        console.log('🔄 Reset processed events');
      }
    };

    video.addEventListener('seeked', handleSeeked);
    return () => video.removeEventListener('seeked', handleSeeked);
  }, []);

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
        style={{ zIndex: 10 }}
      />
      
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
        />
      )}
      
      {isPaused && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="text-white text-lg font-semibold bg-black bg-opacity-75 px-4 py-2 rounded">
            ⏸️ Paused (as recorded)
          </div>
        </div>
      )}
      
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs z-20">
        Drawings: {drawActions.length} | Events: {timelineEvents.length}
      </div>
    </div>
  );
}