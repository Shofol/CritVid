import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { getPreviewAudio } from '@/lib/dualAudioStorage';

interface DualAudioPreviewPlayerProps {
  videoId: string;
  videoRef?: React.RefObject<HTMLVideoElement>;
  onSyncStateChange?: (isSynced: boolean) => void;
}

export function DualAudioPreviewPlayer({
  videoId,
  videoRef,
  onSyncStateChange
}: DualAudioPreviewPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncOffset, setSyncOffset] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const syncIntervalRef = useRef<number | null>(null);

  // Load preview audio on mount
  useEffect(() => {
    const loadPreviewAudio = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const url = await getPreviewAudio(videoId);
        if (url) {
          setAudioUrl(url);
        } else {
          setError('No preview audio found');
        }
      } catch (err) {
        console.error('Failed to load preview audio:', err);
        setError('Failed to load preview audio');
      } finally {
        setIsLoading(false);
      }
    };

    if (videoId) {
      loadPreviewAudio();
    }
  }, [videoId]);

  // Sync audio with video
  useEffect(() => {
    if (!audioRef.current || !videoRef?.current || !isPlaying) {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
      return;
    }

    // Start sync monitoring
    syncIntervalRef.current = window.setInterval(() => {
      const audio = audioRef.current;
      const video = videoRef.current;
      
      if (audio && video) {
        const timeDiff = Math.abs(audio.currentTime - video.currentTime);
        const isInSync = timeDiff < 0.1; // 100ms tolerance
        
        onSyncStateChange?.(isInSync);
        
        // Auto-correct if drift is significant
        if (timeDiff > 0.2) {
          audio.currentTime = video.currentTime;
          setSyncOffset(timeDiff);
        }
      }
    }, 100);

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [isPlaying, videoRef, onSyncStateChange]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Sync with video if available
      if (videoRef?.current) {
        audioRef.current.currentTime = videoRef.current.currentTime;
      }
      
      audioRef.current.play().catch(err => {
        console.error('Failed to play audio:', err);
        setError('Failed to play audio');
      });
      setIsPlaying(true);
    }
  };

  const handleMuteToggle = () => {
    if (!audioRef.current) return;
    
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleAudioError = () => {
    setError('Audio playback error');
    setIsPlaying(false);
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="text-center text-sm text-gray-500">
          Loading preview audio...
        </div>
      </Card>
    );
  }

  if (error || !audioUrl) {
    return (
      <Card className="p-4">
        <div className="text-center text-sm text-red-500">
          {error || 'No preview audio available'}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Preview Audio</h4>
        {syncOffset > 0.1 && (
          <span className="text-xs text-yellow-600">
            Sync offset: {syncOffset.toFixed(2)}s
          </span>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handlePlayPause}
          className="flex items-center space-x-1"
        >
          {isPlaying ? (
            <Pause className="w-3 h-3" />
          ) : (
            <Play className="w-3 h-3" />
          )}
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={handleMuteToggle}
          className="flex items-center space-x-1"
        >
          {isMuted ? (
            <VolumeX className="w-3 h-3" />
          ) : (
            <Volume2 className="w-3 h-3" />
          )}
        </Button>

        <div className="text-xs text-gray-500">
          Synced with video timeline
        </div>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={handleAudioEnded}
        onError={handleAudioError}
        preload="auto"
      />
    </Card>
  );
}