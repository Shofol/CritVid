import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Mic, MicOff, Save, Trash2 } from 'lucide-react';

interface AudioRecorderProps {
  isRecording: boolean;
  audioUrl: string | null;
  onToggleRecording: () => Promise<void>;
  onClearRecording: () => void;
  onSaveRecording?: (audioBlob: Blob) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  isRecording,
  audioUrl,
  onToggleRecording,
  onClearRecording,
  onSaveRecording,
}) => {
  const [savedRecordings, setSavedRecordings] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleToggleRecording = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      await onToggleRecording();
    } catch (err) {
      console.error('Error toggling recording:', err);
      setError(`Recording error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleSaveRecording = async () => {
    if (!audioUrl || !onSaveRecording) return;
    
    try {
      setIsProcessing(true);
      setError(null);
      
      // Convert the audio URL to a Blob
      const response = await fetch(audioUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      onSaveRecording(blob);
      
      // Store the URL in our local state to track saved recordings
      setSavedRecordings(prev => [...prev, audioUrl]);
      
      // Clear the current recording after saving
      onClearRecording();
    } catch (err) {
      console.error('Error saving recording:', err);
      setError(`Save error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Card className="w-full mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <Mic className="w-4 h-4 mr-2" />
          Voice Critique Recorder
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={handleToggleRecording}
              variant={isRecording ? "destructive" : "default"}
              className="flex-1"
              disabled={isProcessing}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-4 h-4 mr-2" /> Stop Recording
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" /> Start Recording
                </>
              )}
            </Button>
            
            {audioUrl && (
              <>
                <Button
                  variant="outline"
                  onClick={onClearRecording}
                  title="Clear recording"
                  disabled={isProcessing}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSaveRecording}
                  title="Save recording"
                  disabled={isProcessing}
                >
                  <Save className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
          
          {isRecording && (
            <div className="flex items-center text-red-500 animate-pulse">
              <AlertCircle className="w-4 h-4 mr-2" />
              Recording in progress...
            </div>
          )}
          
          {isProcessing && !isRecording && (
            <div className="flex items-center text-amber-500">
              <AlertCircle className="w-4 h-4 mr-2" />
              Processing audio...
            </div>
          )}
          
          {error && (
            <div className="flex items-center text-red-500 bg-red-50 p-2 rounded">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}
          
          {audioUrl && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm mb-2">Preview your voice critique:</p>
              <audio src={audioUrl} controls className="w-full" />
            </div>
          )}
          
          {savedRecordings.length > 0 && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm mb-2">Saved recordings ({savedRecordings.length}):</p>
              <p className="text-xs text-muted-foreground">
                {savedRecordings.length} audio recording{savedRecordings.length !== 1 ? 's' : ''} will be included with your critique
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioRecorder;
