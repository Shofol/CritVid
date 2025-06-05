import React, { useRef, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { mockVideoSubmissions } from '@/data/mockData';

interface PlaybackPreviewPlayerProps {
  videoId?: string;
  critiqueId?: string;
  videoUrl?: string;
  audioUrl?: string;
  timelineEvents?: any[];
  drawActions?: any[];
}

const PlaybackPreviewPlayer: React.FC<PlaybackPreviewPlayerProps> = ({
  videoId,
  critiqueId,
  videoUrl,
  audioUrl,
  timelineEvents = [],
  drawActions = []
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoSrc, setVideoSrc] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Find video URL from mock data if videoId provided
    if (videoId && Array.isArray(mockVideoSubmissions)) {
      const video = mockVideoSubmissions.find(v => v && v.id === videoId);
      if (video?.videoUrl) {
        setVideoSrc(video.videoUrl);
      }
    } else if (videoUrl) {
      setVideoSrc(videoUrl);
    } else {
      // Use a test video URL that should work
      setVideoSrc('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
    }
  }, [videoId, videoUrl]);

  const handlePlayPause = async () => {
    const video = videoRef.current;
    if (!video) return;
    
    try {
      setError('');
      if (isPlaying) {
        video.pause();
        setIsPlaying(false);
      } else {
        // Check if video is ready
        if (video.readyState >= 2) {
          await video.play();
          setIsPlaying(true);
        } else {
          setError('Video not ready for playback');
        }
      }
    } catch (error: any) {
      console.error('Playback error:', error);
      setError(error.message || 'Playback failed');
      setIsPlaying(false);
    }
  };

  const handleRestart = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      setCurrentTime(0);
      if (isPlaying) {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      setCurrentTime(video.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
    }
  };

  const handleError = (e: any) => {
    console.error('Video error:', e);
    setError('Failed to load video');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
        {error ? (
          <div className="w-full h-full flex items-center justify-center text-white bg-gray-800">
            <div className="text-center">
              <p className="text-red-400 mb-2">Playback Error</p>
              <p className="text-sm text-gray-400">{error}</p>
            </div>
          </div>
        ) : (
          <video
            ref={videoRef}
            src={videoSrc}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            onError={handleError}
            playsInline
            controls={false}
            preload="metadata"
            crossOrigin="anonymous"
          />
        )}
        
        {/* Overlay for critique info */}
        {critiqueId && (
          <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
            Critique View
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button onClick={handleRestart} variant="outline" size="sm">
          <RotateCcw className="w-4 h-4 mr-2" />
          Restart
        </Button>
        
        <Button onClick={handlePlayPause} size="lg" disabled={!!error}>
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </Button>
      </div>

      {/* Timeline */}
      <div className="text-center space-y-2">
        <div className="text-sm text-gray-600">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-100"
            style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default PlaybackPreviewPlayer;