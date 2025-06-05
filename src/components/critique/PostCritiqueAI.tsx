import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Target, MessageSquare, Loader2 } from 'lucide-react';

interface PostCritiqueAIProps {
  critiqueId: string;
  audioUrl?: string;
}

interface AIData {
  transcription?: string;
  exercises?: string[];
  loading: boolean;
}

const PostCritiqueAI: React.FC<PostCritiqueAIProps> = ({ critiqueId, audioUrl }) => {
  const [aiData, setAiData] = useState<AIData>({ loading: true });
  const [notes, setNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState('');

  useEffect(() => {
    const loadAIData = async () => {
      setAiData({ loading: true });
      
      try {
        // Simulate API calls for transcription and exercises
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setAiData({
          transcription: "Your arabesque is beautiful, but try to maintain height through your supporting leg. Your port de bras shows excellent musicality. Focus on your turnout during the pirouettes - you're slightly rolling in on your supporting foot. Overall, great performance with strong emotional connection to the music.",
          exercises: [
            "Practice relevés on one leg to strengthen your supporting leg",
            "Work on slow controlled adagio to improve balance", 
            "Focus on maintaining turnout during transitions",
            "Practice port de bras combinations with musical phrasing"
          ],
          loading: false
        });
      } catch (error) {
        console.error('Failed to load AI data:', error);
        setAiData({ loading: false });
      }
    };

    if (audioUrl) {
      loadAIData();
    } else {
      setAiData({ loading: false });
    }
  }, [critiqueId, audioUrl]);

  const handleSaveNotes = () => {
    setSavedNotes(notes);
    // Here you would typically save to backend
    console.log('Saving notes:', notes);
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
                  <p className="text-sm leading-relaxed">{aiData.transcription}</p>
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
            ) : aiData.exercises && aiData.exercises.length > 0 ? (
              <div className="space-y-3">
                <Badge variant="secondary">AI-Suggested Exercises</Badge>
                <div className="space-y-2">
                  {aiData.exercises.map((exercise, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                      <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{exercise}</span>
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
                  <p className="text-sm text-green-800">Notes saved successfully!</p>
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