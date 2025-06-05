import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Loader2, Download, RefreshCw } from 'lucide-react';

interface CritiqueFeedbackPanelProps {
  audioUrl?: string;
  videoId?: string;
  critiqueId?: string;
}

interface TranscriptSegment {
  timestamp: number;
  text: string;
  confidence?: number;
}

interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  estimatedTime: string;
}

const CritiqueFeedbackPanel: React.FC<CritiqueFeedbackPanelProps> = ({
  audioUrl,
  videoId,
  critiqueId
}) => {
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGeneratingExercises, setIsGeneratingExercises] = useState(false);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);
  const [exerciseError, setExerciseError] = useState<string | null>(null);

  // Safe array checks
  const safeTranscript = Array.isArray(transcript) ? transcript : [];
  const safeExercises = Array.isArray(exercises) ? exercises : [];

  // Placeholder transcript data
  const placeholderTranscript: TranscriptSegment[] = [
    {
      timestamp: 5.2,
      text: "Let's start by looking at your posture during the opening sequence.",
      confidence: 0.95
    },
    {
      timestamp: 12.8,
      text: "I notice your arms could extend more fully during the port de bras.",
      confidence: 0.92
    },
    {
      timestamp: 25.1,
      text: "Your turnout is quite good, but focus on maintaining it through the entire movement.",
      confidence: 0.88
    },
    {
      timestamp: 38.5,
      text: "The timing with the music is excellent in this section.",
      confidence: 0.94
    }
  ];

  // Placeholder exercises data
  const placeholderExercises: Exercise[] = [
    {
      id: '1',
      title: 'Port de Bras Extension',
      description: 'Practice slow, controlled arm movements focusing on full extension and graceful transitions.',
      difficulty: 'Beginner',
      category: 'Technique',
      estimatedTime: '10-15 minutes'
    },
    {
      id: '2',
      title: 'Turnout Strengthening',
      description: 'Exercises to improve and maintain proper turnout throughout complex movements.',
      difficulty: 'Intermediate',
      category: 'Strength',
      estimatedTime: '15-20 minutes'
    },
    {
      id: '3',
      title: 'Musical Phrasing Practice',
      description: 'Work on connecting movement quality to musical dynamics and phrasing.',
      difficulty: 'Advanced',
      category: 'Artistry',
      estimatedTime: '20-25 minutes'
    }
  ];

  // Simulate API calls
  const transcribeAudio = async () => {
    if (!audioUrl) {
      setTranscriptError('No audio URL provided');
      return;
    }

    setIsTranscribing(true);
    setTranscriptError(null);

    try {
      // Placeholder API call - replace with actual endpoint
      const response = await fetch('/api/transcribeAudio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audioUrl, critiqueId })
      });

      if (!response.ok) {
        throw new Error('Transcription service unavailable');
      }

      const data = await response.json();
      setTranscript(data.transcript || placeholderTranscript);
    } catch (error) {
      console.log('Using placeholder transcript data');
      setTranscript(placeholderTranscript);
    } finally {
      setIsTranscribing(false);
    }
  };

  const generateExercises = async () => {
    setIsGeneratingExercises(true);
    setExerciseError(null);

    try {
      // Placeholder API call - replace with actual endpoint
      const response = await fetch('/api/generateExercises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          transcript: safeTranscript.map(t => t.text).join(' '),
          videoId,
          critiqueId 
        })
      });

      if (!response.ok) {
        throw new Error('Exercise generation service unavailable');
      }

      const data = await response.json();
      setExercises(data.exercises || placeholderExercises);
    } catch (error) {
      console.log('Using placeholder exercise data');
      setExercises(placeholderExercises);
    } finally {
      setIsGeneratingExercises(false);
    }
  };

  // Auto-load on mount
  useEffect(() => {
    if (audioUrl) {
      transcribeAudio();
    }
  }, [audioUrl]);

  useEffect(() => {
    if (safeTranscript.length > 0) {
      generateExercises();
    }
  }, [transcript]);

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Written Feedback
          <div className="flex gap-2">
            <Button
              onClick={transcribeAudio}
              disabled={isTranscribing || !audioUrl}
              size="sm"
              variant="outline"
            >
              {isTranscribing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="transcript" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
            <TabsTrigger value="exercises">Suggested Exercises</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transcript" className="space-y-4">
            {transcriptError && (
              <div className="text-red-600 text-sm p-3 bg-red-50 rounded">
                {transcriptError}
              </div>
            )}
            
            {isTranscribing ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Transcribing audio...</span>
              </div>
            ) : (
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {safeTranscript.map((segment, index) => (
                    <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded">
                      <Badge variant="outline" className="text-xs">
                        {formatTimestamp(segment.timestamp)}
                      </Badge>
                      <p className="text-sm flex-1">{segment.text}</p>
                      {segment.confidence && (
                        <span className="text-xs text-gray-500">
                          {Math.round(segment.confidence * 100)}%
                        </span>
                      )}
                    </div>
                  ))}
                  
                  {safeTranscript.length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                      No transcript available. Upload audio to generate.
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
          
          <TabsContent value="exercises" className="space-y-4">
            {exerciseError && (
              <div className="text-red-600 text-sm p-3 bg-red-50 rounded">
                {exerciseError}
              </div>
            )}
            
            {isGeneratingExercises ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Generating personalized exercises...</span>
              </div>
            ) : (
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {safeExercises.map((exercise) => (
                    <div key={exercise.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{exercise.title}</h4>
                        <div className="flex gap-2">
                          <Badge className={getDifficultyColor(exercise.difficulty)}>
                            {exercise.difficulty}
                          </Badge>
                          <Badge variant="outline">{exercise.category}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{exercise.description}</p>
                      <div className="text-xs text-gray-500">
                        Estimated time: {exercise.estimatedTime}
                      </div>
                    </div>
                  ))}
                  
                  {safeExercises.length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                      No exercises generated yet. Complete transcript first.
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CritiqueFeedbackPanel;