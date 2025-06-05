import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';

// DEPRECATED: This component is no longer used in the unified critique system
// Use PlaybackTracker.tsx instead

interface AICritiqueFeedbackProps {
  videoAnalysis?: {
    technique: string[];
    posture: string[];
    timing: string[];
    suggestions: string[];
  };
}

const DELETE_AICritiqueFeedback: React.FC<AICritiqueFeedbackProps> = ({ videoAnalysis }) => {
  if (!videoAnalysis) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No AI analysis available for this video.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          AI Critique Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Technique Analysis */}
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Technique
          </h4>
          <div className="flex flex-wrap gap-2">
            {videoAnalysis.technique.map((item, index) => (
              <Badge key={index} variant="secondary">
                {item}
              </Badge>
            ))}
          </div>
        </div>

        {/* Posture Analysis */}
        <div>
          <h4 className="font-medium mb-2">Posture</h4>
          <div className="flex flex-wrap gap-2">
            {videoAnalysis.posture.map((item, index) => (
              <Badge key={index} variant="outline">
                {item}
              </Badge>
            ))}
          </div>
        </div>

        {/* Timing Analysis */}
        <div>
          <h4 className="font-medium mb-2">Timing</h4>
          <div className="flex flex-wrap gap-2">
            {videoAnalysis.timing.map((item, index) => (
              <Badge key={index} variant="destructive">
                {item}
              </Badge>
            ))}
          </div>
        </div>

        {/* AI Suggestions */}
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Suggestions
          </h4>
          <ul className="space-y-1">
            {videoAnalysis.suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-gray-600">
                • {suggestion}
              </li>
            ))}
          </ul>
        </div>

        <Button variant="outline" className="w-full">
          Generate Detailed Report
        </Button>
      </CardContent>
    </Card>
  );
};

export default DELETE_AICritiqueFeedback;