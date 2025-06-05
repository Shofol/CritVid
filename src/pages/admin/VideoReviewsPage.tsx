import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/components/AppLayout';
import VideoReviewModal from '@/components/admin/VideoReviewModal';

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

const mockVideoReviews: VideoReview[] = [
  {
    id: '1',
    title: 'Ballet Performance Review',
    student: 'Emma Johnson',
    adjudicator: 'Michael Stevens',
    dateSubmitted: '2023-10-15',
    status: 'completed',
    description: 'Classical ballet variation showcasing technical precision and artistic interpretation.',
    duration: '4:25',
    feedback: 'Excellent technical execution with strong port de bras. Consider working on sustained balances and musical phrasing.'
  },
  {
    id: '2',
    title: 'Contemporary Dance Critique',
    student: 'James Wilson',
    adjudicator: 'Sarah Miller',
    dateSubmitted: '2023-10-12',
    status: 'pending',
    description: 'Modern contemporary piece exploring themes of growth and transformation.',
    duration: '6:15'
  },
  {
    id: '3',
    title: 'Jazz Routine Feedback',
    student: 'Olivia Davis',
    adjudicator: 'Robert Taylor',
    dateSubmitted: '2023-10-10',
    status: 'completed',
    description: 'High-energy jazz routine with complex choreography and dynamic movements.',
    duration: '3:45',
    feedback: 'Great energy and stage presence. Focus on cleaner transitions and sharper isolations for next performance.'
  },
];

const VideoReviewsPage = () => {
  const [selectedReview, setSelectedReview] = useState<VideoReview | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewReview = (review: VideoReview) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  const handleExportData = () => {
    // Export functionality
    console.log('Exporting video review data...');
  };

  const handleFilterReviews = () => {
    // Filter functionality
    console.log('Opening filter options...');
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Video Review Logs</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportData}>
              Export Data
            </Button>
            <Button onClick={handleFilterReviews}>
              Filter Reviews
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Video Reviews</CardTitle>
            <CardDescription>
              Monitor and manage all video critiques submitted through the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Adjudicator</TableHead>
                  <TableHead>Date Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockVideoReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium">{review.title}</TableCell>
                    <TableCell>{review.student}</TableCell>
                    <TableCell>{review.adjudicator}</TableCell>
                    <TableCell>{review.dateSubmitted}</TableCell>
                    <TableCell>
                      <Badge
                        variant={review.status === 'completed' ? 'default' : 'secondary'}
                      >
                        {review.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewReview(review)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <VideoReviewModal
          review={selectedReview}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </AppLayout>
  );
};

export default VideoReviewsPage;