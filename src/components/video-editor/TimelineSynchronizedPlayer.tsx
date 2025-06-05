import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { PlaybackSynchronizer, loadVideoActions } from '@/lib/playbackSynchronizer';
import { VideoAction } from '@/types/timelineTypes';

interface TimelineSynchronizedPlayerProps {
  videoUrl: string;
  audioUrl: string | null;
  videoId: string;
  onPlaybackComplete?: () => void;
}

const TimelineSynchronizedPlayer: React.FC<TimelineSynchronizedPlayerProps> = ({
  videoUrl,
  audioUrl,
  videoId,
  onPlaybackComplete
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [pauseCount, setPauseCount] = useState(0);
  const [totalPauseDuration, setTotalPauseDuration] = useState(0);
  const synchronizerRef = useRef<PlaybackSynchronizer | null>(null);
  const frameRequestRef = useRef<number | null>(null);
  
  // Load video actions from localStorage
  const videoActions = loadVideoActions(videoId);
  
  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    
    if (!video || !audio || !audioUrl) return;
    
    const handleMediaReady = () => {
      if (video.readyState >= 2 && audio.readyState >= 2) {
        setIsReady(true);
      }
    };
    
    // Enhanced media loading with error handling
    const handleVideoError = () => {
      console.error('Video failed to load');
      setIsReady(false);
    };
    
    const handleAudioError = () => {
      console.error('Audio failed to load');
      setIsReady(false);
    };
    
    video.addEventListener('loadeddata', handleMediaReady);
    video.addEventListener('error', handleVideoError);
    audio.addEventListener('loadeddata', handleMediaReady);
    audio.addEventListener('error', handleAudioError);
    
    // Set audio source
    audio.src = audioUrl;
    
    // Calculate pause statistics
    const pauseActions = videoActions.filter(action => action.type === 'pause');
    setPauseCount(pauseActions.length);
    
    const totalDuration = pauseActions.reduce((sum, action) => {
      return sum + (action.duration || 0);
    }, 0);
    setTotalPauseDuration(totalDuration);
    
    return () => {
      video.removeEventListener('loadeddata', handleMediaReady);
      video.removeEventListener('error', handleVideoError);
      audio.removeEventListener('loadeddata', handleMediaReady);
      audio.removeEventListener('error', handleAudioError);
      
      // Clean up synchronizer and frame requests
      if (synchronizerRef.current) {
        synchronizerRef.current.stop();
      }
      if (frameRequestRef.current) {
        cancelAnimationFrame(frameRequestRef.current);
      }
    };
  }, [videoUrl, audioUrl, videoActions]);
  
  // Enhanced frame-by-frame synchronization monitoring
  const monitorSynchronization = () => {
    if (!isPlaying || !videoRef.current || !audioRef.current) return;
    
    const video = videoRef.current;
    const audio = audioRef.current;
    
    // Check for sync drift and correct if necessary
    const timeDiff = Math.abs(video.currentTime - audio.currentTime);
    if (timeDiff > 0.1) { // 100ms tolerance
      console.warn(`Sync drift detected: ${timeDiff.toFixed(3)}s`);
      // Sync audio to video time
      audio.currentTime = video.currentTime;
    }
    
    frameRequestRef.current = requestAnimationFrame(monitorSynchronization);
  };
  
  const startPlayback = async () => {
    if (!isReady || !videoRef.current || !audioRef.current) return;
    
    try {
      // Reset media to beginning
      videoRef.current.currentTime = 0;
      audioRef.current.currentTime = 0;
      
      // Create and start synchronizer with enhanced options
      synchronizerRef.current = new PlaybackSynchronizer({
        videoElement: videoRef.current,
        audioElement: audioRef.current,
        actions: videoActions,
        onComplete: () => {
          setIsPlaying(false);
          if (frameRequestRef.current) {
            cancelAnimationFrame(frameRequestRef.current);
            frameRequestRef.current = null;
          }
          if (onPlaybackComplete) onPlaybackComplete();
        }
      });
      
      await synchronizerRef.current.start();
      setIsPlaying(true);
      
      // Start sync monitoring
      monitorSynchronization();
      
    } catch (error) {
      console.error('Failed to start synchronized playback:', error);
      setIsPlaying(false);
    }
  };
  
  const stopPlayback = () => {
    if (synchronizerRef.current) {
      synchronizerRef.current.stop();
      setIsPlaying(false);
    }
    
    if (frameRequestRef.current) {
      cancelAnimationFrame(frameRequestRef.current);
      frameRequestRef.current = null;
    }
  };
  
  const resetPlayback = () => {
    stopPlayback();
    if (videoRef.current) videoRef.current.currentTime = 0;
    if (audioRef.current) audioRef.current.currentTime = 0;
  };
  
  // Enhanced action summary with duration info
  const getActionSummary = (actions: VideoAction[]) => {
    if (actions.length === 0) return "No timeline actions recorded";
    
    const pauseCount = actions.filter(a => a.type === 'pause').length;
    const playCount = actions.filter(a => a.type === 'play').length;
    const seekCount = actions.filter(a => a.type === 'seek').length;
    
    const pausesWithDuration = actions.filter(a => a.type === 'pause' && a.duration).length;
    
    return `${actions.length} timeline events: ${pauseCount} pauses (${pausesWithDuration} with duration), ${playCount} plays, ${seekCount} seeks`;
  };
  
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    return `${seconds}s`;
  };
  
  return (
    <div className="w-full">
      <div className="relative aspect-video bg-slate-950 rounded-md overflow-hidden w-full">
        <video 
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          poster="/placeholder.svg"
          controls={false}
          preload="metadata"
        />
        
        <audio ref={audioRef} className="hidden" preload="metadata" />
        
        {isPlaying && (
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
            Playing synchronized critique
          </div>
        )}
      </div>
      
      <div className="flex gap-2 mt-4">
        {!isPlaying ? (
          <Button 
            onClick={startPlayback} 
            disabled={!isReady || !audioUrl}
            className="flex items-center"
            type="button"
          >
            <Play className="w-4 h-4 mr-2" /> Play Critique
          </Button>
        ) : (
          <Button 
            onClick={stopPlayback}
            variant="destructive"
            className="flex items-center"
            type="button"
          >
            <Pause className="w-4 h-4 mr-2" /> Stop
          </Button>
        )}
        
        <Button 
          variant="outline" 
          onClick={resetPlayback}
          className="flex items-center"
          type="button"
        >
          <RotateCcw className="w-4 h-4 mr-2" /> Reset
        </Button>
      </div>
      
      {!audioUrl && (
        <p className="text-sm text-muted-foreground mt-2">
          No audio recording available for this critique.
        </p>
      )}
      
      {pauseCount > 0 && (
        <div className="mt-2 space-y-1">
          <div className="flex items-center text-xs text-amber-600 dark:text-amber-400">
            <Clock className="w-3 h-3 mr-1" />
            {pauseCount} synchronized pause{pauseCount !== 1 ? 's' : ''}
            {totalPauseDuration > 0 && (
              <span className="ml-2">({formatDuration(totalPauseDuration)} total)</span>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {getActionSummary(videoActions)}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineSynchronizedPlayer;
