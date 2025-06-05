import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

interface CritiqueNotesProps {
  notes?: string;
  setNotes?: (notes: string) => void;
  onSubmitCritique?: () => void;
}

const CritiqueNotes: React.FC<CritiqueNotesProps> = ({
  notes: externalNotes,
  setNotes: externalSetNotes,
  onSubmitCritique = () => {},
}) => {
  // Local state for when props aren't provided
  const [localNotes, setLocalNotes] = useState('');
  
  // Determine if we're using props or local state
  const isUsingProps = externalNotes !== undefined && externalSetNotes !== undefined;
  const notes = isUsingProps ? externalNotes : localNotes;
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isUsingProps && externalSetNotes) {
      externalSetNotes(e.target.value);
    } else {
      setLocalNotes(e.target.value);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Critique Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Add your written feedback and notes for the dancer
          </p>
          <Textarea
            placeholder="Write your critique notes here..."
            value={notes}
            onChange={handleNotesChange}
            className="min-h-[150px]"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Save Draft</Button>
        <Button onClick={onSubmitCritique}>Submit Critique</Button>
      </CardFooter>
    </Card>
  );
};

export default CritiqueNotes;
