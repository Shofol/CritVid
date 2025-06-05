import React from 'react';
import AppLayout from '@/components/AppLayout';
import EnhancedRecentVideos from '@/components/dashboard/EnhancedRecentVideos';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const UserDashboard: React.FC = () => {
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Your Dashboard</h1>
        
        <EnhancedRecentVideos />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/upload-video" className="block">
                <Button className="w-full">Upload New Video</Button>
              </Link>
              <Link to="/find-adjudicator" className="block">
                <Button variant="outline" className="w-full">Find an Adjudicator</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Your account is active and ready to use.</p>
              <Link to="/profile">
                <Button variant="outline" size="sm">Manage Profile</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default UserDashboard;
