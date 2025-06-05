import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RecordingTimer from './RecordingTimer';

interface RecordingControlsProps {
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  elapsedTime: number;
  isPreviewMode: boolean;
  startPreview: () => void;
  stopPreview: () => void;
  saveCritique: () => Promise<string | null>;
  hasSavedData: boolean;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  startRecording,
  stopRecording,
  elapsedTime,
  isPreviewMode,
  startPreview,
  stopPreview,
  saveCritique,
  hasSavedData,
}) => {
  return (
    <div className="p-4 bg-muted/20 rounded-lg">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Recording Controls</h3>
          
          {/* Recording status */}
          {isRecording ? (
            <Badge variant="destructive" className="animate-pulse">Recording</Badge>
          ) : isPreviewMode ? (
            <Badge variant="secondary">Preview Mode</Badge>
          ) : (
            <Badge variant="outline">Ready</Badge>
          )}
        </div>
        
        {/* Timer */}
        <div className="text-center">
          <RecordingTimer 
            isRecording={isRecording} 
            elapsedTime={elapsedTime} 
            className="justify-center"
          />
          <div className="text-xs text-muted-foreground mt-1">Recording Time</div>
        </div>
        
        {/* Recording controls */}
        <div className="grid grid-cols-2 gap-2">
          {!isRecording && !isPreviewMode ? (
            <Button 
              onClick={startRecording} 
              variant="destructive"
              className="col-span-2"
            >
              Start Recording
            </Button>
          ) : isRecording ? (
            <Button 
              onClick={stopRecording} 
              variant="outline"
              className="col-span-2"
            >
              Stop Recording
            </Button>
          ) : null}
          
          {!isRecording && (
            <>
              <Button 
                onClick={saveCritique} 
                variant="default"
                disabled={!hasSavedData}
              >
                Save Critique
              </Button>
              
              {!isPreviewMode ? (
                <Button 
                  onClick={startPreview} 
                  variant="outline"
                  disabled={!hasSavedData}
                >
                  Preview Critique
                </Button>
              ) : (
                <Button 
                  onClick={stopPreview} 
                  variant="outline"
                >
                  Exit Preview
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordingControls;
