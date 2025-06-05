import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, Download } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

// DEPRECATED: This component is no longer used in the unified critique system
// Use PlaybackTracker.tsx instead

interface MuxCritiquePlayerProps {
  playbackId: string;
  critiqueAudioUrl?: string;
  annotations?: any[];
  onTimeUpdate?: (time: number) => void;
}

const DELETE_MuxCritiquePlayer: React.FC<MuxCritiquePlayerProps> = ({
  playbackId,
  critiqueAudioUrl,
  annotations = [],
  onTimeUpdate
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([100]);
  const [audioSynced, setAudioSynced] = useState(false);

  const muxVideoUrl = `https://stream.mux.com/${playbackId}.m3u8`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const time = video.currentTime;
      setCurrentTime(time);
      if (onTimeUpdate) {
        onTimeUpdate(time);
      }
      
      // Sync critique audio
      if (audioRef.current && critiqueAudioUrl && audioSynced) {
        const audioDiff = Math.abs(audioRef.current.currentTime - time);
        if (audioDiff > 0.5) { // Sync if more than 0.5 seconds off
          audioRef.current.currentTime = time;
        }
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      if (audioRef.current && critiqueAudioUrl) {
        audioRef.current.currentTime = video.currentTime;
        audioRef.current.play().catch(console.error);
        setAudioSynced(true);
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [critiqueAudioUrl, audioSynced, onTimeUpdate]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (video) {
      video.volume = value[0] / 100;
      setVolume(value);
    }
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (value[0] / 100) * duration;
    video.currentTime = newTime;
    
    if (audioRef.current && critiqueAudioUrl) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getActiveAnnotations = () => {
    return annotations.filter(annotation => {
      const start = annotation.startTime || 0;
      const end = annotation.endTime || duration;
      return currentTime >= start && currentTime <= end;
    });
  };

  return (
    <div className="space-y-4">
      {/* Video Player */}
      <Card>
        <CardContent className="p-0">
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full h-auto"
              controls={false}
            >
              <source src={muxVideoUrl} type="application/x-mpegURL" />
              Your browser does not support HLS video.
            </video>
            
            {/* Active Annotations Overlay */}
            {getActiveAnnotations().length > 0 && (
              <div className="absolute top-4 left-4 space-y-2">
                {getActiveAnnotations().map((annotation, index) => (
                  <Badge key={index} variant="secondary" className="block">
                    {annotation.text || 'Annotation'}
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Critique Audio Indicator */}
            {critiqueAudioUrl && audioSynced && (
              <div className="absolute top-4 right-4">
                <Badge variant="default">
                  🎤 Commentary
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Playback Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Play/Pause and Time */}
          <div className="flex items-center gap-4">
            <Button
              variant={isPlaying ? "default" : "outline"}
              size="sm"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <span className="text-sm text-gray-500">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            
            {critiqueAudioUrl && (
              <Badge variant={audioSynced ? "default" : "secondary"}>
                Audio {audioSynced ? 'Synced' : 'Loading'}
              </Badge>
            )}
          </div>

          {/* Timeline Scrubber */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Timeline</label>
            <Slider
              value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Volume Control */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Volume: {volume[0]}%
            </label>
            <Slider
              value={volume}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Hidden Audio Element for Critique */}
      {critiqueAudioUrl && (
        <audio
          ref={audioRef}
          src={critiqueAudioUrl}
          preload="auto"
          style={{ display: 'none' }}
        />
      )}

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download Critique
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DELETE_MuxCritiquePlayer;