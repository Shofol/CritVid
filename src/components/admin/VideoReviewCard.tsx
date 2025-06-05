import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface VideoReviewCardProps {
  video: {
    id: string;
    title: string;
    dancerName: string;
    uploadDate: string;
    duration: string;
    status: 'pending' | 'approved' | 'rejected' | 'flagged';
    thumbnail?: string;
  };
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onView: (id: string) => void;
}

const VideoReviewCard: React.FC<VideoReviewCardProps> = ({ 
  video,
  onApprove,
  onReject,
  onView
}) => {
  const getStatusBadge = () => {
    switch (video.status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending Review</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      case 'flagged':
        return <Badge className="bg-orange-500">Flagged</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{video.title}</CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-muted rounded-md mb-3 overflow-hidden">
          {video.thumbnail ? (
            <img 
              src={video.thumbnail} 
              alt={video.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Thumbnail
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm"><span className="font-medium">Dancer:</span> {video.dancerName}</p>
          <p className="text-sm"><span className="font-medium">Uploaded:</span> {video.uploadDate}</p>
          <p className="text-sm"><span className="font-medium">Duration:</span> {video.duration}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="outline" size="sm" onClick={() => onView(video.id)}>
          View Video
        </Button>
        <div className="space-x-2">
          {video.status === 'pending' && (
            <>
              <Button variant="destructive" size="sm" onClick={() => onReject(video.id)}>
                Reject
              </Button>
              <Button size="sm" onClick={() => onApprove(video.id)}>
                Approve
              </Button>
            </>
          )}
          {video.status !== 'pending' && (
            <Button variant="outline" size="sm" onClick={() => onView(video.id)}>
              Review Details
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default VideoReviewCard;
