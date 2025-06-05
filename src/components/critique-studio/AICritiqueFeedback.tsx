import React from 'react';
import { Card } from '@/components/ui/card';

interface AICritiqueFeedbackProps {
  transcription?: string;
  exercises?: string[];
}

/**
 * A component to display AI-generated feedback for a critique
 */
const AICritiqueFeedback: React.FC<AICritiqueFeedbackProps> = ({
  transcription = "Transcribed critique text...",
  exercises = [
    "Exercise 1 - Improve turnout",
    "Exercise 2 - Arm line clarity",
    "Exercise 3 - Strengthen jumps"
  ]
}) => {
  return (
    <Card className="p-4 mt-4">
      <h3 className="text-lg font-semibold mb-2">AI Feedback Summary</h3>
      <textarea
        defaultValue={transcription}
        className="w-full h-24 p-2 border rounded"
        readOnly
      />
      <h4 className="mt-4 text-md font-medium">Suggested Exercises</h4>
      <ul className="list-disc pl-5">
        {exercises.map((exercise, index) => (
          <li key={index}>{exercise}</li>
        ))}
      </ul>
    </Card>
  );
};

export default AICritiqueFeedback;
