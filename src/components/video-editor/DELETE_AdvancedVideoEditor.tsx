import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Mic, MicOff, Download, Upload } from 'lucide-react';

// DEPRECATED: This component is no longer used in the unified critique system
// Use PlaybackTracker.tsx instead

interface AdvancedVideoEditorProps {
  videoUrl: string;
  onSave?: (data: any) => void;
}

const DELETE_AdvancedVideoEditor: React.FC<AdvancedVideoEditorProps> = ({
  videoUrl,
  onSave
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([100]);
  const [playbackSpeed, setPlaybackSpeed] = useState([1]);
  const [annotations, setAnnotations] = useState<any[]>([]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Recording logic would go here
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (value[0] / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = value[0] / 100;
    setVolume(value);
  };

  const handleSpeedChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = value[0];
    setPlaybackSpeed(value);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <Card>
        <CardContent className="p-0">
          <div className="relative">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-auto"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            
            {/* Recording Indicator */}
            {isRecording && (
              <div className="absolute top-4 right-4">
                <Badge variant="destructive" className="animate-pulse">
                  🔴 Recording
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Video Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant={isPlaying ? "default" : "outline"}
              size="sm"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const video = videoRef.current;
                if (video) {
                  video.currentTime = 0;
                  setCurrentTime(0);
                }
              }}
            >
              <Square className="h-4 w-4" />
            </Button>

            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="sm"
              onClick={toggleRecording}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>

            <span className="text-sm text-gray-500">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
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
            <label className="text-sm font-medium">Volume: {volume[0]}%</label>
            <Slider
              value={volume}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          {/* Playback Speed */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Speed: {playbackSpeed[0]}x</label>
            <Slider
              value={playbackSpeed}
              onValueChange={handleSpeedChange}
              min={0.25}
              max={2}
              step={0.25}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Export Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Export</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Export Video
            </Button>
            <Button variant="outline" className="flex-1">
              <Upload className="h-4 w-4 mr-2" />
              Save Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DELETE_AdvancedVideoEditor;