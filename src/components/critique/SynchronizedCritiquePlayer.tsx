import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Clock, AlertCircle } from 'lucide-react';
import { PlaybackSynchronizer, loadVideoActions } from '@/lib/playbackSynchronizer';
import { VideoAction } from '@/types/timelineTypes';

interface SynchronizedCritiquePlayerProps {
  videoUrl: string;
  audioUrl: string | null;
  videoId: string;
}

const SynchronizedCritiquePlayer: React.FC<SynchronizedCritiquePlayerProps> = ({
  videoUrl,
  audioUrl,
  videoId
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [pauseCount, setPauseCount] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const synchronizerRef = useRef<PlaybackSynchronizer | null>(null);
  
  // Load video actions from localStorage
  const videoActions = loadVideoActions(videoId);
  
  useEffect(() => {
    // Initialize when video is ready (audio is optional)
    const video = videoRef.current;
    
    if (!video) return;
    
    const handleVideoReady = () => {
      // If no audio URL, we're ready when video is ready
      if (!audioUrl) {
        setIsReady(true);
        return;
      }
      
      // If we have audio, check if it's ready
      const audio = audioRef.current;
      if (audio && audio.readyState >= 2) {
        setIsReady(true);
      } else if (audio) {
        // Audio exists but not ready yet
        audio.addEventListener('loadeddata', handleAudioReady);
      } else {
        // No audio element yet, but we'll still mark as ready
        setIsReady(true);
      }
    };
    
    const handleAudioReady = () => {
      setIsReady(true);
    };
    
    video.addEventListener('loadeddata', handleVideoReady);
    
    // Set up audio if available
    if (audioUrl && audioRef.current) {
      const audio = audioRef.current;
      
      // Explicitly set the audio source and preload it
      audio.src = audioUrl;
      audio.load();
      
      // Handle audio load error
      const handleAudioError = (e: Event) => {
        console.warn('Audio loading error:', e);
        setLoadError('Audio critique could not be loaded. The playback will continue without audio.');
        // Still mark as ready so we can play the video without audio
        setIsReady(true);
      };
      
      audio.addEventListener('error', handleAudioError);
      
      // If video is already ready, check audio
      if (video.readyState >= 2) {
        handleVideoReady();
      }
      
      return () => {
        audio.removeEventListener('loadeddata', handleAudioReady);
        audio.removeEventListener('error', handleAudioError);
      };
    } else if (video.readyState >= 2) {
      // No audio, but video is ready
      setIsReady(true);
    }
    
    // Calculate pause count
    const pauseActions = videoActions.filter(action => action.type === 'pause');
    setPauseCount(pauseActions.length);
    
    return () => {
      video.removeEventListener('loadeddata', handleVideoReady);
      
      // Clean up synchronizer
      if (synchronizerRef.current) {
        synchronizerRef.current.stop();
      }
    };
  }, [videoUrl, audioUrl, videoActions]);
  
  const startPlayback = async () => {
    if (!isReady || !videoRef.current) return;
    
    try {
      // Explicitly load media elements before starting
      videoRef.current.load();
      if (audioRef.current && audioUrl) {
        audioRef.current.load();
      }
      
      // Wait a small amount of time to ensure media is loaded
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Create and start synchronizer
      synchronizerRef.current = new PlaybackSynchronizer({
        videoElement: videoRef.current,
        audioElement: audioRef.current || undefined,
        actions: videoActions,
        onComplete: () => setIsPlaying(false)
      });
      
      await synchronizerRef.current.start();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error starting playback:', error);
      setLoadError('Failed to start synchronized playback. Please try again.');
    }
  };
  
  const stopPlayback = () => {
    if (synchronizerRef.current) {
      synchronizerRef.current.stop();
      setIsPlaying(false);
    }
  };
  
  const resetPlayback = () => {
    stopPlayback();
    if (videoRef.current) videoRef.current.currentTime = 0;
    if (audioRef.current) audioRef.current.currentTime = 0;
    setLoadError(null); // Clear any errors on reset
  };
  
  return (
    <Card className="w-full mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>Critique Playback</span>
          {pauseCount > 0 && (
            <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 px-2 py-1 rounded-full flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {pauseCount} pause{pauseCount !== 1 ? 's' : ''} synchronized
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video bg-slate-950 rounded-md overflow-hidden w-full">
          <video 
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            poster="/placeholder.svg"
            controls={false}
            preload="auto"
          />
          
          {/* Hidden audio element for critique playback */}
          {audioUrl && (
            <audio 
              ref={audioRef} 
              className="hidden" 
              preload="auto"
            />
          )}
        </div>
        
        {loadError && (
          <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 rounded text-red-700 dark:text-red-300 text-sm">
            {loadError}
          </div>
        )}
        
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
              <Pause className="w-4 h-4 mr-2" /> Pause
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
        
        {videoActions.length > 0 ? (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <p className="text-sm font-medium mb-1">Timeline Actions:</p>
            <p className="text-xs text-muted-foreground">
              {videoActions.length} timeline events including {pauseCount} pauses
            </p>
            
            {pauseCount > 0 && (
              <div className="mt-2 p-2 bg-green-100 dark:bg-green-900 rounded-md">
                <p className="text-xs text-green-800 dark:text-green-200 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Pauses made during recording will be respected during playback
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-amber-500 mt-2">
            No timeline actions recorded. Video will play without synchronized pauses.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SynchronizedCritiquePlayer;
