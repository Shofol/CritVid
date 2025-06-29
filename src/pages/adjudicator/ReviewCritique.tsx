import { AppLayout } from "@/components/AppLayout";
import PostCritiqueAI from "@/components/critique/PostCritiqueAI";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play, Save } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CritiqueFeedbackOptions from "../../components/adjudicator/CritiqueFeedbackOptions";
import {
  getCritiqueFeedbackById,
  updateCritiqueFeedback,
} from "../../lib/critiqueService";
import { Exercise } from "../../lib/exerciseService";
import { DANCE_CRITIQUES_BUCKET } from "../../lib/storage";
import { supabase } from "../../lib/supabase";
import { CritiqueFeedback } from "../../types/critiqueTypes";

interface CritiqueFormData {
  transcription: string;
  aiSuggestions: string[];
  rating: number;
}

interface AICritiqueFormData {
  transcription: string;
  exercises: Exercise[];
  notes: string;
}

const ReviewCritique: React.FC = () => {
  const { critiqueFeedbackId } = useParams<{ critiqueFeedbackId: string }>();
  const navigate = useNavigate();
  const [critique, setCritique] = useState<CritiqueFeedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [critiqueFeedbackVideoSrc, setCritiqueFeedbackVideoSrc] = useState<
    string | null
  >(null);
  const [aiFormData, setAiFormData] = useState<AICritiqueFormData>({
    transcription: "",
    exercises: [],
    notes: "",
  });
  const [feedbackFormData, setFeedbackFormData] = useState<CritiqueFormData>({
    transcription: "",
    aiSuggestions: [],
    rating: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const loadCritiqueFeedback = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!critiqueFeedbackId) {
          throw new Error("No critique feedback ID provided");
        }

        const { data: critiqueFeedback, error: fetchError } =
          await getCritiqueFeedbackById(critiqueFeedbackId);

        if (fetchError || !critiqueFeedback) {
          throw new Error(fetchError || "Failed to load critique feedback");
        }

        const { data, error } = await supabase.storage
          .from(DANCE_CRITIQUES_BUCKET)
          .createSignedUrl(
            `${critiqueFeedback.feedback_video?.file_name}`,
            3600
          );

        setCritiqueFeedbackVideoSrc(data?.signedUrl);

        setCritique(critiqueFeedback);

        // Initialize form data with existing data
        if (critiqueFeedback.transcription) {
          setAiFormData((prev) => ({
            ...prev,
            transcription: critiqueFeedback.transcription,
          }));
        }

        if (critiqueFeedback.exercises) {
          try {
            const exercises = JSON.parse(critiqueFeedback.exercises);
            setAiFormData((prev) => ({
              ...prev,
              exercises: Array.isArray(exercises) ? exercises : [],
            }));
          } catch (e) {
            console.warn("Failed to parse exercises JSON:", e);
          }
        }

        if (critiqueFeedback.note) {
          setAiFormData((prev) => ({
            ...prev,
            notes: critiqueFeedback.note,
          }));
        }

        if (critiqueFeedback.suggestions) {
          try {
            const suggestions = JSON.parse(critiqueFeedback.suggestions);
            setFeedbackFormData((prev) => ({
              ...prev,
              aiSuggestions: Array.isArray(suggestions) ? suggestions : [],
            }));
          } catch (e) {
            console.warn("Failed to parse suggestions JSON:", e);
          }
        }
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

  // Memoize the callback to prevent infinite re-renders
  const handleAiFormDataChange = useCallback((data: AICritiqueFormData) => {
    setAiFormData(data);
  }, []);

  const handleSaveFeedback = useCallback(
    async (feedbackData: CritiqueFormData) => {
      setFeedbackFormData(feedbackData);
    },
    []
  );

  const handleSubmitAll = async () => {
    if (!critiqueFeedbackId) {
      setError("No critique feedback ID available");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare data for submission
      const exercisesJson = JSON.stringify(aiFormData.exercises);
      const suggestionsJson = JSON.stringify(feedbackFormData.aiSuggestions);

      const result = await updateCritiqueFeedback(
        critiqueFeedbackId,
        exercisesJson,
        suggestionsJson,
        aiFormData.transcription,
        aiFormData.notes
      );

      if (result.success) {
        setSubmitSuccess(true);
        console.log("✅ Critique feedback updated successfully");
        // You could show a success toast here
        // toast.success("Critique feedback updated successfully");
      } else {
        throw new Error(result.error || "Failed to update critique feedback");
      }
    } catch (error) {
      console.error("Failed to update critique feedback:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update critique feedback"
      );
      // You could show an error toast here
      // toast.error("Failed to update critique feedback");
    } finally {
      setIsSubmitting(false);
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
              <h1 className="text-3xl font-bold">
                {critique.client_video?.title || "Critique Review"}
              </h1>
            </div>
          </div>
          <Button
            onClick={handleSubmitAll}
            disabled={isSubmitting}
            className="flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Saving..." : "Save All Changes"}
          </Button>
        </div>

        {submitSuccess && (
          <Alert className="mb-6">
            <AlertDescription className="text-green-800">
              ✅ Critique feedback updated successfully!
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {critiqueFeedbackVideoSrc && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Play className="h-5 w-5 mr-2" />
                    Video Critique
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <video
                    src={critiqueFeedbackVideoSrc}
                    controls
                    className="w-full h-full object-contain"
                  />
                </CardContent>
              </Card>
            )}

            <PostCritiqueAI
              danceStyle={critique.client_video?.dance_style.name}
              audioUrl={critique.feedback_video?.audio_file_path}
              onFormDataChange={handleAiFormDataChange}
              initialData={{
                transcription: aiFormData.transcription,
                exercises: aiFormData.exercises,
                notes: aiFormData.notes,
              }}
            />
          </div>
          <div className="space-y-6">
            <CritiqueFeedbackOptions
              critiqueId={critique.id}
              audioUrl={critique.feedback_video?.file_path}
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
