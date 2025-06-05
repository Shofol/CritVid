import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Square, Play, Pause } from 'lucide-react';
import { useDualAudioRecorder } from '@/hooks/useDualAudioRecorder';
import { saveDualAudioRecordings } from '@/lib/dualAudioStorage';
import { RecordingTimer } from './RecordingTimer';
import { AudioVolumeControl } from './AudioVolumeControl';

interface DualAudioCritiqueRecorderProps {
  videoId: string;
  onRecordingComplete?: (previewBlob: Blob, rawBlob: Blob) => void;
  onError?: (error: Error) => void;
}

export function DualAudioCritiqueRecorder({
  videoId,
  onRecordingComplete,
  onError
}: DualAudioCritiqueRecorderProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('');
  const previewBlobRef = useRef<Blob | null>(null);
  const rawBlobRef = useRef<Blob | null>(null);

  const { startRecording, stopRecording, clearRecording, state } = useDualAudioRecorder({
    onStart: () => {
      console.log('Dual audio recording started');
      setSaveStatus('');
    },
    onStop: (previewBlob, rawBlob) => {
      console.log('Dual audio recording stopped');
      previewBlobRef.current = previewBlob;
      rawBlobRef.current = rawBlob;
      onRecordingComplete?.(previewBlob, rawBlob);
    },
    onError: (error) => {
      console.error('Dual audio recording error:', error);
      setSaveStatus(`Error: ${error.message}`);
      onError?.(error);
    }
  });

  const handleStartRecording = async () => {
    try {
      await startRecording();
    } catch (error) {
      console.error('Failed to start recording:', error);
      setSaveStatus('Failed to start recording');
    }
  };

  const handleStopRecording = async () => {
    try {
      const result = await stopRecording();
      if (result?.preview && result?.raw) {
        previewBlobRef.current = result.preview;
        rawBlobRef.current = result.raw;
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setSaveStatus('Failed to stop recording');
    }
  };

  const handleSaveRecordings = async () => {
    if (!previewBlobRef.current || !rawBlobRef.current) {
      setSaveStatus('No recordings to save');
      return;
    }

    setIsSaving(true);
    setSaveStatus('Saving recordings...');

    try {
      const result = await saveDualAudioRecordings(
        videoId,
        previewBlobRef.current,
        rawBlobRef.current
      );
      
      setSaveStatus(`Saved successfully! Preview ID: ${result.previewId}, Raw ID: ${result.rawId}`);
      
      // Clear the recordings after successful save
      setTimeout(() => {
        clearRecording();
        previewBlobRef.current = null;
        rawBlobRef.current = null;
        setSaveStatus('');
      }, 3000);
      
    } catch (error) {
      console.error('Failed to save recordings:', error);
      setSaveStatus(`Save failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Dual Audio Recording</h3>
        <div className="flex items-center space-x-2">
          {state.isRecording && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-mono">{formatTime(state.elapsedTime)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {!state.isRecording ? (
          <Button
            onClick={handleStartRecording}
            className="flex items-center space-x-2"
            variant="default"
          >
            <Mic className="w-4 h-4" />
            <span>Start Recording</span>
          </Button>
        ) : (
          <Button
            onClick={handleStopRecording}
            className="flex items-center space-x-2"
            variant="destructive"
          >
            <Square className="w-4 h-4" />
            <span>Stop Recording</span>
          </Button>
        )}

        {(previewBlobRef.current && rawBlobRef.current && !state.isRecording) && (
          <Button
            onClick={handleSaveRecordings}
            disabled={isSaving}
            variant="outline"
          >
            {isSaving ? 'Saving...' : 'Save Recordings'}
          </Button>
        )}
      </div>

      {saveStatus && (
        <div className={`text-sm p-2 rounded ${
          saveStatus.includes('Error') || saveStatus.includes('failed') 
            ? 'bg-red-100 text-red-700' 
            : saveStatus.includes('Successfully') 
            ? 'bg-green-100 text-green-700'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {saveStatus}
        </div>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p>• Preview audio: Used for video muxing and playback synchronization</p>
        <p>• Raw audio: Stored separately for AI transcription and analysis</p>
      </div>
    </Card>
  );
}