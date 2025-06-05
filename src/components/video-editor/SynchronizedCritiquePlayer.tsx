import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { PlaybackSynchronizer, loadVideoActions } from '@/lib/playbackSynchronizer';
import { VideoAction } from '@/types/timelineTypes';
import DrawingCanvas from './DrawingCanvas';
import { debugAudioStorage } from '@/lib/audioStorage';

// Inline VideoActionsList component
const VideoActionsList = ({ actions }: { actions: VideoAction[] }) => {
  if (actions.length === 0) return <p className="text-sm text-muted-foreground">No actions recorded</p>;
  
  return (
    <div className="max-h-[150px] overflow-y-auto bg-muted p-2 rounded-md text-xs">
      {actions.map((action, index) => (
        <div key={index} className="mb-1 pb-1 border-b border-muted-foreground/20 last:border-0">
          <span className="font-medium">{action.type.toUpperCase()}</span> at {(action.timestamp / 1000).toFixed(2)}s
          {action.videoTime !== undefined && (
            <span className="text-muted-foreground"> (video: {action.videoTime.toFixed(2)}s)</span>
          )}
          {action.duration && (
            <span className="text-amber-600"> [duration: {action.duration}ms]</span>
          )}
        </div>
      ))}
    </div>
  );
};

interface SynchronizedCritiquePlayerProps {
  videoUrl?: string;
  audioUrl?: string | null;
  videoId?: string;
  drawingData?: string | null;
  showActionsList?: boolean;
}

