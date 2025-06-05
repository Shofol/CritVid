import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Adjudicator } from '@/types/adjudicator';
import { VideoSubmissionExtended } from '@/types/videoLibrary';
import { VideoSelectionModal } from '@/components/video-library/VideoSelectionModal';
import { Upload, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VideoAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAdjudicator: Adjudicator;
  videos: VideoSubmissionExtended[];
  onAssignVideo: (videoId: string, adjudicatorId: string) => void;
}

export function VideoAssignmentModal({
  isOpen,
  onClose,
  selectedAdjudicator,
  videos,
  onAssignVideo
}: VideoAssignmentModalProps) {
  const [showVideoSelection, setShowVideoSelection] = useState(false);
  const navigate = useNavigate();

  const handleUploadNewVideo = () => {
    // Store selected adjudicator in session storage for after upload
    sessionStorage.setItem('selectedAdjudicatorId', selectedAdjudicator.id);
    sessionStorage.setItem('selectedAdjudicatorName', selectedAdjudicator.name);
    onClose();
    navigate('/upload-video');
  };

  const handleSelectFromVideos = () => {
    setShowVideoSelection(true);
  };

  const handleVideoSelected = (video: VideoSubmissionExtended) => {
    onAssignVideo(video.id, selectedAdjudicator.id);
    setShowVideoSelection(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen && !showVideoSelection} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Send Video to {selectedAdjudicator.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleUploadNewVideo}>
              <CardContent className="p-6 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Upload a New Video</h3>
                <p className="text-sm text-muted-foreground">
                  Upload a new video and automatically assign it to {selectedAdjudicator.name}
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleSelectFromVideos}>
              <CardContent className="p-6 text-center">
                <Video className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Select from My Videos</h3>
                <p className="text-sm text-muted-foreground">
                  Choose from your existing videos to send for critique
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <VideoSelectionModal
        isOpen={showVideoSelection}
        onClose={() => setShowVideoSelection(false)}
        videos={videos}
        selectedAdjudicator={selectedAdjudicator}
        onSelectVideo={handleVideoSelected}
      />
    </>
  );
}