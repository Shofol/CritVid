import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VideoSubmissionExtended } from '@/types/videoLibrary';
import { Adjudicator } from '@/types/adjudicator';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VideoSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  videos: VideoSubmissionExtended[];
  selectedAdjudicator: Adjudicator;
}

export function VideoSelectionModal({
  isOpen,
  onClose,
  videos,
  selectedAdjudicator
}: VideoSelectionModalProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoSubmissionExtended | null>(null);
  const navigate = useNavigate();
  
  const availableVideos = videos.filter(video => video.status === 'pending');

  const handleSelectVideo = (video: VideoSubmissionExtended) => {
    setSelectedVideo(video);
  };

  const handleSendToAdjudicator = () => {
    if (selectedVideo) {
      navigate(`/checkout/${selectedVideo.id}/${selectedAdjudicator.id}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Select a Video to Send to {selectedAdjudicator.name}
          </DialogTitle>
        </DialogHeader>
        
        {availableVideos.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No available videos to send. All your videos are either already assigned or completed.
            </p>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 mt-4">
              {availableVideos.map((video) => (
                <Card 
                  key={video.id} 
                  className={`hover:shadow-md transition-shadow cursor-pointer ${
                    selectedVideo?.id === video.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleSelectVideo(video)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="relative w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Play className="h-6 w-6 text-gray-400" />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{video.title}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{video.status}</Badge>
                            <Button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectVideo(video);
                              }}
                              size="sm"
                              variant={selectedVideo?.id === video.id ? 'default' : 'outline'}
                            >
                              {selectedVideo?.id === video.id ? 'Selected' : 'Select'}
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {video.danceStyle} • {new Date(video.createdAt).toLocaleDateString()}
                        </p>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {video.feedbackRequested}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {selectedVideo && (
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={handleSendToAdjudicator} size="lg">
                  Send to Adjudicator
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}