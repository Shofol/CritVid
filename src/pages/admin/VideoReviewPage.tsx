import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/components/AppLayout';
import VideoReviewCard from '@/components/admin/VideoReviewCard';

// Mock data for videos
const mockVideos = [
  {
    id: '1',
    title: 'Ballet Variation - Swan Lake',
    dancerName: 'Emma Johnson',
    uploadDate: '2023-07-10',
    duration: '2:45',
    status: 'pending' as const,
    thumbnail: '/placeholder.svg',
  },
  {
    id: '2',
    title: 'Contemporary Solo',
    dancerName: 'Michael Chen',
    uploadDate: '2023-07-11',
    duration: '3:20',
    status: 'approved' as const,
    thumbnail: '/placeholder.svg',
  },
  {
    id: '3',
    title: 'Jazz Routine - Competition Piece',
    dancerName: 'Sarah Williams',
    uploadDate: '2023-07-12',
    duration: '2:10',
    status: 'rejected' as const,
    thumbnail: '/placeholder.svg',
  },
  {
    id: '4',
    title: 'Hip Hop Group Performance',
    dancerName: 'David Rodriguez',
    uploadDate: '2023-07-13',
    duration: '4:05',
    status: 'flagged' as const,
    thumbnail: '/placeholder.svg',
  },
  {
    id: '5',
    title: 'Tap Solo - Intermediate Level',
    dancerName: 'Lisa Thompson',
    uploadDate: '2023-07-14',
    duration: '1:55',
    status: 'pending' as const,
    thumbnail: '/placeholder.svg',
  },
];

const VideoReviewPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Filter videos based on search term and status filter
  const filteredVideos = mockVideos.filter(video => {
    const matchesSearch = 
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.dancerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || video.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Count videos by status
  const pendingCount = mockVideos.filter(v => v.status === 'pending').length;
  const approvedCount = mockVideos.filter(v => v.status === 'approved').length;
  const rejectedCount = mockVideos.filter(v => v.status === 'rejected').length;
  const flaggedCount = mockVideos.filter(v => v.status === 'flagged').length;
  
  // Handler functions
  const handleApprove = (id: string) => {
    console.log(`Approving video ${id}`);
    // In a real app, this would update the video status
  };
  
  const handleReject = (id: string) => {
    console.log(`Rejecting video ${id}`);
    // In a real app, this would update the video status
  };
  
  const handleView = (id: string) => {
    console.log(`Viewing video ${id}`);
    // In a real app, this would navigate to the video detail page
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Video Review</h1>
        
        {/* Status Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatusCard title="Pending Review" count={pendingCount} />
          <StatusCard title="Approved" count={approvedCount} />
          <StatusCard title="Rejected" count={rejectedCount} />
          <StatusCard title="Flagged" count={flaggedCount} />
        </div>
        
        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input 
                  placeholder="Search by title or dancer name..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-48">
                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Button variant="outline">Clear Filters</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Videos</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="flagged">Flagged</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map(video => (
                <VideoReviewCard 
                  key={video.id} 
                  video={video} 
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onView={handleView}
                />
              ))}
            </div>
            
            {filteredVideos.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No videos match your search criteria.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="pending">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos
                .filter(video => video.status === 'pending')
                .map(video => (
                  <VideoReviewCard 
                    key={video.id} 
                    video={video} 
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onView={handleView}
                  />
                ))}
            </div>
            
            {filteredVideos.filter(video => video.status === 'pending').length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No pending videos to review.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="flagged">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos
                .filter(video => video.status === 'flagged')
                .map(video => (
                  <VideoReviewCard 
                    key={video.id} 
                    video={video} 
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onView={handleView}
                  />
                ))}
            </div>
            
            {filteredVideos.filter(video => video.status === 'flagged').length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No flagged videos to review.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

interface StatusCardProps {
  title: string;
  count: number;
}

const StatusCard: React.FC<StatusCardProps> = ({ title, count }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-sm text-muted-foreground">{title}</p>
      </CardContent>
    </Card>
  );
};

export default VideoReviewPage;
