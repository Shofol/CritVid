import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AISuggestionsProps {
  isVisible: boolean;
}

const AISuggestions: React.FC<AISuggestionsProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">AI Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <textarea 
          className="w-full min-h-[100px] p-2 border rounded-md mb-4" 
          defaultValue="Transcribed critique text..."
          readOnly
        />
        
        <h4 className="font-medium mb-2">Suggested Exercises</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Exercise 1 - generated from keywords</li>
          <li>Exercise 2 - focus on technique improvement</li>
          <li>Exercise 3 - recommended practice routine</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default AISuggestions;
