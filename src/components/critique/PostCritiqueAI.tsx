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
  Lightbulb,
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
import {
  Suggestion,
  generateDanceSuggestions,
} from "../../lib/suggestionService";
import { transcribeAudio } from "../../lib/transcriptionService";

interface PostCritiqueAIProps {
  danceStyle: string;
  audioUrl?: string;
  onFormDataChange?: (data: {
    transcription: string;
    exercises: Exercise[];
    suggestions: Suggestion[];
    notes: string;
    writtenFeedback?: string;
  }) => void;
  initialData?: {
    transcription?: string;
    exercises?: Exercise[];
    suggestions?: Suggestion[];
    notes?: string;
    writtenFeedback?: string;
  };
}

interface AIData {
  transcription?: string;
  exercises?: Exercise[];
  suggestions?: Suggestion[];
  loading: boolean;
}

interface EditableExercise extends Exercise {
  id: string;
  isEditing?: boolean;
}

interface EditableSuggestion extends Suggestion {
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
  const [exercises, setExercises] = useState<EditableExercise[]>(
    initialData?.exercises?.map((ex, index) => ({
      ...ex,
      id: `exercise-${index}`,
    })) || []
  );
  const [suggestions, setSuggestions] = useState<EditableSuggestion[]>(
    initialData?.suggestions?.map((s, index) => ({
      ...s,
      id: `suggestion-${index}`,
    })) || []
  );
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(
    null
  );
  const [editingSuggestionId, setEditingSuggestionId] = useState<string | null>(
    null
  );

  // Memoize the form data to prevent unnecessary re-renders
  const formData = useMemo(
    () => ({
      transcription: aiData.transcription || "",
      exercises: exercises.map(({ id, isEditing, ...exercise }) => exercise),
      suggestions: suggestions.map(
        ({ id, isEditing, ...suggestion }) => suggestion
      ),
      notes: notes,
    }),
    [aiData.transcription, exercises, suggestions, notes]
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

        // Generate suggestions based on the transcription
        const suggestionResult = await generateDanceSuggestions(
          result.transcription,
          danceStyle,
          5
        );

        const generatedSuggestions = suggestionResult.success
          ? suggestionResult.suggestions
          : [];

        // Convert to editable suggestions with IDs
        const editableSuggestions = generatedSuggestions.map((s, index) => ({
          ...s,
          id: `ai-generated-suggestion-${index}`,
        }));

        setExercises(editableExercises);
        setSuggestions(editableSuggestions);
        setAiData({
          transcription: result.transcription,
          exercises: generatedExercises,
          suggestions: generatedSuggestions,
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
        suggestions: initialData.suggestions || [],
        loading: false,
      });
    } else {
      setAiData({ loading: false });
    }
  }, [
    audioUrl,
    initialData?.transcription,
    initialData?.exercises,
    initialData?.suggestions,
  ]);

  // Notify parent component of form data changes - only when formData actually changes
  useEffect(() => {
    memoizedOnFormDataChange(formData);
  }, [formData, memoizedOnFormDataChange]);

  // Exercise functions
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

  // Suggestion functions
  const addSuggestion = () => {
    const newSuggestion: EditableSuggestion = {
      id: `suggestion-${Date.now()}`,
      description: "",
      isEditing: true,
    };
    setSuggestions([...suggestions, newSuggestion]);
    setEditingSuggestionId(newSuggestion.id);
  };

  const startEditingSuggestion = (suggestionId: string) => {
    setEditingSuggestionId(suggestionId);
    setSuggestions(
      suggestions.map((s) =>
        s.id === suggestionId ? { ...s, isEditing: true } : s
      )
    );
  };

  const saveSuggestion = (suggestionId: string) => {
    setEditingSuggestionId(null);
    setSuggestions(
      suggestions.map((s) =>
        s.id === suggestionId ? { ...s, isEditing: false } : s
      )
    );
  };

  const cancelEditingSuggestion = (suggestionId: string) => {
    setEditingSuggestionId(null);
    setSuggestions(
      suggestions.map((s) =>
        s.id === suggestionId ? { ...s, isEditing: false } : s
      )
    );
  };

  const deleteSuggestion = async (suggestionId: string) => {
    // Remove the suggestion
    const updatedSuggestions = suggestions.filter((s) => s.id !== suggestionId);
    setSuggestions(updatedSuggestions);

    // If we have less than 5 suggestions and have a transcription, generate a new one
    if (updatedSuggestions.length < 5 && aiData.transcription) {
      try {
        const suggestionResult = await generateDanceSuggestions(
          aiData.transcription,
          danceStyle,
          1
        );

        if (
          suggestionResult.success &&
          suggestionResult.suggestions?.length > 0
        ) {
          const newSuggestion: EditableSuggestion = {
            ...suggestionResult.suggestions[0],
            id: `ai-generated-suggestion-${Date.now()}`,
          };
          setSuggestions([...updatedSuggestions, newSuggestion]);
        }
      } catch (err) {
        console.error("Failed to generate new suggestion:", err);
      }
    }
  };

  const updateSuggestionField = (
    suggestionId: string,
    field: keyof Suggestion,
    value: string
  ) => {
    setSuggestions(
      suggestions.map((s) =>
        s.id === suggestionId ? { ...s, [field]: value } : s
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

          <TabsContent value="suggestions" className="space-y-4">
            {aiData.loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Generating improvement suggestions...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">AI Improvement Suggestions</Badge>
                  <Button onClick={addSuggestion} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Suggestion
                  </Button>
                </div>
                <div className="space-y-3">
                  {suggestions.length > 0 ? (
                    suggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className="p-3 bg-green-50 rounded-lg border border-green-200"
                      >
                        {suggestion.isEditing ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Lightbulb className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() => saveSuggestion(suggestion.id)}
                                  size="sm"
                                  variant="outline"
                                >
                                  <Save className="h-4 w-4 mr-1" />
                                  Save
                                </Button>
                                <Button
                                  onClick={() =>
                                    cancelEditingSuggestion(suggestion.id)
                                  }
                                  size="sm"
                                  variant="outline"
                                >
                                  <Cancel className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                            <Textarea
                              placeholder="Enter your suggestion..."
                              value={suggestion.description}
                              onChange={(e) =>
                                updateSuggestionField(
                                  suggestion.id,
                                  "description",
                                  e.target.value
                                )
                              }
                              className="text-sm text-green-700"
                              rows={3}
                            />
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-2 flex-1">
                              <Lightbulb className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-sm text-green-700">
                                  {suggestion.description ||
                                    "No suggestion provided"}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-1 ml-2">
                              <Button
                                onClick={() =>
                                  startEditingSuggestion(suggestion.id)
                                }
                                size="sm"
                                variant="ghost"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                onClick={() => deleteSuggestion(suggestion.id)}
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
                      No improvement suggestions available
                    </p>
                  )}
                </div>
                {suggestions.length > 0 && (
                  <div className="text-xs text-muted-foreground text-center">
                    {suggestions.length}/5 suggestions (minimum 5 required for
                    submission)
                  </div>
                )}
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
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PostCritiqueAI;
