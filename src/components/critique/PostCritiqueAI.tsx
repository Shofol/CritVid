import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  X as Cancel,
  Edit,
  FileText,
  Loader2,
  MessageSquare,
  Plus,
  Save,
  Target,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Exercise, generateDanceExercises } from "../../lib/exerciseService";
import { DANCE_CRITIQUES_BUCKET } from "../../lib/storage";
import { transcribeAudio } from "../../lib/transcriptionService";

interface PostCritiqueAIProps {
  danceStyle: string;
  audioUrl?: string;
  onFormDataChange?: (data: {
    transcription: string;
    exercises: Exercise[];
    notes: string;
  }) => void;
  initialData?: {
    transcription?: string;
    exercises?: Exercise[];
    notes?: string;
  };
}

interface AIData {
  transcription?: string;
  exercises?: Exercise[];
  loading: boolean;
}

interface EditableExercise extends Exercise {
  id: string;
  isEditing?: boolean;
}

const PostCritiqueAI: React.FC<PostCritiqueAIProps> = ({
  danceStyle,
  audioUrl,
  onFormDataChange,
  initialData,
}) => {
  const [aiData, setAiData] = useState<AIData>({ loading: true });
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [savedNotes, setSavedNotes] = useState("");
  const [exercises, setExercises] = useState<EditableExercise[]>(
    initialData?.exercises?.map((ex, index) => ({
      ...ex,
      id: `exercise-${index}`,
    })) || []
  );
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(
    null
  );

  // Memoize the form data to prevent unnecessary re-renders
  const formData = useMemo(
    () => ({
      transcription: aiData.transcription || "",
      exercises: exercises.map(({ id, isEditing, ...exercise }) => exercise),
      notes: notes,
    }),
    [aiData.transcription, exercises, notes]
  );

  // Memoize the callback to prevent it from changing on every render
  const memoizedOnFormDataChange = useCallback(onFormDataChange || (() => {}), [
    onFormDataChange,
  ]);

  const getTranscription = async (
    audioFilePath: string
  ): Promise<{ success: boolean; transcription?: string; error?: string }> => {
    if (!audioFilePath) return;
    setAiData({ loading: true });
    try {
      const result = await transcribeAudio(
        audioFilePath,
        DANCE_CRITIQUES_BUCKET
      );

      if (result.success && result.transcription) {
        setAiData({
          transcription: result.transcription,
          loading: false,
        });
        // Generate exercises based on the transcription
        const exerciseResult = await generateDanceExercises(
          result.transcription,
          danceStyle
        );

        const generatedExercises = exerciseResult.success
          ? exerciseResult.exercises
          : [];

        // Convert to editable exercises with IDs
        const editableExercises = generatedExercises.map((ex, index) => ({
          ...ex,
          id: `ai-generated-${index}`,
        }));

        setExercises(editableExercises);
        setAiData({
          transcription: result.transcription,
          exercises: generatedExercises,
          loading: false,
        });
      } else {
        console.error("Transcription failed:", result.error);
        setAiData({ loading: false });
      }
    } catch (err) {
      console.error("Failed to load AI data:", err);
      setAiData({ loading: false });
    }
  };

  useEffect(() => {
    if (audioUrl && !initialData?.transcription) {
      getTranscription(audioUrl);
    } else if (initialData?.transcription) {
      setAiData({
        transcription: initialData.transcription,
        exercises: initialData.exercises || [],
        loading: false,
      });
    } else {
      setAiData({ loading: false });
    }
  }, [audioUrl, initialData?.transcription, initialData?.exercises]);

  // Notify parent component of form data changes - only when formData actually changes
  useEffect(() => {
    memoizedOnFormDataChange(formData);
  }, [formData, memoizedOnFormDataChange]);

  const handleSaveNotes = () => {
    setSavedNotes(notes);
    // Here you would typically save to backend
    console.log("Saving notes:", notes);
  };

  const addExercise = () => {
    const newExercise: EditableExercise = {
      id: `exercise-${Date.now()}`,
      title: "",
      description: "",
      isEditing: true,
    };
    setExercises([...exercises, newExercise]);
    setEditingExerciseId(newExercise.id);
  };

  const startEditingExercise = (exerciseId: string) => {
    setEditingExerciseId(exerciseId);
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, isEditing: true } : ex
      )
    );
  };

  const saveExercise = (exerciseId: string) => {
    setEditingExerciseId(null);
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, isEditing: false } : ex
      )
    );
  };

  const cancelEditingExercise = (exerciseId: string) => {
    setEditingExerciseId(null);
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, isEditing: false } : ex
      )
    );
  };

  const deleteExercise = (exerciseId: string) => {
    setExercises(exercises.filter((ex) => ex.id !== exerciseId));
  };

  const updateExerciseField = (
    exerciseId: string,
    field: keyof Exercise,
    value: string
  ) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, [field]: value } : ex
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          AI-Enhanced Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="transcription" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transcription">
              <FileText className="h-4 w-4 mr-1" />
              Transcription
            </TabsTrigger>
            <TabsTrigger value="exercises">
              <Target className="h-4 w-4 mr-1" />
              Exercises
            </TabsTrigger>
            <TabsTrigger value="notes">
              <MessageSquare className="h-4 w-4 mr-1" />
              Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transcription" className="space-y-4">
            {aiData.loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Transcribing audio feedback...</span>
              </div>
            ) : aiData.transcription ? (
              <div className="space-y-3">
                <Badge variant="secondary">AI Transcription</Badge>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm leading-relaxed">
                    {aiData.transcription}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No audio feedback available for transcription
              </p>
            )}
          </TabsContent>

          <TabsContent value="exercises" className="space-y-4">
            {aiData.loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Generating exercise suggestions...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">AI-Suggested Exercises</Badge>
                  <Button onClick={addExercise} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Exercise
                  </Button>
                </div>
                <div className="space-y-3">
                  {exercises.length > 0 ? (
                    exercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="p-3 bg-blue-50 rounded-lg border border-blue-200"
                      >
                        {exercise.isEditing ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() => saveExercise(exercise.id)}
                                  size="sm"
                                  variant="outline"
                                >
                                  <Save className="h-4 w-4 mr-1" />
                                  Save
                                </Button>
                                <Button
                                  onClick={() =>
                                    cancelEditingExercise(exercise.id)
                                  }
                                  size="sm"
                                  variant="outline"
                                >
                                  <Cancel className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                            <Input
                              placeholder="Exercise title"
                              value={exercise.title}
                              onChange={(e) =>
                                updateExerciseField(
                                  exercise.id,
                                  "title",
                                  e.target.value
                                )
                              }
                              className="font-medium text-blue-900"
                            />
                            <Textarea
                              placeholder="Exercise description"
                              value={exercise.description}
                              onChange={(e) =>
                                updateExerciseField(
                                  exercise.id,
                                  "description",
                                  e.target.value
                                )
                              }
                              className="text-sm text-blue-700"
                              rows={3}
                            />
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-2 flex-1">
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
                            <div className="flex space-x-1 ml-2">
                              <Button
                                onClick={() =>
                                  startEditingExercise(exercise.id)
                                }
                                size="sm"
                                variant="ghost"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                onClick={() => deleteExercise(exercise.id)}
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No exercise suggestions available
                    </p>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <div className="space-y-3">
              <label className="text-sm font-medium">Personal Notes</label>
              <Textarea
                placeholder="Add your own notes about this critique..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
              />
              <Button onClick={handleSaveNotes} size="sm">
                Save Notes
              </Button>
              {savedNotes && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-800">
                    Notes saved successfully!
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PostCritiqueAI;
