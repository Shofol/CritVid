import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Calendar, User, CreditCard, Play } from 'lucide-react';
import PendingApprovals from '@/components/client/PendingApprovals';

interface VideoWithCritique {
  id: string;
  title: string;
  uploadDate: string;
  adjudicatorName?: string;
  critiqueStatus: 'pending' | 'in_progress' | 'completed' | 'none';
  critiqueId?: string;
}

const MyVideosSection: React.FC = () => {
  const [videos, setVideos] = useState<VideoWithCritique[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setTimeout(() => {
          setVideos([
            {
              id: '1',
              title: 'Ballet Technique Assessment',
              uploadDate: '2024-01-15',
              adjudicatorName: 'Sarah Johnson',
              critiqueStatus: 'completed',
              critiqueId: '1'
            },
            {
              id: '2', 
              title: 'Jazz Routine Practice',
              uploadDate: '2024-01-10',
              adjudicatorName: 'Michael Davis',
              critiqueStatus: 'in_progress'
            },
            {
              id: '3',
              title: 'Contemporary Solo',
              uploadDate: '2024-01-08',
              critiqueStatus: 'pending'
            }
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch videos:', error);
        setVideos([]);
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">No Critique</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>My Videos</CardTitle>
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
      </div>
    );
  }

  const videoList = Array.isArray(videos) ? videos : [];

  return (
    <div className="space-y-6">
      {/* Pending Payment Approvals */}
      <PendingApprovals />
      
      <Card>
        <CardHeader>
          <CardTitle>My Videos</CardTitle>
        </CardHeader>
        <CardContent>
          {videoList.length > 0 ? (
            <div className="space-y-4">
              {videoList.map((video) => (
                <div key={video.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium">{video.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {video.uploadDate}
                        </span>
                        {video.adjudicatorName && (
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {video.adjudicatorName}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(video.critiqueStatus)}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-3">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/video-player/${video.id}`}>
                        <Play className="h-4 w-4 mr-2" />
                        View Video
                      </Link>
                    </Button>
                    {video.critiqueStatus === 'completed' && video.critiqueId ? (
                      <Button size="sm" asChild>
                        <Link to={`/client/view-critique/${video.critiqueId}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Critique
                        </Link>
                      </Button>
                    ) : video.critiqueStatus === 'in_progress' ? (
                      <Button size="sm" variant="outline" disabled>
                        Critique in Progress
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/find-adjudicator?video=${video.id}`}>
                          Request Critique
                        </Link>
                      </Button>
                    )}
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
      
      {/* Billing Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Billing & Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild variant="outline" className="w-full justify-start">
            <Link to="/client/billing">
              <CreditCard className="h-4 w-4 mr-2" />
              View Billing
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link to="/client/payment-methods">
              Payment Methods
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link to="/client/payment-history">
              Payment History
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyVideosSection;