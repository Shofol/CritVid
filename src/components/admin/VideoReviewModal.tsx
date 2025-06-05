import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, Video, Clock } from 'lucide-react';

interface VideoReview {
  id: string;
  title: string;
  student: string;
  adjudicator: string;
  dateSubmitted: string;
  status: string;
  description?: string;
  duration?: string;
  feedback?: string;
}

interface VideoReviewModalProps {
  review: VideoReview | null;
  isOpen: boolean;
  onClose: () => void;
}

const VideoReviewModal: React.FC<VideoReviewModalProps> = ({ review, isOpen, onClose }) => {
  if (!review) return null;

  const handleWatchVideo = () => {
    // For demo purposes, we'll open a placeholder video
    // In a real app, this would navigate to the video player or open a video modal
    const videoUrl = `https://example.com/videos/${review.id}`;
    console.log('Opening video:', videoUrl);
    
    // You could also navigate to a video page:
    // window.open(`/video/${review.id}`, '_blank');
    
    // Or show a toast notification
    alert(`Opening video: ${review.title}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{review.title}</DialogTitle>
          <DialogDescription>
            Video review details and feedback
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Student:</span>
              <span className="text-sm">{review.student}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Adjudicator:</span>
              <span className="text-sm">{review.adjudicator}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Submitted:</span>
              <span className="text-sm">{review.dateSubmitted}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Duration:</span>
              <span className="text-sm">{review.duration || '5:30'}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Badge variant={review.status === 'completed' ? 'default' : 'secondary'}>
              {review.status}
            </Badge>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="text-sm font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">
              {review.description || 'Classical ballet variation showcasing technical precision and artistic interpretation.'}
            </p>
          </div>
          
          {review.status === 'completed' && (
            <div>
              <h4 className="text-sm font-medium mb-2">Feedback</h4>
              <p className="text-sm text-muted-foreground">
                {review.feedback || 'Excellent technical execution with strong port de bras. Consider working on sustained balances and musical phrasing.'}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleWatchVideo}>
            <Video className="h-4 w-4 mr-2" />
            Watch Video
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoReviewModal;