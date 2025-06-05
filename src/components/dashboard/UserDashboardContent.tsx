import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const UserDashboardContent: React.FC = () => {
  // Mock data for user dashboard
  const stats = {
    totalVideos: 8,
    pendingCritiques: 2,
    completedCritiques: 6,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dancer Dashboard</h1>
      <p className="text-muted-foreground">Welcome back! Here's an overview of your dance journey.</p>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard 
          title="Total Videos" 
          value={stats.totalVideos.toString()} 
          description="Videos you've uploaded"
        />
        <StatsCard 
          title="Pending Critiques" 
          value={stats.pendingCritiques.toString()} 
          description="Awaiting feedback"
        />
        <StatsCard 
          title="Completed Critiques" 
          value={stats.completedCritiques.toString()} 
          description="Feedback received"
        />
      </div>
      
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you can perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button className="justify-start" variant="outline" asChild>
              <Link to="/upload-video">Upload New Video</Link>
            </Button>
            <Button className="justify-start" variant="outline" asChild>
              <Link to="/video-library">View My Videos</Link>
            </Button>
            <Button className="justify-start" variant="outline" asChild>
              <Link to="/find-adjudicator">Find Adjudicator</Link>
            </Button>
            <Button className="justify-start" variant="outline" asChild>
              <Link to="/critique-editor">Open Critique Editor</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Progress Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Dance Progress</CardTitle>
          <CardDescription>Track your improvement over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              Upload more videos and receive critiques to see your progress chart here.
            </p>
            <Button className="mt-4" asChild>
              <Link to="/upload-video">Upload Your First Video</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, description }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-2xl font-bold">{value}</div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default UserDashboardContent;