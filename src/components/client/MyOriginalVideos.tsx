import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Play, Send } from 'lucide-react';

interface OriginalVideo {
  id: string;
  title: string;
  uploadDate: string;
  duration?: string;
  fileSize?: string;
}

const MyOriginalVideos: React.FC = () => {
  const [videos, setVideos] = useState<OriginalVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOriginalVideos = async () => {
      try {
        setTimeout(() => {
          setVideos([
            {
              id: '1',
              title: 'Ballet Technique Assessment',
              uploadDate: '2024-01-15',
              duration: '3:45',
              fileSize: '125 MB'
            },
            {
              id: '2', 
              title: 'Jazz Routine Practice',
              uploadDate: '2024-01-10',
              duration: '4:12',
              fileSize: '156 MB'
            },
            {
              id: '3',
              title: 'Contemporary Solo',
              uploadDate: '2024-01-08',
              duration: '2:58',
              fileSize: '98 MB'
            }
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch original videos:', error);
        setVideos([]);
        setLoading(false);
      }
    };

    fetchOriginalVideos();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            📁 My Videos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          📁 My Videos
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          These are your uploaded videos. You can reuse these to request new critiques.
        </p>
      </CardHeader>
      <CardContent>
        {videos.length > 0 ? (
          <div className="space-y-4">
            {videos.map((video) => (
              <div key={video.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium">{video.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {video.uploadDate}
                      </span>
                      {video.duration && (
                        <span>Duration: {video.duration}</span>
                      )}
                      {video.fileSize && (
                        <span>Size: {video.fileSize}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-3">
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/video-player/${video.id}`}>
                      <Play className="h-4 w-4 mr-2" />
                      Watch
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to={`/find-adjudicator?video=${video.id}`}>
                      <Send className="h-4 w-4 mr-2" />
                      Send to Adjudicator
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No videos uploaded yet.</p>
            <Button className="mt-4" asChild>
              <Link to="/upload-video">Upload Your First Video</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MyOriginalVideos;