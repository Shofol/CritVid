import { AppLayout } from "@/components/AppLayout";
import PlaybackPreviewPlayerFixed from "@/components/PlaybackPreviewPlayerFixed";
import PlaybackTrackerFixed from "@/components/PlaybackTrackerFixed";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

interface DrawAction {
  path: { x: number; y: number }[];
  timestamp: number;
  startTime: number;
  endTime: number;
  color: string;
  width: number;
  id?: string;
  isVisible?: boolean;
}

interface TimelineEvent {
  type: "pause" | "resume" | "seek" | "play";
  timestamp: number;
  time: number;
  duration?: number;
  id?: string;
}

interface CritiqueSession {
  videoUrl: string;
  audioUrl: string | null;
  drawActions: DrawAction[];
  timelineEvents: TimelineEvent[];
  createdAt: string;
  id: string;
}

const PlaybackTrackerPageFixed: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const [isPreview, setIsPreview] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [drawActions, setDrawActions] = useState<DrawAction[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>("/video/dance.mp4");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const savedDraft = localStorage.getItem(
      `critique_draft_${videoId || "demo"}`
    );
    if (savedDraft) {
      try {
        const session: CritiqueSession = JSON.parse(savedDraft);
        setRecordedAudioUrl(session.audioUrl);
        setDrawActions(session.drawActions || []);
        setTimelineEvents(session.timelineEvents || []);
        console.log("📂 Loaded saved draft:", {
          audioUrl: !!session.audioUrl,
          drawActions: session.drawActions?.length || 0,
          timelineEvents: session.timelineEvents?.length || 0,
        });
      } catch (error) {
        console.error("Failed to load saved draft:", error);
      }
    }
  }, [videoId]);

  const handlePreviewCritique = () => {
    const savedDraft = localStorage.getItem(
      `critique_draft_${videoId || "demo"}`
    );
    if (savedDraft) {
      try {
        const session: CritiqueSession = JSON.parse(savedDraft);
        setRecordedAudioUrl(session.audioUrl);
        setDrawActions(session.drawActions || []);
        setTimelineEvents(session.timelineEvents || []);

        console.log("🎬 Starting preview with data:", {
          audioUrl: !!session.audioUrl,
          drawActions: session.drawActions?.length || 0,
          timelineEvents: session.timelineEvents?.length || 0,
          videoUrl,
        });
      } catch (error) {
        console.error("Failed to load saved draft for preview:", error);
      }
    }
    setIsPreview(true);
  };

  const handleBackToEditor = () => {
    setIsPreview(false);
  };

  if (isPreview) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Critique Preview</h1>
              <button
                onClick={handleBackToEditor}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Back to Editor
              </button>
            </div>
            <p className="text-gray-600 mt-2">
              Preview your recorded critique with synchronized audio, video,
              drawings, and timeline events.
            </p>
            <div className="text-sm text-blue-600 mt-2">
              Audio: {recordedAudioUrl ? "✅ Available" : "❌ None"} | Drawings:{" "}
              {drawActions.length} | Timeline Events: {timelineEvents.length}
            </div>
          </div>

          <PlaybackPreviewPlayerFixed
            videoUrl={videoUrl}
            audioUrl={recordedAudioUrl || ""}
            drawActions={drawActions}
            timelineEvents={timelineEvents}
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto -mt-16">
        <PlaybackTrackerFixed
          videoUrl={videoUrl}
          setRecordedAudioUrl={setRecordedAudioUrl}
          drawActions={drawActions}
          setDrawActions={setDrawActions}
          videoRef={videoRef}
          onPreviewCritique={handlePreviewCritique}
        />
      </div>
    </AppLayout>
  );
};

export default PlaybackTrackerPageFixed;
