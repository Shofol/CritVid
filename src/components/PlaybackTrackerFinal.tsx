import React, { useRef, useEffect, useState } from 'react';
import DrawingCanvasFixed from './DrawingCanvasFixed';
import UnifiedCritiqueControls from './UnifiedCritiqueControls';
import VideoControls from './VideoControls';
import { Button } from './ui/button';
import { useUnifiedCritiqueImproved } from '../hooks/useUnifiedCritiqueImproved';
import PlaybackPreviewPlayerFinal from './PlaybackPreviewPlayerFinal';

interface PlaybackTrackerFinalProps {
  videoUrl: string;
  setRecordedAudioUrl: (url: string | null) => void;
  drawActions: any[];
  setDrawActions: (actions: any[]) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  onPreviewCritique: () => void;
}

const PlaybackTrackerFinal: React.FC<PlaybackTrackerFinalProps> = ({
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
  } = useUnifiedCritiqueImproved(videoRef, videoUrl);

  useEffect(() => {
    setRecordedAudioUrl(recordedAudioUrl);
  }, [recordedAudioUrl, setRecordedAudioUrl]);

  const effectiveVideoUrl = videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4';

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      if (video.readyState >= 1) {
        setVideoLoaded(true);
        setVideoError(false);
      }
    };

    const handleError = () => {
      setVideoError(true);
      if (video.src !== 'https://www.w3schools.com/html/mov_bbb.mp4') {
        video.src = 'https://www.w3schools.com/html/mov_bbb.mp4';
        video.load();
      }
    };

    const handlePlay = () => {
      if (isRecording && handleVideoAction) {
        handleVideoAction({ type: 'play', time: video.currentTime });
      }
    };

    const handlePause = () => {
      if (isRecording && handleVideoAction) {
        const pauseStartTime = Date.now();
        handleVideoAction({ 
          type: 'pause', 
          time: video.currentTime, 
          duration: 2000, // Will be updated when play resumes
          pauseStartTime 
        });
      }
    };

    const handleSeeked = () => {
      if (isRecording && handleVideoAction) {
        handleVideoAction({ type: 'seek', time: video.currentTime });
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('error', handleError);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('seeked', handleSeeked);

    if (video.readyState >= 1) {
      setVideoLoaded(true);
      setVideoError(false);
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('error', handleError);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, [videoRef, effectiveVideoUrl, isRecording, handleVideoAction]);

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
        
        <PlaybackPreviewPlayerFinal
          videoUrl={effectiveVideoUrl}
          audioUrl={recordedAudioUrl || undefined}
          drawActions={drawActions}
          timelineEvents={timelineEvents || []}
        />
        
        <div className="text-center text-sm text-gray-600">
          <p>✅ Preview shows your recorded critique with synchronized audio, drawings, and timeline events.</p>
          <p>🎯 Pauses will occur at the exact times and durations you recorded.</p>
        </div>
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
          
          {!isRecording && isDrawingMode && (
            <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium z-20">
              ⚠️ Start Recording to Draw
            </div>
          )}
          
          {videoError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/75 z-10">
              <div className="text-white text-center p-4">
                <p className="text-lg font-semibold mb-2">Video Loading Error</p>
                <p className="text-sm">Using demo video instead.</p>
              </div>
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
            className={isDrawingMode ? "bg-green-600 hover:bg-green-700" : ""}
            disabled={!isRecording}
          >
            {isDrawingMode ? "Exit Drawing" : "Enable Drawing"}
          </Button>
          
          {isDrawingMode && isRecording && (
            <div className="text-sm text-green-600 font-medium">
              ✏️ Drawing enabled! Click and drag to annotate.
            </div>
          )}
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

        <div className="text-center space-y-2">
          <div className="text-sm text-gray-600">
            Status: {isRecording ? '🔴 Recording' : '⭕ Stopped'} | 
            Drawing: {isDrawingMode ? '✏️ Active' : '❌ Disabled'} | 
            Data: {hasRecordedData ? '✅ Available' : '❌ None'}
          </div>
          
          {drawActions.length > 0 && (
            <div className="text-xs text-blue-600">
              {drawActions.length} drawing(s) • {timelineEvents?.length || 0} timeline event(s)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaybackTrackerFinal;