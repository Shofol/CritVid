import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardSwitcher: React.FC = () => {
  const navigate = useNavigate();
  const { setUserRole } = useApp();

  const handleDashboardSelect = (role: 'client' | 'admin' | 'adjudicator' | 'studio_critique') => {
    setUserRole(role);
    
    switch(role) {
      case 'client':
        navigate('/dashboard');
        break;
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'adjudicator':
        navigate('/adjudicator/dashboard');
        break;
      case 'studio_critique':
        navigate('/studio/dashboard');
        break;
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard Selector</h1>
        <p className="text-muted-foreground mt-2">
          Choose a dashboard to view different user interfaces
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>User Dashboard</CardTitle>
            <CardDescription>For dancers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <span className="text-4xl">💃</span>
            </div>
            <p className="text-sm text-muted-foreground">
              View your uploaded videos, find adjudicators, and track your progress.
            </p>
            <Button 
              className="w-full" 
              onClick={() => handleDashboardSelect('client')}
            >
              View User Dashboard
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Adjudicator Dashboard</CardTitle>
            <CardDescription>For dance professionals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <span className="text-4xl">🧑‍⚖️</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Manage pending critiques, view completed work, and track earnings.
            </p>
            <Button 
              className="w-full" 
              onClick={() => handleDashboardSelect('adjudicator')}
            >
              View Adjudicator Dashboard
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>For system administrators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <span className="text-4xl">👨‍💻</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Manage users, monitor platform activity, and configure system settings.
            </p>
            <Button 
              className="w-full" 
              onClick={() => handleDashboardSelect('admin')}
            >
              View Admin Dashboard
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Studio Critique</CardTitle>
            <CardDescription>For studio owners</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <span className="text-4xl">🎭</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Upload videos, use critique tools, and manage your studio profile.
            </p>
            <Button 
              className="w-full" 
              onClick={() => handleDashboardSelect('studio_critique')}
            >
              View Studio Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          Note: In a production environment, users would only have access to dashboards based on their assigned roles.
        </p>
      </div>
    </div>
  );
};

export default DashboardSwitcher;
