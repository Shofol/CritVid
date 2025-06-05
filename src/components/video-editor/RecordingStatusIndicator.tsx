import React from 'react';
import { AlertCircle, Mic, MicOff, CheckCircle } from 'lucide-react';

interface RecordingStatusIndicatorProps {
  isRecording: boolean;
  error: string | null;
  saveStatus?: 'idle' | 'saving' | 'success' | 'error';
  actionsCount?: number;
}

const RecordingStatusIndicator: React.FC<RecordingStatusIndicatorProps> = ({
  isRecording,
  error,
  saveStatus = 'idle',
  actionsCount = 0
}) => {
  return (
    <div className="space-y-2 text-sm">
      {/* Recording Status */}
      {isRecording && (
        <div className="flex items-center text-red-500 animate-pulse">
          <Mic className="w-4 h-4 mr-2" />
          <span>Recording in progress...</span>
        </div>
      )}
      
      {/* Saving Status */}
      {saveStatus === 'saving' && (
        <div className="flex items-center text-amber-500">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span>Saving recording...</span>
        </div>
      )}
      
      {saveStatus === 'success' && (
        <div className="flex items-center text-green-500">
          <CheckCircle className="w-4 h-4 mr-2" />
          <span>Recording saved successfully!</span>
        </div>
      )}
      
      {saveStatus === 'error' && (
        <div className="flex items-center text-red-500">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span>Error saving recording</span>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="flex items-center text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Actions Count */}
      {actionsCount > 0 && (
        <div className="text-xs text-muted-foreground">
          <span>{actionsCount} video actions recorded</span>
        </div>
      )}
    </div>
  );
};

export default RecordingStatusIndicator;