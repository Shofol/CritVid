import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Play, Pause, Save, Trash2, Mic, Video } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUnifiedRecorder } from '@/hooks/useUnifiedRecorder';
import { storeAudioData, storeDrawingData, debugAudioStorage } from '@/lib/audioStorage';
import DrawingCanvas from './DrawingCanvas';
import RecordingTimer from './RecordingTimer';

interface EnhancedCritiqueRecorderProps {
  videoUrl: string;
  videoId: string;
  onSave?: () => void;
  onDiscard?: () => void;
}

const EnhancedCritiqueRecorder: React.FC<EnhancedCritiqueRecorderProps> = ({
  videoUrl,
  videoId,
  onSave,
  onDiscard
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingData, setDrawingData] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  
  const {
    isRecording,
    recordingTime,
    audioBlob,
    audioUrl,
    videoActions,
    startRecording,
    stopRecording,
    recordAction,
    saveRecordingData,
    clearRecording,
    error
  } = useUnifiedRecorder(videoRef);
  
  // Handle drawing data updates
  const handleDrawingUpdate = (data: string) => {
    setDrawingData(data);
  };
  
  // Toggle drawing mode
  const toggleDrawing = () => {
    setIsDrawing(!isDrawing);
  };
  
  // Save the critique
  const saveCritique = async () => {
    if (!audioBlob) {
      console.error('No audio recording to save');
      return;
    }
    
    setIsSaving(true);
    try {
      // Save audio data
      await storeAudioData(audioBlob, videoId);
      
      // Save drawing data if exists
      if (drawingData) {
        storeDrawingData(drawingData, videoId);
      }
      
      // Save video actions
      saveRecordingData(videoId);
      
      // Debug to verify data was saved
      debugAudioStorage(videoId);
      
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        if (onSave) onSave();
      }, 1500);
    } catch (error) {
      console.error('Error saving critique:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Discard the recording
  const discardRecording = () => {
    clearRecording();
    setDrawingData(null);
    if (onDiscard) onDiscard();
  };

  // Handle video errors
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video error in EnhancedCritiqueRecorder:', e);
    setVideoError('Unable to load video. Using fallback video.');
    
    // The video will automatically try the fallback source
  };
  
  // Log video source for debugging
  useEffect(() => {
    if (videoRef.current) {
      console.log('EnhancedCritiqueRecorder - Video source:', videoUrl);
      console.log('EnhancedCritiqueRecorder - Video element:', videoRef.current);
    }
  }, [videoUrl]);
  
  return (
    <Card className="w-full mt-4">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base">Record Critique</CardTitle>
        <RecordingTimer 
          isRecording={isRecording} 
          recordingTime={recordingTime} 
          className="ml-auto"
        />
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {videoError && (
          <Alert variant="warning" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{videoError}</AlertDescription>
          </Alert>
        )}
        
        {isRecording && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800 flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse mr-2"></div>
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              Recording in progress - {recordingTime}s elapsed
            </p>
          </div>
        )}
        
        <div className="relative aspect-video bg-slate-950 rounded-md overflow-hidden w-full">
          <video 
            ref={videoRef}
            className="w-full h-full object-contain"
            poster="/placeholder.svg"
            controls={true}
            preload="auto"
            onError={handleVideoError}
            playsInline
            crossOrigin="anonymous"
            muted={false}
          >
            <source src={videoUrl} type="video/mp4" />
            <source src="/sample-dance-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Drawing canvas overlay */}
          <DrawingCanvas 
            isDrawing={isDrawing} 
            videoRef={videoRef} 
            onDrawingUpdate={handleDrawingUpdate} 
          />
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {!isRecording ? (
            <Button 
              onClick={startRecording} 
              disabled={isRecording || isSaving}
              className="flex items-center"
              type="button"
            >
              <Mic className="w-4 h-4 mr-2" /> Start Recording
            </Button>
          ) : (
            <Button 
              onClick={stopRecording}
              variant="destructive"
              className="flex items-center"
              type="button"
            >
              <Pause className="w-4 h-4 mr-2" /> Stop Recording
            </Button>
          )}
          
          <Button 
            variant={isDrawing ? "default" : "outline"} 
            onClick={toggleDrawing}
            className="flex items-center"
            type="button"
          >
            {isDrawing ? "Drawing Mode On" : "Enable Drawing"}
          </Button>
          
          {audioBlob && (
            <>
              <Button 
                variant="outline" 
                onClick={saveCritique}
                disabled={isSaving || saveSuccess}
                className="flex items-center ml-auto"
                type="button"
              >
                <Save className="w-4 h-4 mr-2" /> 
                {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Critique'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={discardRecording}
                disabled={isSaving}
                className="flex items-center"
                type="button"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Discard
              </Button>
            </>
          )}
        </div>
        
        {audioBlob && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
            <h3 className="text-sm font-medium mb-1 flex items-center">
              <Mic className="w-4 h-4 mr-1" />
              Recording Complete
            </h3>
            <p className="text-xs text-muted-foreground">
              Audio recording: {(audioBlob.size / 1024).toFixed(1)} KB
            </p>
            <p className="text-xs text-muted-foreground">
              Video actions: {videoActions.length} (play/pause/seek events)
            </p>
            {drawingData && (
              <p className="text-xs text-muted-foreground">
                Drawing data: {(drawingData.length / 1024).toFixed(1)} KB
              </p>
            )}
          </div>
        )}
        
        {isRecording && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
            <p className="text-sm">
              <span className="font-medium">Recording in progress.</span> Use the video controls to play, pause, 
              and seek as needed. These actions will be synchronized during playback.
            </p>
            {videoActions.length > 0 && (
              <div className="mt-2 text-xs text-red-700 dark:text-red-300">
                <p className="font-medium">Captured events:</p>
                <ul className="list-disc pl-4 mt-1">
                  {videoActions.slice(-3).map((action, index) => (
                    <li key={index}>
                      {action.type.toUpperCase()} at {(action.timestamp / 1000).toFixed(1)}s
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedCritiqueRecorder;
