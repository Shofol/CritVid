import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCritiques } from "@/data/mockData";
import React, { useEffect, useState } from "react";

interface CritiqueFeedbackOptionsProps {
  critiqueId: string;
  audioUrl?: string;
}

interface CritiqueData {
  transcription?: string;
  aiSuggestions?: string[];
  rating?: number;
}

const CritiqueFeedbackOptions: React.FC<CritiqueFeedbackOptionsProps> = ({
  critiqueId,
  audioUrl,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [critique, setCritique] = useState<CritiqueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCritique = () => {
      setLoading(true);

      // Find critique in mock data with safe array check
      const foundCritique = Array.isArray(mockCritiques)
        ? mockCritiques.find((c) => c && c.id === critiqueId)
        : null;

      if (foundCritique) {
        setCritique({
          transcription: foundCritique.transcription,
          aiSuggestions: Array.isArray(foundCritique.aiSuggestions)
            ? foundCritique.aiSuggestions
            : [],
          rating: foundCritique.rating,
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
          <p className="text-sm leading-relaxed">{critique.transcription}</p>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      {critique?.aiSuggestions && critique.aiSuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Improvement Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {critique.aiSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Badge variant="outline" className="mt-0.5">
                    {index + 1}
                  </Badge>
                  <span className="text-sm">{suggestion}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CritiqueFeedbackOptions;
