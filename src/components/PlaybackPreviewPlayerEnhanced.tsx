import React, { useRef, useEffect, useState, useCallback } from 'react';
import PlaybackPreviewPlayerUI from './PlaybackPreviewPlayerUI';

interface DrawAction {
  path: { x: number; y: number }[];
  timestamp: number;
  startTime: number;
  endTime: number;
  color: string;
  width: number;
  id?: string;
}

interface TimelineEvent {
  type: 'pause' | 'resume' | 'seek' | 'play';
  timestamp: number;
  time: number;
  duration?: number;
  id?: string;
}

interface VideoAction {
  type: 'pause' | 'play' | 'seek' | 'audio_start' | 'audio_stop';
  time: number;
  timestamp: number;
  duration?: number;
}

interface PlaybackPreviewProps {
  videoUrl: string;
  audioUrl: string;
  drawActions: DrawAction[];
  timelineEvents?: TimelineEvent[];
  videoActions?: VideoAction[];
}

const PlaybackPreviewPlayerEnhanced: React.FC<PlaybackPreviewProps> = ({
  videoUrl,
  audioUrl,
  drawActions,
  timelineEvents = [],
  videoActions = [],
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const virtualTimeRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);
  const processedEventsRef = useRef<Set<string>>(new Set());
  const pauseStateRef = useRef<{ isPaused: boolean; pauseStartTime: number; pauseDuration: number }>({
    isPaused: false,
    pauseStartTime: 0,
    pauseDuration: 0
  });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 450 });
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [previewDuration, setPreviewDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);

  // Calculate extended preview duration
  const calculateExtendedDuration = useCallback(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    
    if (!video) return;
    
    const videoDuration = video.duration || 0;
    const audioDuration = audio?.duration || 0;
    
    const totalPauseDuration = timelineEvents
      .filter(event => event.type === 'pause' && event.duration)
      .reduce((sum, event) => sum + (event.duration || 0), 0);
    
    const extendedDuration = Math.max(audioDuration, videoDuration + totalPauseDuration);
    setPreviewDuration(extendedDuration);
  }, [timelineEvents]);

  // Process timeline events with pause simulation
  const processTimelineEvents = useCallback(() => {
    const currentTime = virtualTimeRef.current;
    
    timelineEvents.forEach(event => {
      const eventId = event.id || `${event.type}_${event.time}`;
      
      if (!processedEventsRef.current.has(eventId) && currentTime >= event.time) {
        if (event.type === 'pause' && event.duration) {
          pauseStateRef.current = {
            isPaused: true,
            pauseStartTime: performance.now(),
            pauseDuration: event.duration * 1000
          };
          
          const video = videoRef.current;
          if (video && !video.paused) {
            video.pause();
            setTimeout(() => {
              if (video && pauseStateRef.current.isPaused) {
                video.play().catch(console.warn);
                pauseStateRef.current.isPaused = false;
              }
            }, event.duration * 1000);
          }
        }
        processedEventsRef.current.add(eventId);
      }
    });
  }, [timelineEvents]);

  // Virtual time update with pause handling
  const updateVirtualTime = useCallback(() => {
    const now = performance.now();
    const deltaTime = (now - lastUpdateTimeRef.current) / 1000;
    lastUpdateTimeRef.current = now;
    
    if (!pauseStateRef.current.isPaused) {
      virtualTimeRef.current += deltaTime;
    } else {
      const pauseElapsed = now - pauseStateRef.current.pauseStartTime;
      if (pauseElapsed >= pauseStateRef.current.pauseDuration) {
        pauseStateRef.current.isPaused = false;
      }
    }
    
    return virtualTimeRef.current;
  }, []);

  // Sync media with lenient audio synchronization
  const syncMedia = useCallback(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    
    if (!video) return;
    
    const vTime = updateVirtualTime();
    const videoDuration = video.duration || 0;
    
    if (vTime <= videoDuration && Math.abs(video.currentTime - vTime) > 0.1) {
      video.currentTime = Math.min(vTime, videoDuration);
    }
    
    if (audio && audioLoaded && !pauseStateRef.current.isPaused) {
      const audioTimeDiff = Math.abs(audio.currentTime - vTime);
      if (audioTimeDiff > 0.25) {
        audio.currentTime = vTime;
      }
    }
    
    setCurrentTime(vTime);
    processTimelineEvents();
  }, [updateVirtualTime, audioLoaded, processTimelineEvents]);

  // Drawing overlay with time-based rendering
  const drawOverlay = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const masterTime = virtualTimeRef.current;
    
    drawActions.forEach((action) => {
      if (masterTime >= action.startTime && masterTime <= action.endTime) {
        const timeRemaining = action.endTime - masterTime;
        const totalDuration = action.endTime - action.startTime;
        const fadeProgress = timeRemaining / Math.max(totalDuration, 1);
        const opacity = Math.max(0.1, Math.min(1, fadeProgress));
        
        ctx.globalAlpha = opacity;
        ctx.strokeStyle = action.color;
        ctx.lineWidth = action.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        if (action.path.length > 1) {
          ctx.beginPath();
          ctx.moveTo(action.path[0].x, action.path[0].y);
          for (let i = 1; i < action.path.length; i++) {
            ctx.lineTo(action.path[i].x, action.path[i].y);
          }
          ctx.stroke();
        }
      }
    });
    
    ctx.globalAlpha = 1.0;
  }, [drawActions]);

  // Main animation loop with requestAnimationFrame
  const tick = useCallback(() => {
    if (!isPlaying) return;
    
    syncMedia();
    drawOverlay();
    
    if (virtualTimeRef.current < previewDuration) {
      animationFrameRef.current = requestAnimationFrame(tick);
    } else {
      setIsPlaying(false);
    }
  }, [isPlaying, syncMedia, drawOverlay, previewDuration]);

  useEffect(() => {
    if (isPlaying) {
      lastUpdateTimeRef.current = performance.now();
      tick();
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, tick]);

  const handleRestart = useCallback(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    
    if (video) {
      video.currentTime = 0;
      if (audio && audioLoaded) audio.currentTime = 0;
      virtualTimeRef.current = 0;
      pauseStateRef.current = { isPaused: false, pauseStartTime: 0, pauseDuration: 0 };
      processedEventsRef.current.clear();
      setIsPlaying(false);
      drawOverlay();
    }
  }, [audioLoaded, drawOverlay]);

  const handleVideoAction = useCallback((action: { type: 'play' | 'pause' | 'seek'; time: number }) => {
    const video = videoRef.current;
    const audio = audioRef.current;
    
    if (action.type === 'seek') {
      virtualTimeRef.current = action.time;
      processedEventsRef.current.clear();
      if (video) video.currentTime = Math.min(action.time, video.duration || 0);
      if (audio && audioLoaded) audio.currentTime = action.time;
    }
    
    if (action.type === 'play' && audio && audioLoaded) {
      if (audio.readyState >= 2) {
        audio.currentTime = virtualTimeRef.current;
        audio.play().catch(() => console.warn('Audio play failed'));
      }
    }
    
    if (action.type === 'pause' && audio && audioLoaded) {
      audio.pause();
    }
  }, [audioLoaded]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-auto"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onLoadedMetadata={calculateExtendedDuration}
          muted
        />
        
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 pointer-events-none"
          style={{ width: canvasSize.width, height: canvasSize.height }}
        />
        
        {audioUrl && (
          <audio ref={audioRef} src={audioUrl} preload="auto" />
        )}
      </div>
      
      <PlaybackPreviewPlayerUI
        videoRef={videoRef}
        audioRef={audioRef}
        canvasRef={canvasRef}
        videoUrl={videoUrl}
        audioUrl={audioUrl}
        canvasSize={canvasSize}
        videoError={videoError}
        audioError={audioError}
        audioLoaded={audioLoaded}
        isPlaying={isPlaying}
        drawActionsCount={drawActions.length}
        timelineEventsCount={timelineEvents.length}
        onRestart={handleRestart}
        onVideoAction={handleVideoAction}
      />
    </div>
  );
};

export default PlaybackPreviewPlayerEnhanced;