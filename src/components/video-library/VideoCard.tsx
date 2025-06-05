import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VideoSubmissionExtended } from '@/types/videoLibrary';

interface VideoCardProps {
  video: VideoSubmissionExtended;
  userRole?: 'client' | 'admin' | 'teacher' | 'adjudicator';
}

const VideoCard: React.FC<VideoCardProps> = ({ video, userRole = 'client' }) => {
  // Safe checks for video object
  if (!video || !video.id) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderButtons = () => {
    if (userRole === 'client') {
      return (
        <div className="flex gap-2">
          <Link to={`/video/${video.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View Video
            </Button>
          </Link>
          {video.status === 'completed' && (
            <Link to={`/critique/${video.id}`} className="flex-1">
              <Button size="sm" className="w-full">
                View Critique
              </Button>
            </Link>
          )}
        </div>
      );
    }

    // For other roles (admin, teacher, adjudicator)
    return (
      <div className="flex gap-2">
        <Link to={`/critique-editor/${video.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            View
          </Button>
        </Link>
        <Link to={`/critique-editor/${video.id}`} className="flex-1">
          <Button size="sm" className="w-full">
            Edit
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-slate-950 relative">
        <div className="absolute top-2 right-2">
          <Badge className={getStatusColor(video.status || 'pending')}>
            {video.status || 'pending'}
          </Badge>
        </div>
        {video.thumbnailUrl ? (
          <img 
            src={video.thumbnailUrl} 
            alt={video.title || 'Video thumbnail'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white">
            <span className="text-sm">No Preview</span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h4 className="font-semibold truncate mb-1">{video.title || 'Untitled'}</h4>
        <p className="text-sm text-muted-foreground mb-3">{video.danceStyle || 'Unknown Style'}</p>
        {renderButtons()}
      </CardContent>
    </Card>
  );
};

export default VideoCard;