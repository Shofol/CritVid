import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/components/AppLayout';
import AdminStatsCard from '@/components/admin/AdminStatsCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the stats page
const mockMonthlyData = [
  { month: 'Jan', users: 120, videos: 350, critiques: 280, revenue: 8500 },
  { month: 'Feb', users: 150, videos: 390, critiques: 310, revenue: 9200 },
  { month: 'Mar', users: 200, videos: 450, critiques: 350, revenue: 10500 },
  { month: 'Apr', users: 220, videos: 480, critiques: 380, revenue: 11200 },
  { month: 'May', users: 250, videos: 520, critiques: 420, revenue: 12100 },
  { month: 'Jun', users: 280, videos: 550, critiques: 460, revenue: 13400 },
];

const mockDailyData = [
  { day: 'Mon', users: 25, videos: 45, critiques: 38 },
  { day: 'Tue', users: 30, videos: 52, critiques: 42 },
  { day: 'Wed', users: 35, videos: 58, critiques: 45 },
  { day: 'Thu', users: 32, videos: 55, critiques: 40 },
  { day: 'Fri', users: 28, videos: 48, critiques: 36 },
  { day: 'Sat', users: 20, videos: 35, critiques: 28 },
  { day: 'Sun', users: 18, videos: 30, critiques: 25 },
];

const mockUserStats = {
  totalUsers: 1245,
  newUsersThisMonth: 85,
  activeUsers: 780,
  averageSessionTime: '12m 30s',
  userGrowthRate: 8.5,
};

const mockContentStats = {
  totalVideos: 3678,
  totalCritiques: 2890,
  averageCritiqueTime: '5m 15s',
  videosThisMonth: 320,
  critiquesThisMonth: 275,
};

const mockRevenueStats = {
  totalRevenue: '$45,890',
  revenueThisMonth: '$12,450',
  averageOrderValue: '$60',
  pendingPayouts: '$3,200',
  revenueGrowthRate: 12.3,
};

const StatsPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Platform Statistics</h1>
        
        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <AdminStatsCard 
            title="Total Users" 
            value={mockUserStats.totalUsers.toString()} 
            trend={{ value: mockUserStats.userGrowthRate, isPositive: true }}
          />
          <AdminStatsCard 
            title="Total Videos" 
            value={mockContentStats.totalVideos.toString()} 
          />
          <AdminStatsCard 
            title="Total Revenue" 
            value={mockRevenueStats.totalRevenue} 
            trend={{ value: mockRevenueStats.revenueGrowthRate, isPositive: true }}
          />
        </div>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Platform Growth</CardTitle>
                <CardDescription>Monthly growth across key metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockMonthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="users" stroke="#8884d8" name="Users" />
                      <Line type="monotone" dataKey="videos" stroke="#82ca9d" name="Videos" />
                      <Line type="monotone" dataKey="critiques" stroke="#ffc658" name="Critiques" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>Daily active users this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockDailyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="users" stroke="#8884d8" name="Users" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Content Creation</CardTitle>
                  <CardDescription>Videos and critiques this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockDailyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="videos" stroke="#82ca9d" name="Videos" />
                        <Line type="monotone" dataKey="critiques" stroke="#ffc658" name="Critiques" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <AdminStatsCard title="Total Users" value={mockUserStats.totalUsers.toString()} />
              <AdminStatsCard title="New This Month" value={mockUserStats.newUsersThisMonth.toString()} />
              <AdminStatsCard title="Active Users" value={mockUserStats.activeUsers.toString()} />
              <AdminStatsCard title="Avg. Session Time" value={mockUserStats.averageSessionTime} />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>User Growth Trend</CardTitle>
                <CardDescription>Monthly user acquisition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockMonthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="users" stroke="#8884d8" name="Users" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="content">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <AdminStatsCard title="Total Videos" value={mockContentStats.totalVideos.toString()} />
              <AdminStatsCard title="Total Critiques" value={mockContentStats.totalCritiques.toString()} />
              <AdminStatsCard title="Videos This Month" value={mockContentStats.videosThisMonth.toString()} />
              <AdminStatsCard title="Avg. Critique Time" value={mockContentStats.averageCritiqueTime} />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Content Creation Trend</CardTitle>
                <CardDescription>Monthly videos and critiques</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockMonthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="videos" stroke="#82ca9d" name="Videos" />
                      <Line type="monotone" dataKey="critiques" stroke="#ffc658" name="Critiques" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="revenue">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <AdminStatsCard title="Total Revenue" value={mockRevenueStats.totalRevenue} />
              <AdminStatsCard title="Revenue This Month" value={mockRevenueStats.revenueThisMonth} />
              <AdminStatsCard title="Avg. Order Value" value={mockRevenueStats.averageOrderValue} />
              <AdminStatsCard title="Pending Payouts" value={mockRevenueStats.pendingPayouts} />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockMonthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default StatsPage;
