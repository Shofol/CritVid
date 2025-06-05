import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import VideoGrid from './VideoGrid';
import { VideoSubmissionExtended, VideoFilter } from '@/types/videoLibrary';

interface StatusTabsProps {
  videos: VideoSubmissionExtended[];
  filters: VideoFilter;
  userRole?: 'client' | 'admin' | 'teacher' | 'adjudicator';
}

const StatusTabs: React.FC<StatusTabsProps> = ({ videos, filters, userRole = 'client' }) => {
  // Ensure videos is an array before processing
  const videoList = Array.isArray(videos) ? videos : [];
  
  // Count videos by status
  const statusCounts = React.useMemo(() => {
    const counts = {
      all: videoList.length,
      pending: 0,
      assigned: 0,
      completed: 0
    };
    
    videoList.forEach(video => {
      if (video && video.status) {
        const status = video.status as keyof typeof counts;
        if (status in counts) {
          counts[status]++;
        }
      }
    });
    
    return counts;
  }, [videoList]);

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="all" className="flex items-center gap-2">
          All Videos
          <Badge variant="secondary" className="text-xs">
            {statusCounts.all}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="pending" className="flex items-center gap-2">
          Pending
          <Badge variant="secondary" className="text-xs">
            {statusCounts.pending}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="assigned" className="flex items-center gap-2">
          In Review
          <Badge variant="secondary" className="text-xs">
            {statusCounts.assigned}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="completed" className="flex items-center gap-2">
          Completed
          <Badge variant="secondary" className="text-xs">
            {statusCounts.completed}
          </Badge>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-6">
        <VideoGrid 
          videos={videoList} 
          filters={{ ...filters, status: 'all' }} 
          userRole={userRole} 
        />
      </TabsContent>
      
      <TabsContent value="pending" className="mt-6">
        <VideoGrid 
          videos={videoList} 
          filters={{ ...filters, status: 'pending' }} 
          userRole={userRole} 
        />
      </TabsContent>
      
      <TabsContent value="assigned" className="mt-6">
        <VideoGrid 
          videos={videoList} 
          filters={{ ...filters, status: 'assigned' }} 
          userRole={userRole} 
        />
      </TabsContent>
      
      <TabsContent value="completed" className="mt-6">
        <VideoGrid 
          videos={videoList} 
          filters={{ ...filters, status: 'completed' }} 
          userRole={userRole} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default StatusTabs;