import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Critique } from '@/types';

interface CritiquePlayerProps {
  critique: Critique;
}

const CritiquePlayer: React.FC<CritiquePlayerProps> = ({ critique }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Critique Feedback</CardTitle>
        <CardDescription>
          Provided on {new Date(critique.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Player */}
        <div className="aspect-video bg-muted rounded-md flex items-center justify-center relative overflow-hidden">
          <video 
            controls 
            className="w-full h-full object-cover"
            poster="/placeholder.svg"
          >
            <source src={critique.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        {/* Audio Player for Voice Over */}
        <div className="p-4 bg-muted rounded-md">
          <h4 className="font-medium mb-2">Voice Commentary</h4>
          <audio controls className="w-full">
            <source src={critique.voiceOverUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
        
        {/* Transcription */}
        <div>
          <h4 className="font-medium mb-2">Transcription</h4>
          <p className="text-sm text-muted-foreground">{critique.transcription}</p>
        </div>
        
        {/* AI Suggestions */}
        <div>
          <h4 className="font-medium mb-2">Practice Suggestions</h4>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            {critique.aiSuggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Download Critique</Button>
        {critique.rating === undefined ? (
          <Button>Rate This Critique</Button>
        ) : (
          <div className="flex items-center space-x-1">
            <span className="text-sm font-medium">Your Rating:</span>
            <span className="text-yellow-500">{"★".repeat(critique.rating)}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default CritiquePlayer;