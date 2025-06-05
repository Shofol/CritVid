import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { useApp } from '@/contexts/AppContext';

// Mock data for the admin dashboard
const mockStats = {
  totalUsers: 1245,
  totalVideos: 3678,
  totalCritiques: 2890,
  activeAdjudicators: 42,
  pendingApplications: 7,
  revenueThisMonth: 12450,
  totalReviews: 156,
};

const mockRecentActivity = [
  {
    id: '1',
    type: 'New User',
    description: 'Emma Johnson joined the platform',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    type: 'New Critique',
    description: 'Michael Chen completed a critique for Ballet Variation',
    timestamp: '4 hours ago',
  },
  {
    id: '3',
    type: 'Payment',
    description: 'Sarah Williams received payment for 3 critiques',
    timestamp: '6 hours ago',
  },
  {
    id: '4',
    type: 'Review',
    description: 'New 5-star review for adjudicator Maria Lopez',
    timestamp: '8 hours ago',
  },
  {
    id: '5',
    type: 'Application',
    description: 'New adjudicator application from David Rodriguez',
    timestamp: '1 day ago',
  },
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { setUserRole } = useApp();

  useEffect(() => {
    // Set the role to admin for this dashboard
    setUserRole('admin');
  }, [setUserRole]);

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-8">
          <StatsCard title="Total Users" value={mockStats.totalUsers.toString()} />
          <StatsCard title="Total Videos" value={mockStats.totalVideos.toString()} />
          <StatsCard title="Total Critiques" value={mockStats.totalCritiques.toString()} />
          <StatsCard title="Active Adjudicators" value={mockStats.activeAdjudicators.toString()} />
          <StatsCard title="Pending Applications" value={mockStats.pendingApplications.toString()} />
          <StatsCard title="Revenue (Month)" value={`$${mockStats.revenueThisMonth}`} />
          <StatsCard title="Total Reviews" value={mockStats.totalReviews.toString()} />
        </div>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common administrative tasks you can perform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Button 
                      className="justify-start" 
                      variant="outline" 
                      onClick={() => navigate('/admin/adjudicators')}
                    >
                      Manage Adjudicators
                    </Button>
                    <Button 
                      className="justify-start" 
                      variant="outline" 
                      onClick={() => navigate('/admin/users')}
                    >
                      Manage Users
                    </Button>
                    <Button 
                      className="justify-start" 
                      variant="outline" 
                      onClick={() => navigate('/admin/reviews')}
                    >
                      📝 Manage Reviews
                    </Button>
                    <Button 
                      className="justify-start" 
                      variant="outline" 
                      onClick={() => navigate('/admin/video-reviews')}
                    >
                      Review Videos
                    </Button>
                    <Button 
                      className="justify-start" 
                      variant="outline" 
                      onClick={() => navigate('/admin/payments')}
                    >
                      Payment Reports
                    </Button>
                    <Button 
                      className="justify-start" 
                      variant="outline" 
                      onClick={() => navigate('/admin/settings')}
                    >
                      System Settings
                    </Button>
                    <Button 
                      className="justify-start" 
                      variant="outline" 
                      onClick={() => navigate('/admin/clients')}
                    >
                      View Members/Clients
                    </Button>
                    <Button 
                      className="justify-start" 
                      variant="outline" 
                      onClick={() => navigate('/video-editor')}
                    >
                      Video Editor
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>
                    Current status of the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <StatusItem label="API Services" status="operational" />
                    <StatusItem label="Video Storage" status="operational" />
                    <StatusItem label="Payment Processing" status="operational" />
                    <StatusItem label="Email Delivery" status="operational" />
                    <StatusItem label="Video Processing" status="operational" />
                    <StatusItem label="Review System" status="operational" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest events across the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentActivity.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-sm text-muted-foreground">{title}</p>
      </CardContent>
    </Card>
  );
};

interface StatusItemProps {
  label: string;
  status: 'operational' | 'degraded' | 'down';
}

const StatusItem: React.FC<StatusItemProps> = ({ label, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'operational':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'down':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'operational':
        return 'Operational';
      case 'degraded':
        return 'Degraded Performance';
      case 'down':
        return 'Service Disruption';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="flex items-center justify-between">
      <span className="font-medium">{label}</span>
      <div className="flex items-center">
        <div className={`h-2 w-2 rounded-full ${getStatusColor()} mr-2`}></div>
        <span className="text-sm">{getStatusText()}</span>
      </div>
    </div>
  );
};

interface ActivityItemProps {
  activity: {
    id: string;
    type: string;
    description: string;
    timestamp: string;
  };
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'New User':
        return '👤';
      case 'New Critique':
        return '📝';
      case 'Payment':
        return '💰';
      case 'Review':
        return '⭐';
      case 'Application':
        return '📋';
      default:
        return '📌';
    }
  };

  return (
    <div className="flex items-start space-x-3">
      <div className="text-xl">{getActivityIcon()}</div>
      <div className="flex-1">
        <p className="font-medium">{activity.type}</p>
        <p className="text-sm">{activity.description}</p>
        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;