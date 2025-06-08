import AppLayout from "@/components/AppLayout";
import CritiqueFeedbackPanel from "@/components/CritiqueFeedbackPanel";
import PlaybackPreviewPlayer from "@/components/PlaybackPreviewPlayer";
import CritiquePaymentActions from "@/components/client/CritiquePaymentActions";
import PaymentStatusBar from "@/components/client/PaymentStatusBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CritiquePaymentStatus } from "@/lib/paymentService";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface TimelineEvent {
  timestamp: number;
  type: "pause" | "play" | "drawing";
  duration?: number;
  data?: any;
}

interface CritiqueSession {
  videoUrl: string;
  recordedVideoUrl: string | null;
  drawActions: any[];
  videoActions: any[];
  timelineEvents: TimelineEvent[];
  createdAt: string;
  id: string;
}

const CritiquePreview: React.FC = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const [videoUrl, setVideoUrl] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [drawActions, setDrawActions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] =
    useState<CritiquePaymentStatus | null>(null);

  // Load critique data from localStorage
  useEffect(() => {
    const loadCritiqueData = async () => {
      try {
        setIsLoading(true);

        // Load critique session from localStorage
        const critiqueKey = `critique_draft_${videoId || "demo"}`;
        const savedCritique = localStorage.getItem(critiqueKey);

        if (savedCritique) {
          const session: CritiqueSession = JSON.parse(savedCritique);
          console.log("📂 Loaded critique session:", session);

          // Use the recorded screen video if available, otherwise fall back to original video
          setVideoUrl(
            session.recordedVideoUrl ||
              session.videoUrl ||
              "https://www.w3schools.com/html/mov_bbb.mp4"
          );

          // For screen recordings, we don't need separate audio since it's embedded in the video
          setAudioUrl(session.recordedVideoUrl ? "" : "");

          setTimelineEvents(session.timelineEvents || []);
          setDrawActions(session.drawActions || []);

          console.log("✅ Critique data loaded:", {
            hasRecordedVideo: !!session.recordedVideoUrl,
            videoUrl: session.recordedVideoUrl || session.videoUrl,
            drawActions: session.drawActions?.length || 0,
            timelineEvents: session.timelineEvents?.length || 0,
          });
        } else {
          // Fallback to mock data if no saved critique found
          console.log("⚠️ No saved critique found, using fallback");
          setVideoUrl("https://www.w3schools.com/html/mov_bbb.mp4");
          setAudioUrl("");
          setTimelineEvents([]);
          setDrawActions([]);
        }

        // Mock payment status
        setPaymentStatus({
          id: `critique-${videoId}`,
          payment_status: "pending_approval",
          auto_approved: false,
          disputed: false,
        });
      } catch (err) {
        setError("Failed to load critique data");
        console.error("Error loading critique:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCritiqueData();
  }, [videoId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleDownload = () => {
    if (videoUrl && videoUrl.startsWith("blob:")) {
      // Download screen recording
      const a = document.createElement("a");
      a.href = videoUrl;
      a.download = `critique-screen-recording-${videoId || "demo"}-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      console.log("📥 Downloaded screen recording");
    } else {
      console.log("Download critique");
    }
  };

  const handleShare = () => {
    console.log("Share critique");
  };

  const handlePaymentApproval = () => {
    setPaymentStatus((prev) =>
      prev
        ? {
            ...prev,
            payment_status: "approved",
            payment_released_at: new Date().toISOString(),
          }
        : null
    );
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading critique preview...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto p-6">
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={handleBack} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const isPending = paymentStatus?.payment_status === "pending_approval";

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={handleBack} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Critique Preview</h1>
              <p className="text-gray-600">Video ID: {videoId || "demo"}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleShare} variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button onClick={handleDownload} size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        {/* Payment Status Bar */}
        <PaymentStatusBar paymentStatus={paymentStatus} />

        {/* Payment Action Buttons */}
        {isPending && (
          <CritiquePaymentActions
            critiqueId={`critique-${videoId}`}
            onApproval={handlePaymentApproval}
          />
        )}

        {/* Video Player */}
        <Card>
          <CardHeader>
            <CardTitle>
              Critique Playback
              {videoUrl && videoUrl.startsWith("blob:") && (
                <span className="ml-2 text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  🎥 Screen Recording
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PlaybackPreviewPlayer
              videoUrl={videoUrl}
              audioUrl={audioUrl}
              timelineEvents={timelineEvents}
              drawActions={drawActions}
            />
            {videoUrl && videoUrl.startsWith("blob:") && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  📹 This critique includes a screen recording with synchronized
                  audio (system + microphone). All interactions and commentary
                  have been captured for comprehensive review.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Written Feedback Panel */}
        <CritiqueFeedbackPanel
          audioUrl={audioUrl}
          videoId={videoId}
          critiqueId={`critique-${videoId}`}
        />
      </div>
    </AppLayout>
  );
};

export default CritiquePreview;
