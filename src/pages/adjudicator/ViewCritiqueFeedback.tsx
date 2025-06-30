import { AppLayout } from "@/components/AppLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  FileText,
  Lightbulb,
  MessageSquare,
  Play,
  Target,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCritiqueFeedbackById } from "../../lib/critiqueService";
import { Exercise } from "../../lib/exerciseService";
import { DANCE_CRITIQUES_BUCKET } from "../../lib/storage";
import { Suggestion } from "../../lib/suggestionService";
import { supabase } from "../../lib/supabase";
import { CritiqueFeedback } from "../../types/critiqueTypes";

const ViewCritiqueFeedback: React.FC = () => {
  const { critiqueFeedbackId } = useParams<{ critiqueFeedbackId: string }>();
  const navigate = useNavigate();
  const [critique, setCritique] = useState<CritiqueFeedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [critiqueFeedbackVideoSrc, setCritiqueFeedbackVideoSrc] = useState<
    string | null
  >(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

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

        // Get signed URL for feedback video
        if (critiqueFeedback.feedback_video?.file_name) {
          const { data, error } = await supabase.storage
            .from(DANCE_CRITIQUES_BUCKET)
            .createSignedUrl(critiqueFeedback.feedback_video.file_name, 3600);

          if (data?.signedUrl) {
            setCritiqueFeedbackVideoSrc(data.signedUrl);
          }
        }

        setCritique(critiqueFeedback);

        // Parse exercises JSON
        if (critiqueFeedback.exercises) {
          try {
            const parsedExercises = JSON.parse(critiqueFeedback.exercises);
            setExercises(Array.isArray(parsedExercises) ? parsedExercises : []);
          } catch (e) {
            console.warn("Failed to parse exercises JSON:", e);
            setExercises([]);
          }
        }

        // Parse suggestions JSON
        if (critiqueFeedback.suggestions) {
          try {
            const parsedSuggestions = JSON.parse(critiqueFeedback.suggestions);
            setSuggestions(
              Array.isArray(parsedSuggestions) ? parsedSuggestions : []
            );
          } catch (e) {
            console.warn("Failed to parse suggestions JSON:", e);
            setSuggestions([]);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load critique feedback"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCritiqueFeedback();
  }, [critiqueFeedbackId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
            <AlertDescription>
              {error || "Critique feedback not found"}
            </AlertDescription>
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
            <div className="flex flex-col">
              <div>
                <h1 className="text-3xl font-bold">
                  {critique.client_video?.title || "Critique Feedback"}
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                {/* <Calendar className="h-4 w-4 text-gray-500" /> */}
                <span className="text-sm text-gray-600">
                  Submitted: {formatDate(critique.created_at)} |
                </span>
                <span>
                  <p className="text-sm text-gray-600">
                    Dance Style: {critique.client_video?.dance_style?.name}
                  </p>
                </span>
              </div>
            </div>
          </div>
          <Badge
            variant={critique.status === "completed" ? "default" : "secondary"}
          >
            {critique.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Section */}
            {critiqueFeedbackVideoSrc && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Play className="h-5 w-5 mr-2" />
                    Feedback Video
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <video
                    src={critiqueFeedbackVideoSrc}
                    controls
                    className="w-full h-full object-contain rounded-lg"
                  />
                </CardContent>
              </Card>
            )}

            {/* Written Feedback Section */}
            {critique.written_feedback && (
              <Card>
                <CardHeader>
                  <CardTitle>Written Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">
                      {critique.written_feedback}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tabbed Content Section */}
            {(critique.note ||
              critique.transcription ||
              exercises.length > 0 ||
              suggestions.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Critique Feedback Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="transcription" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="transcription">
                        <FileText className="h-4 w-4 mr-1" />
                        Transcription
                      </TabsTrigger>
                      <TabsTrigger value="exercises">
                        <Target className="h-4 w-4 mr-1" />
                        Exercises
                      </TabsTrigger>
                      <TabsTrigger value="suggestions">
                        <Lightbulb className="h-4 w-4 mr-1" />
                        Suggestions
                      </TabsTrigger>
                      <TabsTrigger value="notes">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Notes
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="notes" className="space-y-4">
                      {critique.note ? (
                        <div className="space-y-3">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {critique.note}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">
                          No notes available
                        </p>
                      )}
                    </TabsContent>

                    <TabsContent value="transcription" className="space-y-4">
                      {critique.transcription ? (
                        <div className="space-y-3">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {critique.transcription}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">
                          No transcription available
                        </p>
                      )}
                    </TabsContent>

                    <TabsContent value="exercises" className="space-y-4">
                      {exercises.length > 0 ? (
                        <div className="space-y-3">
                          <Badge variant="secondary">
                            Recommended Exercises ({exercises.length})
                          </Badge>
                          <div className="space-y-3">
                            {exercises.map((exercise, index) => (
                              <div
                                key={index}
                                className="p-3 bg-blue-50 rounded-lg border border-blue-200"
                              >
                                <div className="flex items-start space-x-2">
                                  <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <h4 className="font-medium text-sm text-blue-900 mb-1">
                                      {exercise.title || "Untitled Exercise"}
                                    </h4>
                                    <p className="text-sm text-blue-700">
                                      {exercise.description ||
                                        "No description provided"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">
                          No exercise suggestions available
                        </p>
                      )}
                    </TabsContent>

                    <TabsContent value="suggestions" className="space-y-4">
                      {suggestions.length > 0 ? (
                        <div className="space-y-3">
                          <Badge variant="secondary">
                            Dance Suggestions ({suggestions.length})
                          </Badge>
                          <div className="space-y-3">
                            {suggestions.map((suggestion, index) => (
                              <div
                                key={index}
                                className="p-3 bg-green-50 rounded-lg border border-green-200"
                              >
                                <div className="flex items-start space-x-2">
                                  <Lightbulb className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <p className="text-sm text-green-700">
                                      {suggestion.description ||
                                        "No suggestion provided"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">
                          No improvement suggestions available
                        </p>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ViewCritiqueFeedback;
