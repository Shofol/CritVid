import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Share2, Film, Save } from 'lucide-react';
import VideoPlayer from '@/components/video-editor/VideoPlayer';
import { saveVideoCritiqueDraft } from '@/lib/api';

interface PrivateCritiqueToolsProps {
  videoUrl: string;
  videoId: string;
}

const PrivateCritiqueTools: React.FC<PrivateCritiqueToolsProps> = ({
  videoUrl,
  videoId
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleDrawing = () => {
    // This function is called when the drawing mode is toggled
    // We don't need to do anything special here
  };

  const handleRecordingSaved = (url: string) => {
    setRecordingUrl(url);
  };

  const handleSaveDraft = async () => {
    setSaveStatus('saving');
    setStatusMessage('Saving critique draft...');

    try {
      const result = await saveVideoCritiqueDraft({
        videoId,
        notes: '',
        timestamps: [],
        audioUrls: recordingUrl ? [recordingUrl] : []
      });

      if (result.success) {
        setSaveStatus('success');
        setStatusMessage('Critique saved successfully!');
      } else {
        setSaveStatus('error');
        setStatusMessage(result.error || 'Failed to save critique');
      }
    } catch (error) {
      setSaveStatus('error');
      setStatusMessage('An unexpected error occurred');
      console.error('Error saving critique:', error);
    }

    // Reset status after a delay
    setTimeout(() => {
      setSaveStatus('idle');
      setStatusMessage('');
    }, 3000);
  };

  const handleDownload = () => {
    // Create a download link for the critique
    if (recordingUrl) {
      const a = document.createElement('a');
      a.href = recordingUrl;
      a.download = `critique-${videoId}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleShare = () => {
    // For now, just copy a link to the clipboard
    // In a real implementation, this would send to a student
    if (recordingUrl) {
      navigator.clipboard.writeText(recordingUrl)
        .then(() => {
          setStatusMessage('Link copied to clipboard!');
          setTimeout(() => setStatusMessage(''), 3000);
        })
        .catch(() => {
          setStatusMessage('Failed to copy link');
          setTimeout(() => setStatusMessage(''), 3000);
        });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Film className="mr-2 h-5 w-5" />
            Edit Video
          </CardTitle>
        </CardHeader>
        <CardContent>
          <VideoPlayer
            videoRef={videoRef}
            videoUrl={videoUrl}
            isRecording={isRecording}
            onToggleRecording={handleToggleRecording}
            onDrawing={handleDrawing}
            videoId={videoId}
            onRecordingSaved={handleRecordingSaved}
            onSaveDraft={handleSaveDraft}
          />

          {saveStatus !== 'idle' && (
            <Alert className={`mt-4 ${saveStatus === 'success' ? 'bg-green-500/10' : saveStatus === 'error' ? 'bg-red-500/10' : 'bg-yellow-500/10'}`}>
              <AlertDescription>{statusMessage}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button
              variant="outline"
              className="flex items-center justify-center"
              onClick={handleSaveDraft}
              disabled={saveStatus === 'saving'}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center"
              onClick={handleDownload}
              disabled={!recordingUrl}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center col-span-2"
              onClick={handleShare}
              disabled={!recordingUrl}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share with Student
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivateCritiqueTools;
