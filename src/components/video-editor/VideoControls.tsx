import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Pause, Play, SkipForward, SkipBack } from 'lucide-react';
import { saveVideoAction } from '@/lib/playbackSynchronizer';

interface VideoControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  onSaveDraft?: () => void;
  videoId?: string;
  showDebugInfo?: boolean;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  videoRef,
  onSaveDraft,
  videoId = 'sample',
  showDebugInfo = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [recordedActions, setRecordedActions] = useState<{type: string, time: number}[]>([]);

  // Format time in MM:SS format
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Record a video action (play, pause, seek) with timestamp
  const recordVideoAction = useCallback((type: 'play' | 'pause' | 'seek') => {
    if (!videoRef.current || !videoId) return;
    
    const videoTime = videoRef.current.currentTime;
    const timestamp = Date.now(); // Current timestamp in milliseconds
    
    // Save the action to localStorage via our helper function
    saveVideoAction(videoId, {
      type,
      timestamp,
      videoTime
    });
    
    // Also update local state for display
    setRecordedActions(prev => [...prev, {type, time: timestamp}]);
  }, [videoRef, videoId]);

  // Handle play/pause
  const togglePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      recordVideoAction('play');
    } else {
      video.pause();
      recordVideoAction('pause');
    }
  }, [videoRef, recordVideoAction]);

  // Handle seeking
  const handleSeek = useCallback((skipAmount: number) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = Math.max(0, Math.min(video.duration, video.currentTime + skipAmount));
    video.currentTime = newTime;
    recordVideoAction('seek');
  }, [videoRef, recordVideoAction]);

  // Update UI when video state changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(video.duration);
    };

    // Add event listeners
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);

    // Initialize values
    setIsPlaying(!video.paused);
    setCurrentTime(video.currentTime);
    setDuration(video.duration || 0);

    // Cleanup
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
    };
  }, [videoRef]);

  // Handle timeline click/scrub
  const handleTimelineClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const timeline = e.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * video.duration;

    video.currentTime = newTime;
    recordVideoAction('seek');
  }, [videoRef, recordVideoAction]);

  return (
    <div className="mt-4">
      {/* Timeline */}
      <div 
        className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full cursor-pointer relative"
        onClick={handleTimelineClick}
      >
        <div 
          className="absolute top-0 left-0 h-full bg-primary rounded-full"
          style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
        />
      </div>

      {/* Time display */}
      <div className="flex justify-between text-xs mt-1 text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleSeek(-10)}
            title="Skip back 10 seconds"
            type="button"
          >
            <SkipBack className="w-4 h-4" />
          </Button>

          <Button 
            variant={isPlaying ? "outline" : "default"}
            size="sm"
            onClick={togglePlayPause}
            title={isPlaying ? "Pause" : "Play"}
            type="button"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleSeek(10)}
            title="Skip forward 10 seconds"
            type="button"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {onSaveDraft && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onSaveDraft}
            title="Save draft"
            type="button"
          >
            <Save className="w-4 h-4 mr-1" /> Save Draft
          </Button>
        )}
      </div>

      {/* Debug info */}
      {showDebugInfo && (
        <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded text-xs">
          <p>Video ID: {videoId}</p>
          <p>Recorded Actions: {recordedActions.length}</p>
          <div className="max-h-20 overflow-y-auto">
            {recordedActions.map((action, i) => (
              <div key={i} className="flex justify-between">
                <span>{action.type}</span>
                <span>{new Date(action.time).toISOString().substr(11, 8)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoControls;
