import React, { useRef, useEffect, useState } from 'react';
import DrawingCanvasFixed from './DrawingCanvasFixed';
import UnifiedCritiqueControls from './UnifiedCritiqueControls';
import VideoControls from './VideoControls';
import { Button } from './ui/button';
import { useUnifiedCritiqueFixed } from '../hooks/useUnifiedCritiqueFixed';
import PlaybackPreviewPlayerImproved from './PlaybackPreviewPlayerImproved';

interface PlaybackTrackerImprovedProps {
  videoUrl: string;
  setRecordedAudioUrl: (url: string | null) => void;
  drawActions: any[];
  setDrawActions: (actions: any[]) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  onPreviewCritique: () => void;
}

const PlaybackTrackerImproved: React.FC<PlaybackTrackerImprovedProps> = ({
  videoUrl,
  setRecordedAudioUrl,
  drawActions,
  setDrawActions,
  videoRef,
  onPreviewCritique
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const {
    isRecording,
    recordedAudioUrl,
    hasRecordedData,
    isSaving,
    permissionStatus,
    errorMessage,
    startCritique,
    stopCritique,
    saveDraft,
    setDrawActions: addDrawAction,
    handleVideoAction,
    timelineEvents
  } = useUnifiedCritiqueFixed(videoRef, videoUrl);

  useEffect(() => {
    setRecordedAudioUrl(recordedAudioUrl);
  }, [recordedAudioUrl, setRecordedAudioUrl]);

  const effectiveVideoUrl = videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4';

  const handleDrawingToggle = () => {
    if (!isRecording) {
      console.warn('⚠️ Cannot enable drawing mode - not recording');
      return;
    }
    setIsDrawingMode(!isDrawingMode);
  };

  const handleDrawAction = (action: any) => {
    if (addDrawAction) {
      addDrawAction(action);
    }
    setDrawActions([...drawActions, action]);
  };

  const handleStopRecording = async () => {
    try {
      await stopCritique();
      setIsDrawingMode(false);
      const video = videoRef.current;
      if (video && !video.paused) {
        video.pause();
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const handlePreviewCritique = () => {
    setShowPreview(true);
    onPreviewCritique();
  };

  if (showPreview && hasRecordedData) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Critique Preview</h3>
          <Button onClick={() => setShowPreview(false)} variant="outline">
            Back to Editor
          </Button>
        </div>
        
        <PlaybackPreviewPlayerImproved
          videoUrl={effectiveVideoUrl}
          audioUrl={recordedAudioUrl || undefined}
          drawActions={drawActions}
          timelineEvents={timelineEvents || []}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div 
          ref={containerRef}
          className="relative bg-black rounded-lg overflow-hidden"
          style={{ aspectRatio: '16/9' }}
        >
          <video
            ref={videoRef}
            src={effectiveVideoUrl}
            className="w-full h-full object-contain"
            preload="metadata"
            playsInline
          />
          
          <DrawingCanvasFixed
            containerRef={containerRef}
            isActive={isDrawingMode}
            videoRef={videoRef}
            isRecording={isRecording}
            onDrawAction={handleDrawAction}
          />
          
          {isDrawingMode && isRecording && (
            <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium z-20">
              ✏️ Drawing Mode Active
            </div>
          )}
        </div>
        
        <VideoControls videoRef={videoRef} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={handleDrawingToggle}
            variant={isDrawingMode ? "default" : "outline"}
            disabled={!isRecording}
          >
            {isDrawingMode ? "Exit Drawing" : "Enable Drawing"}
          </Button>
        </div>

        <UnifiedCritiqueControls
          isRecording={isRecording}
          onStartCritique={startCritique}
          onStopCritique={handleStopRecording}
          onSaveDraft={saveDraft}
          onPreviewCritique={handlePreviewCritique}
          hasRecordedData={hasRecordedData}
          isSaving={isSaving}
          permissionStatus={permissionStatus}
          errorMessage={errorMessage}
        />
      </div>
    </div>
  );
};

export default PlaybackTrackerImproved;