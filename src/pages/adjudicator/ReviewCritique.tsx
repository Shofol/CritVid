import { AppLayout } from "@/components/AppLayout";
import PlaybackPreviewPlayer from "@/components/PlaybackPreviewPlayer";
import PostCritiqueAI from "@/components/critique/PostCritiqueAI";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CritiqueFeedbackOptions from "../../components/adjudicator/CritiqueFeedbackOptions";
import { getCritiqueFeedbackById } from "../../lib/critiqueService";

interface CritiqueData {
  id: string;
  videoId: string;
  videoTitle: string;
  adjudicatorName: string;
  createdAt: string;
  status: string;
  audioUrl?: string;
}

interface CritiqueFormData {
  transcription: string;
  aiSuggestions: string[];
  rating: number;
}

const ReviewCritique: React.FC = () => {
  const { critiqueFeedbackId } = useParams<{ critiqueFeedbackId: string }>();
  const navigate = useNavigate();
  const [critique, setCritique] = useState<CritiqueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCritiqueFeedback = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!critiqueFeedbackId) {
          throw new Error("No critique feedback ID provided");
        }

        const critiqueFeedback = await getCritiqueFeedbackById(
          critiqueFeedbackId
        );

        console.log(critiqueFeedback);

        // setCritique(critiqueData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load critique"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCritiqueFeedback();
  }, [critiqueFeedbackId]);

  const handleSaveFeedback = async (feedbackData: CritiqueFormData) => {
    try {
      // Here you would typically save the feedback to your backend
      console.log("Saving feedback:", feedbackData);

      // For now, we'll just log the data
      // In a real implementation, you would call an API to save the feedback
      // await saveCritiqueFeedback(critiqueId!, feedbackData);

      // You could also show a success toast here
      // toast.success("Feedback saved successfully");
    } catch (error) {
      console.error("Failed to save feedback:", error);
      // You could show an error toast here
      // toast.error("Failed to save feedback");
    }
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{critique.videoTitle}</h1>
            </div>
          </div>
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
            <CritiqueFeedbackOptions
              critiqueId={critique.id}
              audioUrl={critique.audioUrl}
              onSave={handleSaveFeedback}
              isEditing={true}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ReviewCritique;
