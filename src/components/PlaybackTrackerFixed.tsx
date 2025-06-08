import { Highlighter, Play } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useUnifiedCritiqueScreenRecording } from "../hooks/useUnifiedCritiqueScreenRecording";
import DrawingCanvasFixed from "./DrawingCanvasFixed";
import UnifiedCritiqueControls from "./UnifiedCritiqueControls";
import VideoControls from "./VideoControls";
import { Button } from "./ui/button";

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
  onPreviewCritique,
}) => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const {
    isRecording,
    recordedVideoUrl,
    hasRecordedData,
    isSaving,
    permissionStatus,
    errorMessage,
    startCritique,
    stopCritique,
    saveDraft,
    setDrawActions: addDrawAction,
    handleVideoAction,
  } = useUnifiedCritiqueScreenRecording(videoRef, videoUrl);

  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    setRecordedAudioUrl(recordedVideoUrl);
  }, [recordedVideoUrl, setRecordedAudioUrl]);

  const effectiveVideoUrl =
    videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4";

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
      if (video.src !== "https://www.w3schools.com/html/mov_bbb.mp4") {
        video.src = "https://www.w3schools.com/html/mov_bbb.mp4";
        video.load();
      }
    };

    const handlePlay = () => {
      if (isRecording && handleVideoAction) {
        handleVideoAction({ type: "play", time: video.currentTime });
      }
    };

    const handlePause = () => {
      if (isRecording && handleVideoAction) {
        handleVideoAction({
          type: "pause",
          time: video.currentTime,
          duration: 2,
        });
      }
    };

    const handleSeeked = () => {
      if (isRecording && handleVideoAction) {
        handleVideoAction({ type: "seek", time: video.currentTime });
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("error", handleError);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("seeked", handleSeeked);

    if (video.readyState >= 1) {
      setVideoLoaded(true);
      setVideoError(false);
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("error", handleError);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, [videoRef, effectiveVideoUrl, isRecording, handleVideoAction]);

  const handleDrawingToggle = () => {
    if (!isRecording) {
      console.warn("⚠️ Cannot enable drawing mode - not recording");
      return;
    }
    setIsDrawingMode(!isDrawingMode);
    console.log("🎨 Drawing mode toggled:", !isDrawingMode);
  };

  const handleDrawAction = (action: any) => {
    console.log("📝 Received draw action:", action);
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
      console.log("🛑 Recording stopped, drawing mode disabled");
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div
          className="relative border border-gray-200 p-5 rounded-lg "
          style={{ aspectRatio: "16/9" }}
        >
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
          <div
            ref={videoContainerRef}
            className="rounded-lg overflow-hidden relative group"
            // onClick={() => {
            //   if (videoPlaying) {
            //     videoRef.current?.pause();
            //     setVideoPlaying(false);
            //   } else {
            //     videoRef.current?.play();
            //     setVideoPlaying(true);
            //   }
            // }}
          >
            {!videoPlaying && (
              <div className="absolute top-0 left-0 bg-black/50 w-full h-full rounded-lg flex items-center justify-center z-20">
                <button
                  onClick={() => {
                    videoRef.current?.play();
                    setVideoPlaying(true);
                  }}
                  className="hover:bg-blue-500 transition-all duration-300 bg-gradient-to-t from-blue-400 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center"
                >
                  <Play fill="white" className="w-8 h-8 text-white" />
                </button>
              </div>
            )}
            <Button
              onClick={handleDrawingToggle}
              variant={isDrawingMode ? "default" : "outline"}
              className={`absolute top-5 right-5 z-20 rounded-full h-10 w-10 p-0 ${isDrawingMode ? "bg-blue-600 hover:bg-blue-700" : ""}`}
              disabled={!isRecording}
            >
              <Highlighter className="h-4 w-4" />
            </Button>

            <video
              ref={videoRef}
              src={effectiveVideoUrl}
              className="w-full h-full object-contain rounded-lg"
              preload="metadata"
              playsInline
            />
            <div className="group-hover:opacity-100 opacity-0 transition-all duration-300 absolute bottom-0 left-0 right-0 z-20">
              <VideoControls videoRef={videoRef} />
            </div>

            <DrawingCanvasFixed
              containerRef={videoContainerRef}
              isActive={isDrawingMode}
              videoRef={videoRef}
              isRecording={isRecording}
              onDrawAction={handleDrawAction}
            />
          </div>

          {videoError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/75 z-10">
              <div className="text-white text-center p-4">
                <p className="text-lg font-semibold mb-2">
                  Video Loading Error
                </p>
                <p className="text-sm">
                  Please re-upload or reload the draft video.
                </p>
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
      </div>
    </div>
  );
};

export default PlaybackTrackerFixed;
