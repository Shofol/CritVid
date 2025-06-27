import { safeArrayAccess } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { useScreenRecorder } from "./useScreenRecorder";
import { useTimelineActions } from "./useTimelineActions";
import { useVideoActions } from "./useVideoActions";

interface DrawAction {
  path: { x: number; y: number }[];
  timestamp: number;
  startTime: number;
  endTime: number;
  color: string;
  width: number;
  id?: string;
}

interface TimelineEvent {
  type: "pause" | "resume" | "seek" | "play";
  timestamp: number;
  time: number;
  duration?: number;
  id?: string;
}

interface VideoActionInput {
  type: string;
  duration?: number;
  [key: string]: unknown;
}

interface CritiqueSession {
  videoUrl: string;
  recordedVideoUrl: string | null;
  drawActions: DrawAction[];
  videoActions: unknown[];
  timelineEvents: TimelineEvent[];
  createdAt: string;
  id: string;
}

export const useUnifiedCritiqueScreenRecording = (
  videoRef: React.RefObject<HTMLVideoElement>,
  videoUrl: string
) => {
  const { videoId } = useParams<{ videoId: string }>();
  const [drawActions, setDrawActionsState] = useState<DrawAction[]>([]);
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const cleanupRef = useRef<(() => void)[]>([]);
  const { setSidebarOpen } = useApp();

  const {
    isRecording,
    recordedVideoUrl,
    recordedVideoBlob,
    permissionStatus,
    errorMessage,
    startRecording,
    stopRecording,
    clearRecording,
  } = useScreenRecorder({
    onError: (error) => {
      console.error("Screen recording error:", error);
      setIsDrawingEnabled(false);
      setIsInitializing(false);
    },
  });

  const { videoActions, addVideoAction, clearVideoActions } = useVideoActions();
  const { timelineEvents, addTimelineEvent, clearTimelineEvents } =
    useTimelineActions();

  // Cleanup function
  const performCleanup = useCallback(() => {
    console.log("🧹 Performing cleanup...");

    cleanupRef.current.forEach((cleanup) => {
      try {
        cleanup();
      } catch (error) {
        console.error("Cleanup error:", error);
      }
    });
    cleanupRef.current = [];

    setIsDrawingEnabled(false);
    setIsInitializing(false);
  }, []);

  useEffect(() => {
    return () => {
      performCleanup();
    };
  }, [performCleanup]);

  const addDrawAction = useCallback(
    (action: DrawAction) => {
      if (!action || !isDrawingEnabled || !isRecording) {
        console.warn("⚠️ Cannot add draw action:", {
          action: !!action,
          isDrawingEnabled,
          isRecording,
        });
        return;
      }

      const currentTime = videoRef.current?.currentTime || 0;

      // Enhanced action with proper timing for fade-out
      const enhancedAction = {
        ...action,
        id: action.id || `draw_${Date.now()}_${Math.random()}`,
        startTime: currentTime,
        endTime: currentTime + 1, // 1 second duration for fade-out
        timestamp: Date.now(),
      };

      console.log("📝 Adding draw action with fade timing:", enhancedAction);
      setDrawActionsState((prev) =>
        safeArrayAccess([...safeArrayAccess(prev), enhancedAction])
      );
    },
    [isDrawingEnabled, isRecording, videoRef]
  );

  const clearCanvas = useCallback(() => {
    console.log("🧹 Clearing visual canvas only (timeline preserved)");
  }, []);

  const handleVideoAction = useCallback(
    (action: VideoActionInput) => {
      if (!videoRef.current || !action || !isRecording) return;

      const currentTime = videoRef.current.currentTime;
      const timestamp = Date.now();

      console.log("🎮 Video action:", action.type, "at time:", currentTime);

      // Enhanced action with pause duration tracking for timeline simulation
      const enhancedAction = {
        type: action.type,
        time: currentTime,
        timestamp,
        duration: action.duration || (action.type === "pause" ? 2 : 0), // Default 2s pause
        id: `${action.type}_${currentTime}_${timestamp}`,
        ...action,
      };

      if (typeof addVideoAction === "function") {
        addVideoAction(enhancedAction);
      }

      if (typeof addTimelineEvent === "function") {
        addTimelineEvent(enhancedAction);
      }
    },
    [addVideoAction, addTimelineEvent, isRecording, videoRef]
  );

  const startCritique = useCallback(async () => {
    setSidebarOpen(false);
    if (isRecording || isInitializing) {
      console.warn("⚠️ Already recording or initializing");
      return;
    }

    setIsInitializing(true);
    console.log("🎬 Starting screen recording critique session");

    try {
      // Clear previous data first
      if (typeof clearVideoActions === "function") clearVideoActions();
      if (typeof clearTimelineEvents === "function") clearTimelineEvents();
      setDrawActionsState([]);
      if (typeof clearRecording === "function") clearRecording();

      // Start screen recording immediately (no permission pre-check to preserve user gesture)
      await startRecording();
      console.log("🎥 Screen recording started successfully");

      // Enable drawing after successful recording start
      setIsDrawingEnabled(true);
      setIsInitializing(false);
    } catch (error) {
      console.error("❌ Failed to start screen recording critique:", error);
      setIsDrawingEnabled(false);
      setIsInitializing(false);
      throw error;
    }
  }, [
    isRecording,
    isInitializing,
    startRecording,
    clearVideoActions,
    clearTimelineEvents,
    clearRecording,
    setSidebarOpen,
  ]);

  // Enhanced stopCritique with complete media cleanup
  const stopCritique = useCallback(async () => {
    if (!isRecording && !isInitializing) {
      console.warn("⚠️ No active recording to stop");
      return;
    }

    console.log(
      "🛑 Stopping screen recording critique session - cleaning up all media"
    );

    try {
      // Disable drawing immediately
      setIsDrawingEnabled(false);

      // Stop video if playing
      const video = videoRef.current;
      if (video && !video.paused) {
        video.pause();
        console.log("⏸️ Video paused");
      }

      // Stop screen recording
      if (isRecording) {
        await stopRecording();
        console.log("🎥 Screen recording stopped");
      }

      // Clear initialization state
      setIsInitializing(false);

      // Perform cleanup
      performCleanup();

      console.log("✅ All recording activities stopped successfully");
    } catch (error) {
      console.error("❌ Failed to stop screen recording critique:", error);
      setIsInitializing(false);
      performCleanup();
    }
  }, [isRecording, isInitializing, stopRecording, performCleanup, videoRef]);

  const hasRecordedData =
    recordedVideoUrl ||
    safeArrayAccess(drawActions).length > 0 ||
    safeArrayAccess(videoActions).length > 0;

  return {
    isRecording: isRecording || isInitializing,
    recordedVideoUrl,
    recordedVideoBlob,
    drawActions: safeArrayAccess(drawActions),
    setDrawActions: addDrawAction,
    videoActions: safeArrayAccess(videoActions),
    timelineEvents: safeArrayAccess(timelineEvents),
    isDrawingEnabled,
    hasRecordedData,
    permissionStatus,
    errorMessage,
    startCritique,
    stopCritique,
    handleVideoAction,
    clearCanvas,
  };
};
