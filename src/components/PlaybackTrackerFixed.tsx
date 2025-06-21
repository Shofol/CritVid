import { toast } from "@/components/ui/use-toast";
import { uploadRecordedVideo } from "@/lib/storage";
import { Highlighter, Play } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useUnifiedCritiqueScreenRecording } from "../hooks/useUnifiedCritiqueScreenRecording";
import { DrawAction } from "../types/critiqueTypes";
import DrawingCanvasFixed from "./DrawingCanvasFixed";
import UnifiedCritiqueControls from "./UnifiedCritiqueControls";
import VideoControls from "./VideoControls";
import { Button } from "./ui/button";

interface PlaybackTrackerProps {
  videoUrl: string;
  drawActions: DrawAction[];
  setDrawActions: (actions: DrawAction[]) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

const PlaybackTrackerFixed: React.FC<PlaybackTrackerProps> = ({
  videoUrl,
  drawActions,
  setDrawActions,
  videoRef,
}) => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isPlaybackMode, setIsPlaybackMode] = useState(false);

  const {
    isRecording,
    recordedVideoUrl,
    recordedVideoBlob,
    hasRecordedData,
    permissionStatus,
    errorMessage,
    startCritique,
    stopCritique,
    setDrawActions: addDrawAction,
    handleVideoAction,
  } = useUnifiedCritiqueScreenRecording(videoRef, videoUrl);

  const [videoPlaying, setVideoPlaying] = useState(false);

  // useEffect(() => {
  //   setRecordedAudioUrl(recordedVideoUrl);
  // }, [recordedVideoUrl, setRecordedAudioUrl]);

  const effectiveVideoUrl =
    isPlaybackMode && recordedVideoUrl
      ? recordedVideoUrl
      : videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4";

  const handlePlayRecording = () => {
    if (recordedVideoUrl) {
      console.log(
        "🎬 Switching to playback mode with recorded video:",
        recordedVideoUrl
      );
      setIsPlaybackMode(true);
      setVideoPlaying(false); // Reset video playing state
    } else {
      console.warn("⚠️ No recorded video available for playback");
    }
  };

  const handleBackToEditor = () => {
    console.log("📝 Switching back to editor mode");
    setIsPlaybackMode(false);
    setVideoPlaying(false);
  };

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

  const handleDrawAction = (action: DrawAction) => {
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

  const handleUploadRecording = async () => {
    if (!recordedVideoBlob) {
      console.warn("⚠️ No recorded video blob available for upload");
      toast({
        title: "Upload Failed",
        description: "No recorded video available to upload.",
        variant: "destructive" as const,
      });
      return;
    }

    try {
      console.log("☁️ Starting video upload to Supabase storage...");

      const filePath = await uploadRecordedVideo(recordedVideoBlob);

      console.log("✅ Video uploaded successfully to:", filePath);
      toast({
        title: "Upload Successful",
        description: `Video uploaded to cloud storage at ${filePath}`,
        variant: "default",
      });
    } catch (error) {
      console.error("❌ Failed to upload video:", error);
      toast({
        title: "Upload Failed",
        description:
          "Failed to upload video to cloud storage. Please try again.",
        variant: "destructive" as const,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div
          className="relative border border-gray-200 p-5 rounded-lg"
          style={{ aspectRatio: "16/9" }}
        >
          <UnifiedCritiqueControls
            isRecording={isRecording}
            onStartCritique={startCritique}
            onStopCritique={handleStopRecording}
            onPlayRecording={handlePlayRecording}
            onUploadRecording={handleUploadRecording}
            hasRecordedData={hasRecordedData}
            permissionStatus={permissionStatus}
            errorMessage={errorMessage}
          />

          {/* Playback Mode Header */}
          {isPlaybackMode && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-green-800">
                    🎬 Playing Recorded Video
                  </span>
                </div>
                <Button
                  onClick={handleBackToEditor}
                  variant="outline"
                  size="sm"
                  className="text-green-700 border-green-300 hover:bg-green-100"
                >
                  Back to Editor
                </Button>
              </div>
            </div>
          )}

          <div
            ref={videoContainerRef}
            className="rounded-lg overflow-hidden relative group"
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

            {/* Only show drawing button when not in playback mode and recording */}
            {!isPlaybackMode && (
              <Button
                onClick={handleDrawingToggle}
                variant={isDrawingMode ? "default" : "outline"}
                className={`absolute top-5 right-5 z-20 rounded-full h-10 w-10 p-0 ${
                  isDrawingMode ? "bg-blue-600 hover:bg-blue-700" : ""
                }`}
                disabled={!isRecording}
              >
                <Highlighter className="h-4 w-4" />
              </Button>
            )}

            <video
              ref={videoRef}
              src={effectiveVideoUrl}
              className="w-full h-full object-contain rounded-lg"
              preload="metadata"
              playsInline
              controls={!!isPlaybackMode} // Show native controls in playback mode
            />

            {!isPlaybackMode && (
              <div className="group-hover:opacity-100 opacity-0 transition-all duration-300 absolute bottom-0 left-0 right-0 z-20">
                <VideoControls videoRef={videoRef} />
              </div>
            )}

            {/* Only show drawing canvas when not in playback mode */}
            {!isPlaybackMode && (
              <DrawingCanvasFixed
                containerRef={videoContainerRef}
                isActive={isDrawingMode}
                videoRef={videoRef}
                isRecording={isRecording}
                onDrawAction={handleDrawAction}
              />
            )}
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
