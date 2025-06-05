import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { VideoFilter, VideoSubmissionExtended } from '@/types/videoLibrary';
import VideoFilters from '@/components/video-library/VideoFilters';
import StatusTabs from '@/components/video-library/StatusTabs';
import { mockVideos } from '@/data/mockData';

const VideoLibrary: React.FC = () => {
  const [filters, setFilters] = useState<VideoFilter>({});
  const [videos, setVideos] = useState<VideoSubmissionExtended[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const userRole = 'client';
  
  useEffect(() => {
    const loadVideos = () => {
      setIsLoading(true);
      
      try {
        // Ensure mockVideos is an array and handle null/undefined
        const safeVideos = Array.isArray(mockVideos) ? mockVideos : [];
        
        // Filter out any null/undefined videos
        const validVideos = safeVideos.filter(video => video && video.id);
        setVideos(validVideos);
      } catch (error) {
        console.error('Error loading videos:', error);
        setVideos([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVideos();
  }, []);

  const handleFiltersChange = (newFilters: VideoFilter) => {
    setFilters(newFilters);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto py-6 text-center">
          <p>Loading videos...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Video Library</h1>
            <p className="text-muted-foreground">Manage and track all your dance videos</p>
          </div>
          <Button asChild>
            <Link to="/upload-video">Upload New Video</Link>
          </Button>
        </div>
        
        <VideoFilters filters={filters} onFiltersChange={handleFiltersChange} />
        
        <StatusTabs videos={videos} filters={filters} userRole={userRole} />
      </div>
    </AppLayout>
  );
};

export default VideoLibrary;