import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

// DEPRECATED: This page is no longer used in the unified critique system
// Use PlaybackTrackerPage.tsx instead

const DELETE_VideoEditor: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  // Mock video URL - in real app this would come from API
  const videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";

  const handleStartRecording = () => {
    setIsRecording(true);
    // Recording logic would go here
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Stop recording logic would go here
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            <h1 className="text-3xl font-bold">Video Editor (Deprecated)</h1>
          </div>
          
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <p className="text-amber-800 font-medium">
                  ⚠️ This video editor has been deprecated and replaced by the unified PlaybackTracker system.
                </p>
                <p className="text-amber-700">
                  Please use the new critique studio which provides:
                </p>
                <ul className="list-disc list-inside text-amber-700 space-y-1">
                  <li>Unified audio recording and video playback</li>
                  <li>Real-time drawing annotations</li>
                  <li>Timeline synchronization</li>
                  <li>Improved performance and reliability</li>
                </ul>
                <div className="pt-2">
                  <Button 
                    onClick={() => window.location.href = `/critique-editor/${videoId || 'demo'}`}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Go to New Critique Studio
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {videoId && (
            <p className="text-sm text-blue-600 mt-4">
              Video ID: {videoId}
            </p>
          )}
        </div>
        
        {/* Legacy Editor Interface (Non-functional) */}
        <Card className="opacity-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Legacy Video Editor
              <Badge variant="secondary">Disabled</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-auto rounded"
                controls
                style={{ filter: 'grayscale(50%)' }}
              />
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  disabled
                  onClick={handleStartRecording}
                >
                  {isRecording ? 'Recording...' : 'Start Recording'}
                </Button>
                <Button 
                  variant="outline" 
                  disabled
                  onClick={handleStopRecording}
                >
                  Stop Recording
                </Button>
              </div>
              
              <p className="text-sm text-gray-500">
                This interface is disabled. Please use the new critique studio above.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default DELETE_VideoEditor;