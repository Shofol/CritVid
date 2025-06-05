import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Play, Pause, Square, Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

// DEPRECATED: This component is no longer used in the unified critique system
// Use PlaybackTracker.tsx instead

interface DualAudioCritiqueRecorderProps {
  videoUrl: string;
  onRecordingComplete?: (audioUrl: string) => void;
}

const DELETE_DualAudioCritiqueRecorder: React.FC<DualAudioCritiqueRecorderProps> = ({
  videoUrl,
  onRecordingComplete
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [videoVolume, setVideoVolume] = useState([50]);
  const [micVolume, setMicVolume] = useState([80]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && recordingStartTime) {
      interval = setInterval(() => {
        setRecordingDuration((Date.now() - recordingStartTime) / 1000);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRecording, recordingStartTime]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
        if (onRecordingComplete) {
          onRecordingComplete(audioUrl);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingStartTime(Date.now());
      setRecordingDuration(0);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingStartTime(null);
    }
  };

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

  const handleVideoVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (video) {
      video.volume = value[0] / 100;
      setVideoVolume(value);
    }
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
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            
            {/* Recording Status Overlay */}
            {isRecording && (
              <div className="absolute top-4 left-4">
                <Badge variant="destructive" className="animate-pulse">
                  🔴 Recording {formatTime(recordingDuration)}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dual Audio Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Video Audio Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Video Audio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Volume: {videoVolume[0]}%</label>
              <Slider
                value={videoVolume}
                onValueChange={handleVideoVolumeChange}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            
            <div className="flex items-center gap-2">
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
            </div>
          </CardContent>
        </Card>

        {/* Microphone Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Microphone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Input Level: {micVolume[0]}%</label>
              <Slider
                value={micVolume}
                onValueChange={setMicVolume}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={isRecording ? "destructive" : "default"}
                size="sm"
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    Record
                  </>
                )}
              </Button>
              
              {isRecording && (
                <span className="text-sm text-red-600">
                  {formatTime(recordingDuration)}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recorded Audio Playback */}
      {recordedAudioUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Recorded Commentary</CardTitle>
          </CardHeader>
          <CardContent>
            <audio controls className="w-full">
              <source src={recordedAudioUrl} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DELETE_DualAudioCritiqueRecorder;