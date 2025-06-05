import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Clock, Bug } from 'lucide-react';
import { PlaybackSynchronizer, loadVideoActions } from '@/lib/playbackSynchronizer';
import { VideoAction } from '@/types/timelineTypes';
import { debugAudioStorage } from '@/lib/audioStorage';

interface DebugCritiquePlayerProps {
  videoUrl: string;
  audioUrl: string | null;
  videoId: string;
}

const DebugCritiquePlayer: React.FC<DebugCritiquePlayerProps> = ({
  videoUrl,
  audioUrl,
  videoId
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const synchronizerRef = useRef<PlaybackSynchronizer | null>(null);
  
  // Load video actions from localStorage
  const videoActions = loadVideoActions(videoId);
  
  // Custom logger that also updates state
  const log = (message: string) => {
    console.log(`[Debug] ${message}`);
    setLogs(prev => [`${new Date().toISOString().split('T')[1].split('.')[0]} - ${message}`, ...prev]);
  };
  
  useEffect(() => {
    // Debug storage to verify data is available
    debugAudioStorage(videoId);
    log(`Loaded ${videoActions.length} actions for ${videoId}`);
    
    // Initialize when video is ready (audio is optional)
    const video = videoRef.current;
    const audio = audioRef.current;
    
    if (!video) return;
    
    const handleVideoReady = () => {
      log('Video loaded and ready');
      // Video is ready, check if we need to wait for audio
      if (audioUrl && audio) {
        if (audio.readyState >= 2) {
          setIsReady(true);
          log('Audio also ready - player initialized');
        }
      } else {
        // No audio or audio not available, just use video
        setIsReady(true);
        log('No audio or audio not required - player initialized');
      }
    };
    
    const handleAudioReady = () => {
      log('Audio loaded and ready');
      if (video.readyState >= 2) {
        setIsReady(true);
        log('Video also ready - player initialized');
      }
    };
    
    const handleVideoError = (e: Event) => {
      log(`Video error: ${e.type}`);
      setPlaybackError('Video failed to load');
    };
    
    const handleAudioError = (e: Event) => {
      log(`Audio error: ${e.type}`);
      setPlaybackError('Audio failed to load');
    };
    
    // Set up event listeners
    video.addEventListener('loadeddata', handleVideoReady);
    video.addEventListener('error', handleVideoError);
    
    // Set up audio if available
    if (audioUrl && audio) {
      log(`Setting audio source: ${audioUrl}`);
      audio.addEventListener('loadeddata', handleAudioReady);
      audio.addEventListener('error', handleAudioError);
      // Explicitly set the audio source and preload it
      audio.load();
    } else {
      // No audio, so we're ready when video is ready
      if (video.readyState >= 2) {
        setIsReady(true);
        log('No audio needed, video ready - player initialized');
      }
    }
    
    // Explicitly load the video
    log(`Setting video source: ${videoUrl}`);
    video.load();
    
    return () => {
      video.removeEventListener('loadeddata', handleVideoReady);
      video.removeEventListener('error', handleVideoError);
      if (audio) {
        audio.removeEventListener('loadeddata', handleAudioReady);
        audio.removeEventListener('error', handleAudioError);
      }
      
      // Clean up synchronizer
      if (synchronizerRef.current) {
        synchronizerRef.current.stop();
      }
    };
  }, [videoUrl, audioUrl, videoActions, videoId]);
  
  // Create a custom synchronizer that logs actions
  const createDebugSynchronizer = () => {
    if (!videoRef.current) return null;
    
    const synchronizer = new PlaybackSynchronizer({
      videoElement: videoRef.current,
      audioElement: audioRef.current || undefined,
      actions: videoActions,
      onComplete: () => {
        log('Playback complete');
        setIsPlaying(false);
      }
    });
    
    // Override the executeAction method to add logging
    const originalExecuteAction = synchronizer.executeAction.bind(synchronizer);
    synchronizer.executeAction = async (action: VideoAction) => {
      log(`Executing action: ${action.type.toUpperCase()} at ${action.timestamp}ms` + 
          (action.videoTime !== undefined ? `, video time: ${action.videoTime.toFixed(2)}s` : ''));
      return originalExecuteAction(action);
    };
    
    return synchronizer;
  };
  
  const startPlayback = async () => {
    if (!isReady || !videoRef.current) return;
    
    try {
      setPlaybackError(null);
      log(`Starting synchronized playback with ${videoActions.length} actions`);
      
      // Create debug synchronizer
      synchronizerRef.current = createDebugSynchronizer();
      if (!synchronizerRef.current) {
        throw new Error('Failed to create synchronizer');
      }
      
      // Explicitly load media elements before starting
      videoRef.current.load();
      if (audioRef.current && audioUrl) {
        audioRef.current.load();
      }
      
      // Wait a small amount of time to ensure media is loaded
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await synchronizerRef.current.start();
      setIsPlaying(true);
      log('Playback started successfully');
    } catch (error) {
      console.error('Failed to start synchronized playback:', error);
      log(`Error starting playback: ${error}`);
      setPlaybackError('Failed to start playback. Please try again.');
      // Reset state if playback fails
      setIsPlaying(false);
    }
  };
  
  const stopPlayback = () => {
    if (synchronizerRef.current) {
      synchronizerRef.current.stop();
      setIsPlaying(false);
      log('Playback stopped manually');
    }
  };
  
  const resetPlayback = () => {
    stopPlayback();
    if (videoRef.current) videoRef.current.currentTime = 0;
    if (audioRef.current) audioRef.current.currentTime = 0;
    log('Playback reset to beginning');
  };
  
  const clearLogs = () => {
    setLogs([]);
  };
  
  return (
    <Card className="w-full mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center">
            <Bug className="w-4 h-4 mr-2" />
            Debug Critique Player
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearLogs}
            title="Clear logs"
            type="button"
          >
            Clear Logs
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video bg-slate-950 rounded-md overflow-hidden w-full">
          <video 
            ref={videoRef}
            className="w-full h-full object-contain"
            poster="/placeholder.svg"
            // Disable native controls since we're controlling playback
            controls={false}
            preload="auto"
            crossOrigin="anonymous"
            playsInline
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Hidden audio element for critique playback */}
          {audioUrl && (
            <audio 
              ref={audioRef} 
              preload="auto"
              className="hidden"
            >
              <source src={audioUrl} type="audio/webm" />
              <source src={audioUrl} type="audio/mp3" />
              <source src={audioUrl} type="audio/mpeg" />
              <source src={audioUrl} type="audio/wav" />
            </audio>
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
              <Play className="w-4 h-4 mr-2" /> Play with Debug
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
        
        {playbackError && (
          <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/20 rounded-md">
            <p className="text-sm text-red-800 dark:text-red-200">
              {playbackError}
            </p>
          </div>
        )}
        
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Debug Log ({logs.length} entries)
          </h3>
          <div className="bg-slate-950 text-slate-200 p-2 rounded-md h-[200px] overflow-y-auto font-mono text-xs">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="border-b border-slate-800 pb-1 mb-1 last:border-0">
                  {log}
                </div>
              ))
            ) : (
              <p className="text-slate-500">No logs yet. Start playback to see debug information.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugCritiquePlayer;
