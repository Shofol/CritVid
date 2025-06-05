import React from 'react';
import VideoCard from './VideoCard';
import { VideoSubmissionExtended, VideoFilter } from '@/types/videoLibrary';

interface VideoGridProps {
  videos: VideoSubmissionExtended[];
  filters: VideoFilter;
  userRole?: 'client' | 'admin' | 'teacher' | 'adjudicator';
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos, filters, userRole = 'client' }) => {
  // Ensure videos is an array before processing
  const videoList = Array.isArray(videos) ? videos : [];
  
  // Apply filters and sorting to videos
  const filteredVideos = React.useMemo(() => {
    let result = [...videoList];
    
    // Filter by style
    if (filters.style && filters.style !== 'All') {
      result = result.filter(video => video.danceStyle === filters.style);
    }
    
    // Filter by status
    if (filters.status && filters.status !== 'all') {
      result = result.filter(video => video.status === filters.status);
    }
    
    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(video => {
        return (
          video.title.toLowerCase().includes(query) ||
          video.danceStyle.toLowerCase().includes(query)
        );
      });
    }
    
    // Apply sorting
    if (filters.sortBy) {
      result.sort((a, b) => {
        switch (filters.sortBy) {
          case 'date':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'title':
            return a.title.localeCompare(b.title);
          case 'style':
            return a.danceStyle.localeCompare(b.danceStyle);
          default:
            return 0;
        }
      });
      
      // Apply sort order
      if (filters.sortOrder === 'desc') {
        result.reverse();
      }
    } else {
      // Default sort by date, newest first
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    return result;
  }, [videoList, filters]);

  if (filteredVideos.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-card">
        <p className="text-muted-foreground">No videos match your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredVideos.map(video => (
        <VideoCard key={video.id} video={video} userRole={userRole} />
      ))}
    </div>
  );
};

export default VideoGrid;