import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Video, AlertCircle, Clock } from 'lucide-react';
import { PlaybackSynchronizer, loadVideoActions } from '@/lib/playbackSynchronizer';
import { VideoAction } from '@/types/timelineTypes';
import VideoActionsList from './VideoActionsList';
import DrawingCanvas from './DrawingCanvas';

interface EnhancedCritiquePlayerProps {
  videoUrl?: string;
  audioUrl?: string | null;
  videoId?: string;
  drawingData?: string | null;
  showDebugInfo?: boolean;
}

const EnhancedCritiquePlayer: React.FC<EnhancedCritiquePlayerProps> = ({
  videoUrl,
  audioUrl,
  videoId = '',
  drawingData,
  showDebugInfo = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [audioStatus, setAudioStatus] = useState<'loading' | 'ready' | 'error' | 'none'>(
    audioUrl ? 'loading' : 'none'
  );
  const [pauseCount, setPauseCount] = useState(0);
  const synchronizerRef = useRef<PlaybackSynchronizer | null>(null);
  
  // Load video actions from localStorage if videoId is provided
  const videoActions = videoId ? loadVideoActions(videoId) : [];
  
  useEffect(() => {
    // Initialize when both video and audio are ready
    const video = videoRef.current;
    const audio = audioRef.current;
    
    if (!video) {
      setError('Video element not initialized');
      return;
    }
    
    // Check video URL
    if (!videoUrl) {
      setError('No video source available');
      setVideoStatus('error');
      return;
    }
    
    // Set up event listeners for video
    const handleVideoError = () => {
      setError('Error loading video');
      setVideoStatus('error');
    };
    
    const handleVideoReady = () => {
      if (video.readyState >= 2) {
        setVideoStatus('ready');
        checkIfReady();
      }
    };
    
    // Set up event listeners for audio if available
    const handleAudioError = () => {
      setAudioStatus('error');
    };
    
    const handleAudioReady = () => {
      if (!audio) return;
      if (audio.readyState >= 2) {
        setAudioStatus('ready');
        checkIfReady();
      }
    };
    
    const checkIfReady = () => {
      const videoReady = video.readyState >= 2;
      const audioReady = !audioUrl || !audio || audio.readyState >= 2;
      
      if (videoReady && audioReady) {
        setIsReady(true);
      }
    };
    
    video.addEventListener('loadeddata', handleVideoReady);
    video.addEventListener('canplay', handleVideoReady);
    video.addEventListener('error', handleVideoError);
    
    if (audio && audioUrl) {
      audio.addEventListener('loadeddata', handleAudioReady);
      audio.addEventListener('canplay', handleAudioReady);
      audio.addEventListener('error', handleAudioError);
      
      // Set audio source
      try {
        audio.src = audioUrl;
      } catch (err) {
        setAudioStatus('error');
      }
    } else {
      // No audio, so just check if video is ready
      checkIfReady();
    }
    
    // Calculate pause count
    const pauseActions = videoActions.filter(action => action.type === 'pause');
    setPauseCount(pauseActions.length);
    
    return () => {
      video.removeEventListener('loadeddata', handleVideoReady);
      video.removeEventListener('canplay', handleVideoReady);
      video.removeEventListener('error', handleVideoError);
      
      if (audio) {
        audio.removeEventListener('loadeddata', handleAudioReady);
        audio.removeEventListener('canplay', handleAudioReady);
        audio.removeEventListener('error', handleAudioError);
      }
      
      // Clean up synchronizer
      if (synchronizerRef.current) {
        synchronizerRef.current.stop();
      }
    };
  }, [videoUrl, audioUrl, videoActions]);
  
  const startPlayback = async () => {
    if (!isReady || !videoRef.current) return;
    
    try {
      setError(null);
      
      // Create synchronizer with optional audio element
      synchronizerRef.current = new PlaybackSynchronizer({
        videoElement: videoRef.current,
        audioElement: audioRef.current || undefined,
        actions: videoActions,
        onComplete: () => setIsPlaying(false)
      });
      
      // Explicitly load media elements before starting
      videoRef.current.load();
      if (audioRef.current && audioUrl) {
        audioRef.current.load();
      }
      
      // Wait a small amount of time to ensure media is loaded
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await synchronizerRef.current.start();
      setIsPlaying(true);
    } catch (error) {
      console.error('Failed to start synchronized playback:', error);
      setError('Failed to start playback. Please try again.');
      // Reset state if playback fails
      setIsPlaying(false);
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
  };
  
  // If no video source is provided, show a message
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
          <span className="flex items-center">
            <Video className="w-4 h-4 mr-2" />
            {videoActions.length > 0 ? 'Synchronized Critique Playback' : 'Critique Playback'}
          </span>
          {pauseCount > 0 && (
            <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 px-2 py-1 rounded-full flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {pauseCount} pause{pauseCount !== 1 ? 's' : ''} will be synchronized
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
          />
          
          {/* Hidden audio element for critique playback */}
          <audio ref={audioRef} className="hidden" />
          
          {/* Drawing canvas for displaying annotations */}
          {drawingData && <DrawingCanvas isDrawing={false} videoRef={videoRef} />}
          
          {/* Error overlay */}
          {videoStatus === 'error' && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
              <div className="text-white text-center p-4">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p>Video failed to load</p>
              </div>
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
          <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900 rounded-md">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              No audio recording available for this critique.
            </p>
          </div>
        )}
        
        {videoActions.length > 0 ? (
          <div className="mt-4">
            <p className="text-sm font-medium mb-1">Timeline Actions:</p>
            <VideoActionsList 
              actions={videoActions} 
              maxHeight="150px" 
              showTitle={false}
            />
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

export default EnhancedCritiquePlayer;
