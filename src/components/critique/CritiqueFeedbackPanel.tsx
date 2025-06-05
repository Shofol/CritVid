import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, Star } from 'lucide-react';
import { mockCritiques } from '@/data/mockData';

interface CritiqueFeedbackPanelProps {
  critiqueId: string;
  audioUrl?: string;
}

interface CritiqueData {
  transcription?: string;
  aiSuggestions?: string[];
  rating?: number;
}

const CritiqueFeedbackPanel: React.FC<CritiqueFeedbackPanelProps> = ({ critiqueId, audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [critique, setCritique] = useState<CritiqueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCritique = () => {
      setLoading(true);
      
      // Find critique in mock data with safe array check
      const foundCritique = Array.isArray(mockCritiques)
        ? mockCritiques.find(c => c && c.id === critiqueId)
        : null;
      
      if (foundCritique) {
        setCritique({
          transcription: foundCritique.transcription,
          aiSuggestions: Array.isArray(foundCritique.aiSuggestions) ? foundCritique.aiSuggestions : [],
          rating: foundCritique.rating
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
      {/* Audio Player */}
      {audioUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Volume2 className="h-5 w-5 mr-2" />
              Audio Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Button
                onClick={toggleAudio}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 mr-2" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full w-1/3"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rating */}
      {critique?.rating && (
        <Card>
          <CardHeader>
            <CardTitle>Overall Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < critique.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">{critique.rating}/5</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Written Feedback */}
      {critique?.transcription && (
        <Card>
          <CardHeader>
            <CardTitle>Written Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{critique.transcription}</p>
          </CardContent>
        </Card>
      )}

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

export default CritiqueFeedbackPanel;