import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mockCritiques } from "@/data/mockData";
import { Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface CritiqueFeedbackOptionsProps {
  critiqueId: string;
  audioUrl?: string;
  onSave?: (data: CritiqueFormData) => void;
  isEditing?: boolean;
}

interface CritiqueData {
  transcription?: string;
  aiSuggestions?: string[];
  rating?: number;
}

interface CritiqueFormData {
  transcription: string;
  aiSuggestions: string[];
  rating: number;
}

const CritiqueFeedbackOptions: React.FC<CritiqueFeedbackOptionsProps> = ({
  critiqueId,
  audioUrl,
  onSave,
  isEditing = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [critique, setCritique] = useState<CritiqueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<CritiqueFormData>({
    transcription: "",
    aiSuggestions: [""],
    rating: 0,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadCritique = () => {
      setLoading(true);

      // Find critique in mock data with safe array check
      const foundCritique = Array.isArray(mockCritiques)
        ? mockCritiques.find((c) => c && c.id === critiqueId)
        : null;

      if (foundCritique) {
        const critiqueData = {
          transcription: foundCritique.transcription,
          aiSuggestions: Array.isArray(foundCritique.aiSuggestions)
            ? foundCritique.aiSuggestions
            : [],
          rating: foundCritique.rating,
        };

        setCritique(critiqueData);

        // Initialize form data with existing data or defaults
        setFormData({
          transcription: critiqueData.transcription || "",
          aiSuggestions:
            critiqueData.aiSuggestions && critiqueData.aiSuggestions.length > 0
              ? critiqueData.aiSuggestions
              : [""],
          rating: critiqueData.rating || 0,
        });
      }

      setLoading(false);
    };

    loadCritique();
  }, [critiqueId]);

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
    // Audio playback logic would go here
  };

  const handleTranscriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, transcription: value }));
  };

  const handleSuggestionChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      aiSuggestions: prev.aiSuggestions.map((suggestion, i) =>
        i === index ? value : suggestion
      ),
    }));
  };

  const addSuggestion = () => {
    setFormData((prev) => ({
      ...prev,
      aiSuggestions: [...prev.aiSuggestions, ""],
    }));
  };

  const removeSuggestion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      aiSuggestions: prev.aiSuggestions.filter((_, i) => i !== index),
    }));
  };

  const handleRatingChange = (value: number) => {
    setFormData((prev) => ({ ...prev, rating: value }));
  };

  const handleSave = async () => {
    if (!onSave) return;

    setIsSaving(true);
    try {
      // Filter out empty suggestions
      const cleanData = {
        ...formData,
        aiSuggestions: formData.aiSuggestions.filter(
          (suggestion) => suggestion.trim() !== ""
        ),
      };

      await onSave(cleanData);
    } catch (error) {
      console.error("Failed to save critique feedback:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Written Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Written Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="transcription">Detailed Feedback</Label>
                <Textarea
                  id="transcription"
                  placeholder="Provide detailed written feedback for the dancer..."
                  value={formData.transcription}
                  onChange={(e) => handleTranscriptionChange(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed">{critique?.transcription}</p>
          )}
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Improvement Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              {formData.aiSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Badge variant="outline" className="mt-2 flex-shrink-0">
                    {index + 1}
                  </Badge>
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder={`Suggestion ${index + 1}...`}
                      value={suggestion}
                      onChange={(e) =>
                        handleSuggestionChange(index, e.target.value)
                      }
                    />
                    {formData.aiSuggestions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSuggestion(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSuggestion}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Suggestion
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {critique?.aiSuggestions && critique.aiSuggestions.length > 0 ? (
                critique.aiSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Badge variant="outline" className="mt-0.5">
                      {index + 1}
                    </Badge>
                    <span className="text-sm">{suggestion}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No suggestions provided
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rating */}
      <Card>
        <CardHeader>
          <CardTitle>Rating</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="rating">Performance Rating (1-10)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.rating}
                  onChange={(e) => handleRatingChange(Number(e.target.value))}
                  className="w-20"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{critique?.rating || 0}/10</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      {isEditing && onSave && (
        <Card>
          <CardContent className="pt-6">
            <Button onClick={handleSave} disabled={isSaving} className="w-full">
              {isSaving ? "Saving..." : "Save Feedback"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CritiqueFeedbackOptions;
