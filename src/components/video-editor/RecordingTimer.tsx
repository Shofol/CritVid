import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Mic, Video } from 'lucide-react';

interface RecordingTimerProps {
  isRecording: boolean;
  recordingTime: number;
  className?: string;
}

const RecordingTimer: React.FC<RecordingTimerProps> = ({
  isRecording,
  recordingTime,
  className = ''
}) => {
  const [blinkState, setBlinkState] = useState(true);
  
  // Blink effect for recording indicator
  useEffect(() => {
    if (!isRecording) {
      setBlinkState(true);
      return;
    }
    
    const interval = setInterval(() => {
      setBlinkState(prev => !prev);
    }, 500);
    
    return () => clearInterval(interval);
  }, [isRecording]);
  
  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {isRecording ? (
        <Badge 
          variant="outline" 
          className={`${blinkState ? 'bg-red-100 text-red-800 border-red-300' : 'bg-red-600 text-white border-red-700'} transition-colors`}
        >
          <Mic className="w-3 h-3 mr-1" />
          REC {formatTime(recordingTime)}
        </Badge>
      ) : recordingTime > 0 ? (
        <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-300">
          <Clock className="w-3 h-3 mr-1" />
          {formatTime(recordingTime)}
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-300">
          <Video className="w-3 h-3 mr-1" />
          Ready
        </Badge>
      )}
      
      {isRecording && (
        <div className="text-xs text-red-600 font-medium animate-pulse">
          Recording in progress...
        </div>
      )}
    </div>
  );
};

export default RecordingTimer;
