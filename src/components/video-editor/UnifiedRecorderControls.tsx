import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Pencil, Save, AlertCircle } from 'lucide-react';
import { storeAudioData, debugAudioStorage } from '@/lib/audioStorage';

interface UnifiedRecorderControlsProps {
  videoId: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  onRecordingSaved: (url: string) => void;
  onDrawingToggle: (enabled: boolean) => void;
}

const UnifiedRecorderControls: React.FC<UnifiedRecorderControlsProps> = ({
  videoId,
  videoRef,
  onRecordingSaved,
  onDrawingToggle,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [audioStatus, setAudioStatus] = useState<string>('idle');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);
  
  const startRecording = async () => {
    if (!videoRef.current) {
      setRecordingError('Video reference is not available');
      return;
    }
    
    try {
      setRecordingError(null);
      setAudioStatus('requesting');
      
      // Request audio permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStatus('granted');
      
      // Reset the video to beginning
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      
      // Initialize recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        // Create blob from chunks
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        console.log(`Recording stopped, blob size: ${audioBlob.size} bytes`);
        setAudioStatus('processing');
        
        try {
          // Store the audio data
          const url = await storeAudioData(audioBlob, videoId);
          console.log(`Audio stored, URL length: ${url.length} characters`);
          onRecordingSaved(url);
          setAudioStatus('saved');
          
          // Debug storage
          debugAudioStorage(videoId);
        } catch (error) {
          console.error('Error storing audio:', error);
          setRecordingError('Failed to save recording');
          setAudioStatus('error');
        }
        
        // Stop all audio tracks
        stream.getAudioTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setAudioStatus('recording');
      
      // Start timer
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setRecordingError('Could not access microphone');
      setAudioStatus('denied');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      // Stop the video
      if (videoRef.current) {
        videoRef.current.pause();
      }
      
      // Stop the recorder
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  const toggleDrawing = () => {
    const newState = !isDrawingEnabled;
    setIsDrawingEnabled(newState);
    onDrawingToggle(newState);
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2 justify-between items-center">
          <div className="flex gap-2">
            {!isRecording ? (
              <Button 
                onClick={startRecording} 
                className="flex items-center"
                variant="destructive"
                disabled={audioStatus === 'requesting'}
              >
                <Mic className="w-4 h-4 mr-2" />
                {audioStatus === 'requesting' ? 'Requesting Mic...' : 'Start Recording'}
              </Button>
            ) : (
              <Button 
                onClick={stopRecording} 
                variant="outline"
                className="flex items-center"
              >
                <MicOff className="w-4 h-4 mr-2" />
                Stop Recording
              </Button>
            )}
            
            <Button
              variant={isDrawingEnabled ? "secondary" : "outline"}
              onClick={toggleDrawing}
              className="flex items-center"
              disabled={!isRecording}
            >
              <Pencil className="w-4 h-4 mr-2" />
              {isDrawingEnabled ? 'Disable Drawing' : 'Enable Drawing'}
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {isRecording && (
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></div>
                <span className="text-sm font-medium">
                  Recording: {formatTime(recordingTime)}
                </span>
              </div>
            )}
            
            {audioStatus === 'saved' && (
              <div className="text-sm text-green-600 dark:text-green-400 flex items-center">
                <Save className="w-4 h-4 mr-1" />
                Audio saved
              </div>
            )}
          </div>
        </div>
        
        {recordingError && (
          <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/20 rounded-md">
            <p className="text-xs text-red-800 dark:text-red-200 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {recordingError}
            </p>
          </div>
        )}
        
        {audioStatus === 'denied' && (
          <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-md">
            <p className="text-xs text-yellow-800 dark:text-yellow-200 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              Microphone access denied. Please allow microphone access in your browser settings.
            </p>
          </div>
        )}
        
        <div className="mt-2 text-xs text-muted-foreground">
          {isRecording ? (
            <p>Recording in progress. Your voice and video interactions are being captured.</p>
          ) : (
            <p>Click "Start Recording" to begin your critique. The system will record your voice as you comment on the video.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedRecorderControls;
