import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, Star, Clock } from 'lucide-react';

// DEPRECATED: This component is no longer used in the unified critique system
// Use PlaybackTracker.tsx instead

interface Suggestion {
  id: string;
  type: 'technique' | 'timing' | 'expression' | 'general';
  title: string;
  description: string;
  timestamp?: number;
  priority: 'high' | 'medium' | 'low';
}

interface AISuggestionsProps {
  suggestions: Suggestion[];
  onApplySuggestion?: (suggestionId: string) => void;
}

const DELETE_AISuggestions: React.FC<AISuggestionsProps> = ({
  suggestions = [],
  onApplySuggestion
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'technique': return <Star className="h-4 w-4" />;
      case 'timing': return <Clock className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          AI Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No suggestions available. Upload a video to get AI-powered feedback.
          </p>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(suggestion.type)}
                    <h4 className="font-medium">{suggestion.title}</h4>
                  </div>
                  <Badge variant={getPriorityColor(suggestion.priority)}>
                    {suggestion.priority}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600">
                  {suggestion.description}
                </p>
                
                {suggestion.timestamp && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {Math.floor(suggestion.timestamp / 60)}:{(suggestion.timestamp % 60).toString().padStart(2, '0')}
                  </div>
                )}
                
                {onApplySuggestion && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onApplySuggestion(suggestion.id)}
                  >
                    Apply Suggestion
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DELETE_AISuggestions;