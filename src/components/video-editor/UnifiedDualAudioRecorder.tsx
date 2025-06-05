import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, Square, Play, Pause, Volume2 } from 'lucide-react';
import { useDualAudioRecorder } from '@/hooks/useDualAudioRecorder';

interface UnifiedDualAudioRecorderProps {
  videoId: string;
  videoRef?: React.RefObject<HTMLVideoElement>;
}

export function UnifiedDualAudioRecorder({ videoId, videoRef }: UnifiedDualAudioRecorderProps) {
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [rawBlob, setRawBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const { startRecording, stopRecording, clearRecording, state } = useDualAudioRecorder({
    onStart: () => setSaveStatus('Recording...'),
    onStop: (preview, raw) => {
      setPreviewBlob(preview);
      setRawBlob(raw);
      
      // Create preview URL for immediate playback
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
      previewUrlRef.current = URL.createObjectURL(preview);
      setSaveStatus('Recording complete - ready for playback');
    },
    onError: (error) => setSaveStatus(`Error: ${error.message}`)
  });

  const handleSave = async () => {
    if (!previewBlob || !rawBlob) return;
    
    setSaveStatus('Saving...');
    try {
      // Save to localStorage as fallback since backend is inactive
      const previewBase64 = await blobToBase64(previewBlob);
      const rawBase64 = await blobToBase64(rawBlob);
      
      localStorage.setItem(`dual_audio_preview_${videoId}`, previewBase64);
      localStorage.setItem(`dual_audio_raw_${videoId}`, rawBase64);
      localStorage.setItem(`dual_audio_timestamp_${videoId}`, Date.now().toString());
      
      setSaveStatus('Saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('Save failed');
    }
  };

  const handlePlayPreview = () => {
    if (!audioRef.current || !previewUrlRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Sync with video if available
      if (videoRef?.current) {
        audioRef.current.currentTime = videoRef.current.currentTime;
      }
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Dual Audio System</h3>
        {state.isRecording && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-mono">{formatTime(state.elapsedTime)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {!state.isRecording ? (
          <Button onClick={startRecording} className="flex items-center space-x-2">
            <Mic className="w-4 h-4" />
            <span>Start Recording</span>
          </Button>
        ) : (
          <Button onClick={stopRecording} variant="destructive" className="flex items-center space-x-2">
            <Square className="w-4 h-4" />
            <span>Stop Recording</span>
          </Button>
        )}

        {previewBlob && (
          <>
            <Button onClick={handlePlayPreview} variant="outline" size="sm">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button onClick={handleSave} variant="outline" size="sm">
              Save Both
            </Button>
          </>
        )}
      </div>

      {saveStatus && (
        <div className={`text-sm p-2 rounded ${
          saveStatus.includes('Error') ? 'bg-red-100 text-red-700' : 
          saveStatus.includes('complete') || saveStatus.includes('successfully') ? 'bg-green-100 text-green-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {saveStatus}
        </div>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p>• Records two audio streams simultaneously</p>
        <p>• Preview: Synced with video timeline for playback</p>
        <p>• Raw: Clean audio for AI transcription</p>
        <p>• Prevents desync issues during critique playback</p>
      </div>

      {previewUrlRef.current && (
        <audio
          ref={audioRef}
          src={previewUrlRef.current}
          onEnded={() => setIsPlaying(false)}
          onError={() => setSaveStatus('Playback error')}
          preload="auto"
        />
      )}
    </Card>
  );
}