const SynchronizedCritiquePlayer: React.FC<SynchronizedCritiquePlayerProps> = ({
  videoUrl,
  audioUrl,
  videoId = '',
  drawingData,
  showActionsList = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [pauseCount, setPauseCount] = useState(0);
  const [totalPauseDuration, setTotalPauseDuration] = useState(0);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const synchronizerRef = useRef<PlaybackSynchronizer | null>(null);
  const syncMonitorRef = useRef<number | null>(null);
  
  // Load video actions from localStorage if videoId is provided
  const videoActions = videoId ? loadVideoActions(videoId) : [];
  
  useEffect(() => {
    if (videoId) {
      debugAudioStorage(videoId);
      console.log(`SynchronizedCritiquePlayer: Loaded ${videoActions.length} actions for ${videoId}`);
    }
    
    const video = videoRef.current;
    const audio = audioRef.current;
    
    if (!video || !videoUrl) return;
    
    const handleVideoReady = () => {
      if (audioUrl && audio) {
        if (audio.readyState >= 2) {
          setIsReady(true);
        }
      } else {
        setIsReady(true);
      }
    };
    
    const handleAudioReady = () => {
      if (video.readyState >= 2) {
        setIsReady(true);
      }
    };
    
    const handleVideoError = () => {
      setPlaybackError('Video failed to load');
    };
    
    const handleAudioError = () => {
      console.warn('Audio failed to load, continuing with video only');
      setIsReady(true); // Continue with video only
    };
    
    video.addEventListener('loadeddata', handleVideoReady);
    video.addEventListener('error', handleVideoError);
    
    if (audioUrl && audio) {
      audio.addEventListener('loadeddata', handleAudioReady);
      audio.addEventListener('error', handleAudioError);
      audio.src = audioUrl;
      audio.load();
    } else if (video.readyState >= 2) {
      setIsReady(true);
    }
    
    video.load();
    
    // Calculate pause statistics
    const pauseActions = videoActions.filter(action => action.type === 'pause');
    setPauseCount(pauseActions.length);
    
    const totalDuration = pauseActions.reduce((sum, action) => {
      return sum + (action.duration || 0);
    }, 0);
    setTotalPauseDuration(totalDuration);
    
    return () => {
      video.removeEventListener('loadeddata', handleVideoReady);
      video.removeEventListener('error', handleVideoError);
      if (audio) {
        audio.removeEventListener('loadeddata', handleAudioReady);
        audio.removeEventListener('error', handleAudioError);
      }
      
      if (synchronizerRef.current) {
        synchronizerRef.current.stop();
      }
      if (syncMonitorRef.current) {
        cancelAnimationFrame(syncMonitorRef.current);
      }
    };
  }, [videoUrl, audioUrl, videoActions, videoId]);
  
  // Enhanced sync monitoring with drift correction
  const monitorSync = () => {
    if (!isPlaying || !videoRef.current) return;
    
    const video = videoRef.current;
    const audio = audioRef.current;
    
    if (audio && audioUrl) {
      const timeDiff = Math.abs(video.currentTime - audio.currentTime);
      if (timeDiff > 0.1) {
        console.warn(`Sync drift: ${timeDiff.toFixed(3)}s, correcting...`);
        audio.currentTime = video.currentTime;
      }
    }
    
    syncMonitorRef.current = requestAnimationFrame(monitorSync);
  };
  
  const startPlayback = async () => {
    if (!isReady || !videoRef.current) return;
    
    try {
      setPlaybackError(null);
      console.log('Starting synchronized playback with', videoActions.length, 'actions');
      
      // Reset to beginning
      videoRef.current.currentTime = 0;
      if (audioRef.current && audioUrl) {
        audioRef.current.currentTime = 0;
      }
      
      synchronizerRef.current = new PlaybackSynchronizer({
        videoElement: videoRef.current,
        audioElement: audioRef.current || undefined,
        actions: videoActions,
        onComplete: () => {
          setIsPlaying(false);
          if (syncMonitorRef.current) {
            cancelAnimationFrame(syncMonitorRef.current);
            syncMonitorRef.current = null;
          }
        }
      });
      
      // Pre-load media
      videoRef.current.load();
      if (audioRef.current && audioUrl) {
        audioRef.current.load();
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await synchronizerRef.current.start();
      setIsPlaying(true);
      
      // Start sync monitoring
      monitorSync();
      
    } catch (error) {
      console.error('Failed to start synchronized playback:', error);
      setPlaybackError('Failed to start playback. Please try again.');
      setIsPlaying(false);
    }
  };
  
  const stopPlayback = () => {
    if (synchronizerRef.current) {
      synchronizerRef.current.stop();
      setIsPlaying(false);
    }
    
    if (syncMonitorRef.current) {
      cancelAnimationFrame(syncMonitorRef.current);
      syncMonitorRef.current = null;
    }
  };
  
  const resetPlayback = () => {
    stopPlayback();
    if (videoRef.current) videoRef.current.currentTime = 0;
    if (audioRef.current) audioRef.current.currentTime = 0;
  };
  
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    return `${seconds}s`;
  };
  
  if (!videoUrl) {
    return (
      <Card className="w-full mt-4">
        <CardContent className="flex items-center justify-center" style={{ minHeight: '300px' }}>
          <div className="text-center p-4">
            <p className="text-lg font-medium">Please select or upload a video to begin.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>Synchronized Critique Playback</span>
          {pauseCount > 0 && (
            <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 px-2 py-1 rounded-full flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {pauseCount} pause{pauseCount !== 1 ? 's' : ''}
              {totalPauseDuration > 0 && (
                <span className="ml-1">({formatDuration(totalPauseDuration)})</span>
              )}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video bg-slate-950 rounded-md overflow-hidden w-full">
          <video 
            ref={videoRef}
            className="w-full h-full object-contain"
            poster="/placeholder.svg"
            controls={false}
            preload="metadata"
            crossOrigin="anonymous"
            playsInline
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          
          {audioUrl && (
            <audio 
              ref={audioRef} 
              preload="metadata"
              className="hidden"
            >
              <source src={audioUrl} type="audio/webm" />
              <source src={audioUrl} type="audio/mp3" />
            </audio>
          )}
          
          {drawingData && <DrawingCanvas isDrawing={false} videoRef={videoRef} />}
          
          {isPlaying && (
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
              Synchronized Playback
            </div>
          )}
        </div>
        
        <div className="flex gap-2 mt-4">
          {!isPlaying ? (
            <Button 
              onClick={startPlayback} 
              disabled={!isReady}
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
        
        {playbackError && (
          <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/20 rounded-md">
            <p className="text-sm text-red-800 dark:text-red-200">
              {playbackError}
            </p>
          </div>
        )}
        
        {!audioUrl && (
          <p className="text-sm text-muted-foreground mt-2">
            No audio recording available for this critique.
          </p>
        )}
        
        {showActionsList && videoActions.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">
              Timeline Actions ({videoActions.length})
              {totalPauseDuration > 0 && (
                <span className="text-xs text-muted-foreground ml-2">
                  Total pause time: {formatDuration(totalPauseDuration)}
                </span>
              )}
            </h3>
            <VideoActionsList actions={videoActions} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SynchronizedCritiquePlayer;
