import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Play, Pause, RotateCcw } from 'lucide-react';

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

interface PlaybackPreviewProps {
  videoUrl: string;
  audioUrl: string;
  drawActions: DrawAction[];
  timelineEvents?: TimelineEvent[];
}

const PlaybackPreviewPlayerFixed: React.FC<PlaybackPreviewProps> = ({
  videoUrl,
  audioUrl,
  drawActions,
  timelineEvents = [],
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
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [previewDuration, setPreviewDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState(0);

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
    console.log('Duration calculated:', { videoDuration, audioDuration, totalPauseDuration, extendedDuration });
  }, [timelineEvents]);

  const processTimelineEvents = useCallback(() => {
    const currentTime = virtualTimeRef.current;
    
    timelineEvents.forEach(event => {
      const eventId = event.id || `${event.type}_${event.time}_${event.timestamp}`;
      
      if (!processedEventsRef.current.has(eventId) && currentTime >= event.time) {
        console.log('Processing timeline event:', event.type, 'at', event.time, 'duration:', event.duration);
        
        if (event.type === 'pause' && event.duration) {
          pauseStateRef.current = {
            isPaused: true,
            pauseStartTime: performance.now(),
            pauseDuration: event.duration * 1000
          };
          
          const video = videoRef.current;
          if (video && !video.paused) {
            video.pause();
            console.log('Video paused for', event.duration, 'seconds');
            
            setTimeout(() => {
              if (video && pauseStateRef.current.isPaused) {
                video.play().catch(console.warn);
                pauseStateRef.current.isPaused = false;
                console.log('Video resumed after pause');
              }
            }, event.duration * 1000);
          }
        }
        processedEventsRef.current.add(eventId);
      }
    });
  }, [timelineEvents]);

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
        console.log('Pause duration completed, resuming virtual time');
      }
    }
    
    return virtualTimeRef.current;
  }, []);

  const syncMedia = useCallback(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    
    if (!video) return;
    
    const vTime = updateVirtualTime();
    const videoDuration = video.duration || 0;
    
    if (!pauseStateRef.current.isPaused && vTime <= videoDuration && Math.abs(video.currentTime - vTime) > 0.1) {
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

  const drawOverlay = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    
    const rect = video.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const masterTime = virtualTimeRef.current;
    
    drawActions.forEach((action) => {
      const actionDuration = action.endTime - action.startTime;
      const effectiveDuration = actionDuration > 0 ? actionDuration : 1;
      
      if (masterTime >= action.startTime && masterTime <= action.startTime + effectiveDuration) {
        const timeElapsed = masterTime - action.startTime;
        const fadeProgress = 1 - (timeElapsed / effectiveDuration);
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

  const tick = useCallback(() => {
    if (!isPlaying) return;
    
    syncMedia();
    drawOverlay();
    
    if (virtualTimeRef.current < previewDuration) {
      animationFrameRef.current = requestAnimationFrame(tick);
    } else {
      setIsPlaying(false);
      console.log('Preview completed');
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    const handleAudioLoad = () => {
      setAudioLoaded(true);
      calculateExtendedDuration();
    };

    audio.addEventListener('loadedmetadata', handleAudioLoad);
    return () => audio.removeEventListener('loadedmetadata', handleAudioLoad);
  }, [audioUrl, calculateExtendedDuration]);

  const handlePlay = useCallback(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    
    console.log('Starting preview playback');
    
    if (video) video.play().catch(console.warn);
    if (audio && audioLoaded) {
      audio.currentTime = virtualTimeRef.current;
      audio.play().catch(console.warn);
    }
    setIsPlaying(true);
  }, [audioLoaded]);

  const handlePause = useCallback(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    
    console.log('Pausing preview playback');
    
    if (video) video.pause();
    if (audio) audio.pause();
    setIsPlaying(false);
  }, []);

  const handleRestart = useCallback(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    
    console.log('Restarting preview');
    
    virtualTimeRef.current = 0;
    pauseStateRef.current = { isPaused: false, pauseStartTime: 0, pauseDuration: 0 };
    processedEventsRef.current.clear();
    
    if (video) {
      video.currentTime = 0;
      video.pause();
    }
    
    if (audio && audioLoaded) {
      audio.currentTime = 0;
      audio.pause();
    }
    
    setIsPlaying(false);
    setCurrentTime(0);
    drawOverlay();
  }, [audioLoaded, drawOverlay]);

  const handleSeek = useCallback((value: number[]) => {
    const seekTime = (value[0] / 100) * previewDuration;
    virtualTimeRef.current = seekTime;
    processedEventsRef.current.clear();
    
    console.log('Seeking to:', seekTime);
    
    const video = videoRef.current;
    const audio = audioRef.current;
    
    if (video) video.currentTime = Math.min(seekTime, video.duration || 0);
    if (audio && audioLoaded) audio.currentTime = seekTime;
    
    setCurrentTime(seekTime);
    drawOverlay();
  }, [previewDuration, audioLoaded, drawOverlay]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = previewDuration > 0 ? (currentTime / previewDuration) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          onLoadedMetadata={calculateExtendedDuration}
          muted
        />
        
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        />
        
        {audioUrl && <audio ref={audioRef} src={audioUrl} preload="auto" />}
      </div>
      
      <div className="bg-gray-900 text-white p-4 rounded-lg space-y-3">
        <div className="space-y-2">
          <Slider
            value={[progressPercentage]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(previewDuration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button onClick={handleRestart} variant="ghost" size="sm" className="text-white hover:bg-gray-700">
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          <Button onClick={isPlaying ? handlePause : handlePlay} variant="ghost" size="sm" className="text-white hover:bg-gray-700">
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
        </div>

        <div className="text-center space-y-1">
          <div className="text-sm text-gray-400">
            Audio: {audioLoaded ? '✅ Loaded' : '⏳ Loading'} | 
            Drawings: {drawActions.length} | 
            Timeline Events: {timelineEvents.length}
          </div>
          <div className="text-xs text-gray-500">
            Extended Duration: {formatTime(previewDuration)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaybackPreviewPlayerFixed;