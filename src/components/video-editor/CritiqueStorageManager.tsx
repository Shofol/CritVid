import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Check, Save, AlertCircle, Info } from 'lucide-react';
import { TimestampedDrawing } from '@/types/drawingTypes';
import { useVideoStorage } from './VideoStorageProvider';
import { storeAudioData, storeDrawingData } from '@/lib/audioStorage';

interface CritiqueStorageManagerProps {
  videoId: string;
  audioBlob?: Blob;
  drawingData?: TimestampedDrawing;
  userId?: string;
  onSaveComplete?: (audioPath: string, drawingPath: string) => void;
}

const CritiqueStorageManager: React.FC<CritiqueStorageManagerProps> = ({
  videoId,
  audioBlob,
  drawingData,
  userId,
  onSaveComplete
}) => {
  const { saveCritiqueToCloud, storageStatus } = useVideoStorage();
  const [saveState, setSaveState] = useState({
    isSaving: false,
    isComplete: false,
    error: undefined as string | undefined,
    audioPaths: [] as string[],
    drawingPaths: [] as string[],
    localSaveOnly: false
  });

  const handleSaveCritique = async () => {
    if (!audioBlob && !drawingData) {
      setSaveState(prev => ({
        ...prev,
        error: 'No critique data to save'
      }));
      return;
    }

    try {
      setSaveState(prev => ({
        ...prev,
        isSaving: true,
        error: undefined,
        localSaveOnly: false
      }));

      // First save locally to ensure we don't lose data
      let localSaveSuccess = false;
      try {
        // Save audio locally first
        if (audioBlob) {
          await storeAudioData(audioBlob, videoId);
        }
        
        // Save drawing data locally
        if (drawingData) {
          storeDrawingData(JSON.stringify(drawingData), videoId);
        }
        
        localSaveSuccess = true;
      } catch (localError) {
        console.warn('Error saving locally:', localError);
        // Continue with cloud save attempt even if local save fails
      }

      // Then try to save to cloud
      try {
        const result = await saveCritiqueToCloud(videoId, audioBlob, drawingData);
        
        // Update state with success
        setSaveState({
          isSaving: false,
          isComplete: true,
          error: undefined,
          audioPaths: result.audioPath ? [result.audioPath] : [],
          drawingPaths: result.drawingPath ? [result.drawingPath] : [],
          localSaveOnly: !result.audioPath && !result.drawingPath && localSaveSuccess
        });

        // Notify parent component
        if (onSaveComplete) {
          onSaveComplete(
            result.audioPath || '',
            result.drawingPath || ''
          );
        }
      } catch (cloudError) {
        console.error('Error saving to cloud:', cloudError);
        
        // If we at least saved locally, consider it a partial success
        if (localSaveSuccess) {
          setSaveState(prev => ({
            ...prev,
            isSaving: false,
            isComplete: true,
            localSaveOnly: true,
            error: 'Could not save to cloud, but saved locally'
          }));
          
          // Still notify parent since we have local data
          if (onSaveComplete) {
            onSaveComplete('', '');
          }
        } else {
          // Both local and cloud save failed
          throw new Error('Failed to save critique data');
        }
      }
    } catch (error) {
      console.error('Error in handleSaveCritique:', error);
      setSaveState(prev => ({
        ...prev,
        isSaving: false,
        error: error instanceof Error ? error.message : 'Unknown error saving critique'
      }));
    }
  };

  return (
    <div className="space-y-4">
      {/* Storage status indicator */}
      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
        <Info className="h-3 w-3 mr-1" />
        Storage: 
        {storageStatus.localStorage && <span className="ml-1 text-green-600 dark:text-green-400">Local</span>}
        {!storageStatus.localStorage && storageStatus.sessionStorage && <span className="ml-1 text-yellow-600 dark:text-yellow-400">Session</span>}
        {!storageStatus.localStorage && !storageStatus.sessionStorage && <span className="ml-1 text-red-600 dark:text-red-400">Memory only</span>}
      </div>
      
      <Button
        onClick={handleSaveCritique}
        disabled={saveState.isSaving || saveState.isComplete || (!audioBlob && !drawingData)}
        className="w-full"
      >
        <Save className="mr-2 h-4 w-4" />
        {saveState.isSaving ? 'Saving...' : 'Save Critique'}
      </Button>

      {saveState.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Save Issue</AlertTitle>
          <AlertDescription>{saveState.error}</AlertDescription>
        </Alert>
      )}

      {saveState.isComplete && (
        <Alert 
          variant="default" 
          className={saveState.localSaveOnly 
            ? "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-900 dark:text-yellow-400"
            : "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900 dark:text-green-400"
          }
        >
          <Check className="h-4 w-4" />
          <AlertTitle>{saveState.localSaveOnly ? 'Saved Locally' : 'Save Complete'}</AlertTitle>
          <AlertDescription>
            {saveState.localSaveOnly 
              ? "Your critique has been saved to your device. Cloud storage was unavailable."
              : "Your critique has been saved to secure cloud storage."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CritiqueStorageManager;
