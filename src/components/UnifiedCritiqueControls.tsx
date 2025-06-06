import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Eye, Mic, Save, Square } from "lucide-react";
import React from "react";

interface UnifiedCritiqueControlsProps {
  isRecording: boolean;
  onStartCritique: () => void;
  onStopCritique: () => void;
  onSaveDraft: () => void;
  onPreviewCritique: () => void;
  hasRecordedData: boolean;
  isSaving: boolean;
  permissionStatus?: "unknown" | "granted" | "denied";
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
  permissionStatus = "unknown",
  errorMessage,
}) => {
  const canStartRecording =
    permissionStatus === "granted" || permissionStatus === "unknown";
  const showPermissionWarning = permissionStatus === "denied";

  const handleStopClick = () => {
    console.log("🛑 Stop Recording button clicked, current state:", {
      isRecording,
      hasRecordedData,
      permissionStatus,
    });

    if (isRecording) {
      onStopCritique();
      console.log("✅ Stop critique function called");
    } else {
      console.warn("⚠️ Stop clicked but not currently recording");
    }
  };

  const handleStartClick = () => {
    console.log("🎬 Start Recording button clicked");
    onStartCritique();
  };

  const handlePreviewClick = () => {
    console.log("👁️ Preview button clicked, hasRecordedData:", hasRecordedData);
    onPreviewCritique();
  };

  const handleSaveClick = () => {
    console.log("💾 Save Draft button clicked");
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
            🎤 Microphone access is required to record critiques. Please enable
            microphone permissions and try again.
          </AlertDescription>
        </Alert>
      )}

      {/* Recording Controls */}
      <div className="flex justify-between">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1 text-gray-700">
            Critique Studio
          </h1>
          <p className="text-gray-500 text-sm">
            Record commentary and draw annotations while watching the video.{" "}
            <br />
            Use the unified controls to start/stop your critique session.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-start justify-end">
          {!isRecording ? (
            <Button
              onClick={handleStartClick}
              disabled={!canStartRecording}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-3"
              size="sm"
            >
              <Mic className="w-5 h-5" />
              Start Recording
            </Button>
          ) : (
            <>
              <Button
                onClick={handleStopClick}
                disabled={!isRecording}
                className="bg-red-800 hover:bg-red-900 text-white flex items-center gap-2 px-4 py-3 animate-pulse"
                size="sm"
              >
                <Square className="w-5 h-5" />
                Stop Recording
              </Button>

              <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg border border-red-300">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">
                  🎤 Recording in Progress...
                </span>
              </div>
            </>
          )}

          {hasRecordedData && (
            <>
              <Button
                onClick={handleSaveClick}
                variant="outline"
                className="flex items-center gap-2"
                size="sm"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Draft"}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedCritiqueControls;
