import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Play, Save, Eye, Square } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UnifiedCritiqueControlsProps {
  isRecording: boolean;
  onStartCritique: () => void;
  onStopCritique: () => void;
  onSaveDraft: () => void;
  onPreviewCritique: () => void;
  hasRecordedData: boolean;
  isSaving: boolean;
  permissionStatus?: 'unknown' | 'granted' | 'denied';
  errorMessage?: string | null;
}

const UnifiedCritiqueControls: React.FC<UnifiedCritiqueControlsProps> = ({
  isRecording,
  onStartCritique,
  onStopCritique,
  onSaveDraft,
  onPreviewCritique,
  hasRecordedData,
  isSaving,
  permissionStatus = 'unknown',
  errorMessage
}) => {
  const canStartRecording = permissionStatus === 'granted' || permissionStatus === 'unknown';
  const showPermissionWarning = permissionStatus === 'denied';

  const handleStopClick = () => {
    console.log('🛑 Stop Recording button clicked, current state:', {
      isRecording,
      hasRecordedData,
      permissionStatus
    });
    
    if (isRecording) {
      onStopCritique();
      console.log('✅ Stop critique function called');
    } else {
      console.warn('⚠️ Stop clicked but not currently recording');
    }
  };

  const handleStartClick = () => {
    console.log('🎬 Start Recording button clicked');
    onStartCritique();
  };

  const handlePreviewClick = () => {
    console.log('👁️ Preview button clicked, hasRecordedData:', hasRecordedData);
    onPreviewCritique();
  };

  const handleSaveClick = () => {
    console.log('💾 Save Draft button clicked');
    onSaveDraft();
  };

  return (
    <div className="space-y-4">
      {/* Error/Permission Messages */}
      {errorMessage && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}
      
      {showPermissionWarning && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertDescription className="text-yellow-800">
            🎤 Microphone access is required to record critiques. Please enable microphone permissions and try again.
          </AlertDescription>
        </Alert>
      )}

      {/* Recording Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        {!isRecording ? (
          <Button
            onClick={handleStartClick}
            disabled={!canStartRecording}
            className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 px-6 py-3"
            size="lg"
          >
            <Mic className="w-5 h-5" />
            Start Recording
          </Button>
        ) : (
          <>
            <Button
              onClick={handleStopClick}
              disabled={!isRecording}
              className="bg-red-800 hover:bg-red-900 text-white flex items-center gap-2 px-6 py-3 animate-pulse"
              size="lg"
            >
              <Square className="w-5 h-5" />
              Stop Recording
            </Button>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg border border-red-300">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">🎤 Recording in Progress...</span>
            </div>
          </>
        )}
        
        <Button
          onClick={handleSaveClick}
          disabled={!hasRecordedData || isRecording || isSaving}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Draft'}
        </Button>
        
        <Button
          onClick={handlePreviewClick}
          disabled={!hasRecordedData || isRecording}
          variant="outline"
          className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-300"
        >
          <Eye className="w-4 h-4" />
          Preview Critique
        </Button>
      </div>

      {/* Enhanced Status Information */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
        <div className="text-sm font-medium text-gray-700">Session Status:</div>
        <div className="text-sm text-gray-600 space-y-1">
          {permissionStatus === 'unknown' && (
            <p>🎤 Click "Start Recording" to request microphone access</p>
          )}
          {permissionStatus === 'granted' && !isRecording && (
            <p>✅ Microphone ready - you can start recording</p>
          )}
          {isRecording && (
            <p>🔴 <strong>Recording active</strong> - speak your critique and draw annotations</p>
          )}
          {hasRecordedData && !isRecording && (
            <p>📝 Critique data available for preview or saving</p>
          )}
          {!hasRecordedData && !isRecording && permissionStatus === 'granted' && (
            <p>⏹️ Ready to start your next critique session</p>
          )}
        </div>
        
        {/* Clear Canvas Helper */}
        {isRecording && (
          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
            💡 <strong>Tip:</strong> Enable drawing mode and draw on the video. Drawings will fade after 1 second for non-destructive annotation.
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedCritiqueControls;