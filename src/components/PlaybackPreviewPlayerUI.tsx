import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import VideoControls from './VideoControls';
import { RotateCcw, Eraser } from 'lucide-react';

interface PlaybackPreviewUIProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  audioRef: React.RefObject<HTMLAudioElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  videoUrl: string;
  audioUrl: string;
  canvasSize: { width: number; height: number };
  videoError: boolean;
  audioError: boolean;
  audioLoaded: boolean;
  isPlaying: boolean;
  drawActionsCount: number;
  timelineEventsCount: number;
  onRestart: () => void;
  onVideoAction: (action: { type: 'play' | 'pause' | 'seek'; time: number; fromTime?: number; toTime?: number }) => void;
}

const PlaybackPreviewPlayerUI: React.FC<PlaybackPreviewUIProps> = ({
  videoRef,
  audioRef,
  canvasRef,
  videoUrl,
  audioUrl,
  canvasSize,
  videoError,
  audioError,
  audioLoaded,
  isPlaying,
  drawActionsCount,
  timelineEventsCount,
  onRestart,
  onVideoAction,
}) => {
  const handleClearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Force clear the canvas (visual only)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log('🧹 Preview canvas cleared (visual only)');
  }, [canvasRef]);

  const handlePlayPause = useCallback(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video) return;
    
    if (video.paused) {
      video.play().catch(console.warn);
      // Sync audio with video
      if (audio && audioLoaded) {
        audio.currentTime = video.currentTime;
        audio.play().catch(() => console.warn('Audio sync failed'));
      }
      onVideoAction({ type: 'play', time: video.currentTime });
    } else {
      video.pause();
      if (audio && audioLoaded) {
        audio.pause();
      }
      onVideoAction({ type: 'pause', time: video.currentTime });
    }
  }, [videoRef, audioRef, audioLoaded, onVideoAction]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Critique Preview</h2>
      
      <div className="w-full max-w-4xl mx-auto space-y-4">
        {videoError ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Failed to load video. Please check the video URL.
          </div>
        ) : (
          <div className="relative">
            {/* Single video player - removed duplicate */}
            <div className="text-xs text-blue-600 mb-2">
              🎬 Single synchronized video player
            </div>
          </div>
        )}
        
        {!videoError && (
          <VideoControls 
            videoRef={videoRef} 
            className="w-full" 
            onVideoAction={onVideoAction}
          />
        )}
        
        <div className="flex justify-center gap-3">
          <Button 
            onClick={handlePlayPause} 
            variant="default" 
            className="flex items-center gap-2"
            disabled={videoError}
          >
            {isPlaying ? '⏸️' : '▶️'}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          
          <Button onClick={onRestart} variant="outline" className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Restart Preview
          </Button>
          
          <Button 
            onClick={handleClearCanvas} 
            variant="outline" 
            className="flex items-center gap-2"
            disabled={drawActionsCount === 0}
          >
            <Eraser className="w-4 h-4" />
            Clear Canvas (Visual)
          </Button>
        </div>
        
        <div className="text-sm text-gray-600 space-y-1 bg-gray-50 p-3 rounded">
          <div>Drawing Actions: {drawActionsCount} (with auto-fade)</div>
          <div>Timeline Events: {timelineEventsCount} (with pause simulation)</div>
          <div className="flex items-center gap-2">
            <span>Audio Sync:</span>
            {audioUrl ? (
              <span className={audioError ? 'text-red-600' : audioLoaded ? 'text-green-600' : 'text-yellow-600'}>
                {audioError ? 'Failed to load' : audioLoaded ? '🎵 Master Control Active' : 'Loading...'}
              </span>
            ) : (
              <span className="text-gray-500">No audio recorded</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span>Playback:</span>
            <span className={isPlaying ? 'text-green-600' : 'text-gray-600'}>
              {isPlaying ? '▶️ Playing (Audio-Synced)' : '⏸️ Paused'}
            </span>
          </div>
          {audioLoaded && (
            <div className="text-xs text-blue-600">
              ⚡ Audio controls master timeline - Video syncs to audio
            </div>
          )}
          {videoError && <div className="text-red-600">Video: Error</div>}
        </div>
      </div>
    </div>
  );
};

export default PlaybackPreviewPlayerUI;