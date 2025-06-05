import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { videoUploadService } from '@/lib/videoUploadService';

interface Video {
  id: string;
  title: string;
  dance_style: string;
  created_at: string;
  status: string;
}

const EnhancedRecentVideos: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const userVideos = await videoUploadService.getUserVideos();
        // Ensure userVideos is an array
        setVideos(Array.isArray(userVideos) ? userVideos : []);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load your videos');
        setVideos([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 mb-6">
        <h3 className="text-xl font-semibold">Recent Videos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video bg-slate-200 animate-pulse"></div>
              <CardContent className="p-4">
                <div className="h-5 bg-slate-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2 mb-3"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-slate-200 rounded animate-pulse flex-1"></div>
                  <div className="h-8 bg-slate-200 rounded animate-pulse flex-1"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 mb-6">
        <h3 className="text-xl font-semibold">Recent Videos</h3>
        <Card className="p-4 text-center">
          <p className="text-red-500">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  // Ensure videos is an array before slicing
  const videoList = Array.isArray(videos) ? videos : [];
  const recentVideos = videoList.slice(0, 3);

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Recent Videos</h3>
        <div className="flex gap-2">
          <Link to="/upload-video">
            <Button variant="outline" size="sm">Upload New Video</Button>
          </Link>
          <Link to="/critique-editor">
            <Button variant="outline" size="sm">Open Critique Editor</Button>
          </Link>
        </div>
      </div>
      
      {recentVideos.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="mb-4">You haven't uploaded any videos yet.</p>
          <Link to="/upload-video">
            <Button>Upload Your First Video</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentVideos.map((video) => (
            <Card key={video.id} className="overflow-hidden">
              <div className="aspect-video bg-slate-950 relative">
                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white">
                  <span className="text-sm">{video.status === 'pending' ? 'Processing...' : 'Ready'}</span>
                </div>
              </div>
              <CardContent className="p-4">
                <h4 className="font-semibold truncate">{video.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{video.dance_style}</p>
                <div className="flex gap-2">
                  <Link to={`/critique-editor/${video.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      View
                    </Button>
                  </Link>
                  <Link to={`/critique-editor/${video.id}`} className="flex-1">
                    <Button size="sm" className="w-full">
                      Edit Video
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedRecentVideos;