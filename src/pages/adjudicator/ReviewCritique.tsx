import { AppLayout } from "@/components/AppLayout";
import PlaybackPreviewPlayer from "@/components/PlaybackPreviewPlayer";
import CritiquePaymentActions from "@/components/client/CritiquePaymentActions";
import PaymentStatusBar from "@/components/client/PaymentStatusBar";
import CritiqueFeedbackPanel from "@/components/critique/CritiqueFeedbackPanel";
import PostCritiqueAI from "@/components/critique/PostCritiqueAI";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCritiques, mockVideoSubmissions } from "@/data/mockData";
import { CritiquePaymentStatus, paymentService } from "@/lib/paymentService";
import { ArrowLeft, Play } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface CritiqueData {
  id: string;
  videoId: string;
  videoTitle: string;
  adjudicatorName: string;
  createdAt: string;
  status: string;
  audioUrl?: string;
}

const ReviewCritique: React.FC = () => {
  const { critiqueId } = useParams<{ critiqueId: string }>();
  const navigate = useNavigate();
  const [critique, setCritique] = useState<CritiqueData | null>(null);
  const [paymentStatus, setPaymentStatus] =
    useState<CritiquePaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCritique = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!critiqueId) {
          throw new Error("No critique ID provided");
        }

        // Find critique in mock data
        const foundCritique = Array.isArray(mockCritiques)
          ? mockCritiques.find((c) => c && c.id === critiqueId)
          : null;

        if (!foundCritique) {
          throw new Error("Critique not found");
        }

        // Find associated video
        const video = Array.isArray(mockVideoSubmissions)
          ? mockVideoSubmissions.find(
              (v) => v && v.id === foundCritique.submissionId
            )
          : null;

        const critiqueData: CritiqueData = {
          id: foundCritique.id,
          videoId: foundCritique.submissionId,
          videoTitle: video?.title || "Unknown Video",
          adjudicatorName: "Professional Adjudicator",
          createdAt: new Date(foundCritique.createdAt).toLocaleDateString(),
          status: "completed",
          audioUrl: foundCritique.voiceOverUrl,
        };

        setCritique(critiqueData);

        // Load payment status
        const status = await paymentService.getCritiquePaymentStatus(
          critiqueId
        );
        if (status) {
          setPaymentStatus(status);
        } else {
          // Mock payment status for demo
          setPaymentStatus({
            id: critiqueId,
            payment_status: "pending_approval",
            auto_approved: false,
            finalized_at: new Date().toISOString(),
            disputed: false,
          });
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load critique"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCritique();
  }, [critiqueId]);

  const handlePaymentStatusUpdate = (newStatus: CritiquePaymentStatus) => {
    setPaymentStatus(newStatus);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !critique) {
    return (
      <AppLayout>
        <div className="container mx-auto py-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Alert>
            <AlertDescription>{error || "Critique not found"}</AlertDescription>
          </Alert>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        {/* Payment Status Bar */}
        {paymentStatus && (
          <div className="mb-6">
            <PaymentStatusBar paymentStatus={paymentStatus} />
            <CritiquePaymentActions
              critiqueId={critique.id}
              userId="current-user-id"
              paymentStatus={paymentStatus}
              onStatusUpdate={handlePaymentStatusUpdate}
            />
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{critique.videoTitle}</h1>
              <p className="text-muted-foreground">
                Critique by {critique.adjudicatorName} • {critique.createdAt}
              </p>
            </div>
          </div>
          <Badge variant="default">Completed</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Play className="h-5 w-5 mr-2" />
                  Video Critique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PlaybackPreviewPlayer
                  videoId={critique.videoId}
                  critiqueId={critique.id}
                />
              </CardContent>
            </Card>

            <PostCritiqueAI
              critiqueId={critique.id}
              audioUrl={critique.audioUrl}
            />
          </div>
          <div className="space-y-6">
            <CritiqueFeedbackPanel
              critiqueId={critique.id}
              audioUrl={critique.audioUrl}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ReviewCritique;
