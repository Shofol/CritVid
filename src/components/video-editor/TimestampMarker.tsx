import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TimestampMarkerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  timestamps?: { time: number; note: string }[];
  addTimestamp?: (note: string) => void;
}

const TimestampMarker: React.FC<TimestampMarkerProps> = ({
  videoRef,
  timestamps = [],
  addTimestamp = () => {},
}) => {
  const [note, setNote] = useState('');
  const [localTimestamps, setLocalTimestamps] = useState<{ time: number; note: string }[]>([]);

  const handleAddTimestamp = () => {
    if (note.trim() && videoRef.current) {
      const newTimestamp = {
        time: videoRef.current.currentTime,
        note: note.trim()
      };
      
      // Use the prop function if provided, otherwise manage state locally
      if (addTimestamp) {
        addTimestamp(note);
      } else {
        setLocalTimestamps([...localTimestamps, newTimestamp]);
      }
      
      setNote('');
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const seekToTimestamp = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    }
  };

  // Use provided timestamps or local state
  const displayTimestamps = timestamps.length > 0 ? timestamps : localTimestamps;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timestamp Markers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Add note for current timestamp"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleAddTimestamp}>Add</Button>
        </div>
        
        {displayTimestamps.length > 0 ? (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {displayTimestamps.map((timestamp, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 p-2 bg-muted rounded-md"
              >
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => seekToTimestamp(timestamp.time)}
                  className="whitespace-nowrap"
                >
                  {formatTime(timestamp.time)}
                </Button>
                <span className="text-sm flex-grow truncate">{timestamp.note}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No timestamps added yet. Add a note at a specific point in the video.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default TimestampMarker;
