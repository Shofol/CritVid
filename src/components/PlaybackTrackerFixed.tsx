import React, { useRef, useEffect, useState } from 'react';
import DrawingCanvasFixed from './DrawingCanvasFixed';
import UnifiedCritiqueControls from './UnifiedCritiqueControls';
import VideoControls from './VideoControls';
import { Button } from './ui/button';
import { useUnifiedCritiqueFixed } from '../hooks/useUnifiedCritiqueFixed';

interface PlaybackTrackerProps {
  videoUrl: string;
  setRecordedAudioUrl: (url: string | null) => void;
  drawActions: any[];
  setDrawActions: (actions: any[]) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  onPreviewCritique: () => void;
}

const PlaybackTrackerFixed: React.FC<PlaybackTrackerProps> = ({
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
    handleVideoAction
  } = useUnifiedCritiqueFixed(videoRef, videoUrl);

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
        handleVideoAction({ type: 'pause', time: video.currentTime, duration: 2 });
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
    console.log('🎨 Drawing mode toggled:', !isDrawingMode);
  };

  const handleDrawAction = (action: any) => {
    console.log('📝 Received draw action:', action);
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
      console.log('🛑 Recording stopped, drawing mode disabled');
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

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
                <p className="text-sm">Please re-upload or reload the draft video.</p>
              </div>
            </div>
          )}
          
          {!videoLoaded && !videoError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <div className="text-white text-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p className="text-sm">Loading video...</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="w-full">
          <VideoControls videoRef={videoRef} />
        </div>
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
              ✏️ Drawing enabled! Click and drag on the video to draw annotations.
            </div>
          )}
          
          {isDrawingMode && !isRecording && (
            <div className="text-sm text-yellow-600 font-medium">
              ⚠️ Start recording to enable drawing functionality.
            </div>
          )}
        </div>

        <UnifiedCritiqueControls
          isRecording={isRecording}
          onStartCritique={startCritique}
          onStopCritique={handleStopRecording}
          onSaveDraft={saveDraft}
          onPreviewCritique={onPreviewCritique}
          hasRecordedData={hasRecordedData}
          isSaving={isSaving}
          permissionStatus={permissionStatus}
          errorMessage={errorMessage}
        />

        <div className="text-center space-y-2">
          <div className="text-sm text-gray-600">
            Video: {videoLoaded ? '✅ Loaded' : videoError ? '❌ Error' : '⏳ Loading...'} | 
            Drawing: {isDrawingMode ? (isRecording ? '✅ Active' : '⚠️ Needs Recording') : '❌ Disabled'} | 
            Recording: {isRecording ? '🔴 Active' : '⭕ Stopped'}
          </div>
          
          {drawActions.length > 0 && (
            <div className="text-xs text-blue-600">
              {drawActions.length} drawing(s) recorded
            </div>
          )}
          
          <div className="text-xs text-gray-500">
            💡 Tip: Start recording first, then enable drawing mode to create annotations.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaybackTrackerFixed;