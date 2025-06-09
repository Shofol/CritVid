import { AppLayout } from "@/components/AppLayout";
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
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [drawActions, setDrawActions] = useState<DrawAction[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>(
    "https://tasowytszirhdvdiwuia.supabase.co/storage/v1/object/sign/dance-critiques/dance.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81MjJmOGViYi1iNDllLTQzNTQtOTRhNi04YzQxMjk2ZWYzMGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJkYW5jZS1jcml0aXF1ZXMvZGFuY2UubXA0IiwiaWF0IjoxNzQ5NDEwMDEzLCJleHAiOjE3ODA5NDYwMTN9.qu4MZU1Ocfft0Pc1kiP6GW-x83hnqfknWplpR3NS79g"
  );
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

  return (
    <AppLayout noHeader={true}>
      <div className="container mx-auto -mt-16">
        <PlaybackTrackerFixed
          videoUrl={videoUrl}
          setRecordedAudioUrl={setRecordedAudioUrl}
          drawActions={drawActions}
          setDrawActions={setDrawActions}
          videoRef={videoRef}
        />
      </div>
    </AppLayout>
  );
};

export default PlaybackTrackerPageFixed;
