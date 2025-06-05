import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MuxVideoUploader from '@/components/video-editor/MuxVideoUploader';
import MuxVideoPlayer from '@/components/video-editor/MuxVideoPlayer';
import MuxCritiquePlayer from '@/components/video-editor/MuxCritiquePlayer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/AppLayout';

const MuxVideoDemo: React.FC = () => {
  const { toast } = useToast();
  const [videoUrl, setVideoUrl] = useState<string>('/sample-dance-video.mp4');
  const [assetId, setAssetId] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [showCritiquePlayer, setShowCritiquePlayer] = useState(false);
  
  const handleUploadComplete = (assetId: string, playbackUrl: string) => {
    setAssetId(assetId);
    setVideoUrl(playbackUrl);
    toast({
      title: 'Upload Complete',
      description: 'Your video has been uploaded and is ready for critique',
    });
  };
  
  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    
    if (isRecording) {
      // Recording stopped, show the critique player
      setShowCritiquePlayer(true);
      toast({
        title: 'Recording Complete',
        description: 'Your critique has been saved. You can now preview it.',
      });
    } else {
      // Starting a new recording
      setShowCritiquePlayer(false);
      toast({
        title: 'Recording Started',
        description: 'Record your critique with drawings and pauses.',
      });
    }
  };
  
  const handleDrawing = () => {
    if (!isRecording) {
      toast({
        title: 'Drawing Mode',
        description: 'You can now draw on the video. Start recording to save your critique.',
        variant: 'default',
      });
    }
  };
  
  return (
    <AppLayout>
      <div className="container mx-auto py-6 max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>Mux Video Critique Demo</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="record">Record Critique</TabsTrigger>
                <TabsTrigger value="playback" disabled={!showCritiquePlayer}>Playback</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="mt-4">
                <MuxVideoUploader onUploadComplete={handleUploadComplete} />
                
                <div className="mt-4 flex justify-center">
                  <Button 
                    onClick={() => setVideoUrl('/sample-dance-video.mp4')}
                    variant="outline"
                  >
                    Use Sample Video
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="record" className="mt-4">
                <MuxVideoPlayer 
                  videoUrl={videoUrl}
                  onToggleRecording={handleToggleRecording}
                  isRecording={isRecording}
                  onDrawing={handleDrawing}
                  videoId={assetId || 'sample'}
                />
                
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <h3 className="font-medium mb-2">Recording Instructions:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Click "Start Recording" to begin your critique</li>
                    <li>Use "Enable Drawing" to draw on the video</li>
                    <li>Pause the video at any point to focus on specific moments</li>
                    <li>All drawings, pauses, and audio will be synchronized in playback</li>
                    <li>Click "Stop Recording" when finished</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="playback" className="mt-4">
                {showCritiquePlayer ? (
                  <MuxCritiquePlayer 
                    videoUrl={videoUrl}
                    audioUrl={null} // In a real app, this would be the recorded audio URL
                    drawingData={localStorage.getItem(`drawing_${assetId || 'sample'}`)} 
                  />
                ) : (
                  <div className="p-8 text-center">
                    <p>Record a critique first to enable playback</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default MuxVideoDemo;
