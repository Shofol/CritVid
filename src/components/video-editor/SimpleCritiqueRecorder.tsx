import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { saveCritiqueRecording, saveAudioBlob } from '@/lib/critiqueStorage';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import AICritiqueFeedback from './AICritiqueFeedback';

interface SimpleCritiqueRecorderProps {
  videoId: string;
  videoRef?: React.RefObject<HTMLVideoElement>;
  onSave?: () => void;
  onDiscard?: () => void;
}

/**
 * A simplified critique recorder component
 */
const SimpleCritiqueRecorder: React.FC<SimpleCritiqueRecorderProps> = ({
  videoId,
  videoRef,
  onSave,
  onDiscard
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [drawingData, setDrawingData] = useState<any[]>([]);

  // Use the audio recorder hook
  const {
    startRecording,
    stopRecording,
    clearRecording,
    state: audioRecorderState
  } = useAudioRecorder({
    onStart: () => {
      console.log('Recording started');
      setError(null);
      setSaveSuccess(false);
    },
    onStop: (blob) => {
      console.log('Recording stopped, blob size:', blob.size);
    },
    onError: (err) => {
      console.error('Recording error:', err);
      setError(`Recording error: ${err.message}`);
    }
  });

  const { isRecording, elapsedTime, audioBlob } = audioRecorderState;

  // Format the elapsed time as mm:ss
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle stopping and saving the recording
  const handleStopAndSave = async () => {
    try {
      setIsSaving(true);
      const blob = await stopRecording();
      
      if (!blob) {
        throw new Error('No recording data available');
      }
      
      // Save the audio blob
      const audioUrl = await saveAudioBlob(videoId, blob);
      setAudioUrl(audioUrl);
      
      // Save the critique recording with drawing data and timestamp
      await saveCritiqueRecording(videoId, {
        videoId,
        audioBlob: blob,
        duration: elapsedTime / 1000, // Convert ms to seconds
        drawingData, // Include drawing data
        timestamp: Date.now() // Add timestamp
      });
      
      setSaveSuccess(true);
      setIsSaving(false);
      onSave?.();
    } catch (err) {
      console.error('Error saving recording:', err);
      setError('Failed to save recording. Please try again.');
      setIsSaving(false);
    }
  };

  // Handle discarding the recording
  const handleDiscard = () => {
    if (isRecording) {
      stopRecording();
    }
    clearRecording();
    setAudioUrl(null);
    setSaveSuccess(false);
    onDiscard?.();
  };

  // Sync video and audio playback
  const syncPlayback = (action: 'play' | 'pause', currentTime?: number) => {
    if (!audioRef.current || !videoRef?.current) return;
    
    if (action === 'play') {
      // Play both video and audio
      videoRef.current.play();
      audioRef.current.play();
      
      // Sync current time if provided
      if (currentTime !== undefined) {
        videoRef.current.currentTime = currentTime;
        audioRef.current.currentTime = currentTime;
      }
    } else if (action === 'pause') {
      // Pause both video and audio
      videoRef.current.pause();
      audioRef.current.pause();
    }
  };

  // Play the recorded audio and sync with video
  const playRecordedAudio = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = url;
        
        // Set up event listeners for syncing
        audioRef.current.onplay = () => syncPlayback('play');
        audioRef.current.onpause = () => syncPlayback('pause');
        audioRef.current.ontimeupdate = () => {
          if (videoRef?.current && Math.abs(audioRef.current!.currentTime - videoRef.current.currentTime) > 0.5) {
            videoRef.current.currentTime = audioRef.current!.currentTime;
          }
        };
        
        audioRef.current.play();
        
        // Clean up the URL object when done
        audioRef.current.onended = () => {
          URL.revokeObjectURL(url);
        };
      }
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {saveSuccess && (
        <Alert variant="default" className="bg-green-50 border-green-200">
          <AlertDescription>Critique saved successfully!</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center">
        <div>
          {/* Recording Status */}
          {isRecording && (
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse mr-2"></div>
              <span>Recording: {formatTime(elapsedTime)}</span>
            </div>
          )}
          
          {isSaving && (
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse mr-2"></div>
              <span>Saving critique...</span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          {/* Recording Controls */}
          {!isRecording && !isSaving ? (
            <Button onClick={startRecording} variant="default">
              Start Recording
            </Button>
          ) : isRecording ? (
            <>
              <Button onClick={handleStopAndSave} variant="default" disabled={isSaving}>
                Stop & Save
              </Button>
              <Button onClick={handleDiscard} variant="destructive" disabled={isSaving}>
                Discard
              </Button>
            </>
          ) : null}
          
          {/* Play recorded audio */}
          {audioBlob && !isRecording && !isSaving && (
            <Button onClick={playRecordedAudio} variant="outline">
              Play Recording
            </Button>
          )}
        </div>
      </div>
      
      {/* Audio player (hidden but functional) */}
      <audio ref={audioRef} controls={audioBlob !== null} className={audioBlob ? "w-full mt-2" : "hidden"} />
      
      {/* AI Feedback section - shown after recording is complete */}
      {audioBlob && !isRecording && (
        <AICritiqueFeedback />
      )}
    </div>
  );
};

export default SimpleCritiqueRecorder;
