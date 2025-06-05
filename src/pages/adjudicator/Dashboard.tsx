import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/components/AppLayout';
import ProfileStatusCard from '@/components/adjudicator/ProfileStatusCard';
import ProfileEditorLink from '@/components/adjudicator/ProfileEditorLink';
import PendingPayments from '@/components/adjudicator/PendingPayments';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useApp } from '@/contexts/AppContext';

// Mock data for the adjudicator dashboard
const mockAssignments = [
  {
    id: '1',
    title: 'Ballet Variation',
    dancerName: 'Emma Johnson',
    danceStyle: 'Ballet',
    submittedDate: '2023-07-15',
    dueDate: '2023-07-18',
  },
  {
    id: '2',
    title: 'Contemporary Solo',
    dancerName: 'Michael Chen',
    danceStyle: 'Contemporary',
    submittedDate: '2023-07-16',
    dueDate: '2023-07-19',
  },
];

const mockCompletedCritiques = [
  {
    id: '1',
    title: 'Jazz Routine',
    dancerName: 'Sophia Williams',
    danceStyle: 'Jazz',
    completedDate: '2023-07-10',
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Hip Hop Performance',
    dancerName: 'Jacob Martinez',
    danceStyle: 'Hip Hop',
    completedDate: '2023-07-05',
    rating: 5.0,
  },
];

const mockStats = {
  totalCritiques: 24,
  averageRating: 4.7,
  totalEarnings: 1680,
  pendingCritiques: 2,
};

const AdjudicatorDashboard: React.FC = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { setUserRole } = useApp();

  useEffect(() => {
    // Set the role to adjudicator for this dashboard
    setUserRole('adjudicator');
    
    const fetchProfile = async () => {
      try {
        // In a real app, you would get the user ID from auth context
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id;

        if (!userId) {
          // For demo purposes, use a mock profile if not authenticated
          setProfileData({
            id: 'mock-profile-id',
            is_active: true
          });
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('adjudicator_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setProfileData(data);
        } else {
          // If no profile exists yet, use a mock profile
          setProfileData({
            id: 'mock-profile-id',
            is_active: true
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your profile data',
          variant: 'destructive',
        });
        // Use mock data as fallback
        setProfileData({
          id: 'mock-profile-id',
          is_active: true
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [toast, setUserRole]);

  const handleStatusChange = (newStatus: boolean) => {
    setProfileData({ ...profileData, is_active: newStatus });
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto py-6">
          <h1 className="text-3xl font-bold mb-6">Loading...</h1>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Adjudicator Dashboard</h1>
          <ProfileEditorLink />
        </div>
        
        {/* Account Status Card */}
        <div className="mb-8">
          <ProfileStatusCard 
            isActive={profileData?.is_active ?? true} 
            adjudicatorId={profileData?.id} 
            onStatusChange={handleStatusChange}
          />
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Total Critiques" value={mockStats.totalCritiques.toString()} />
          <StatsCard title="Average Rating" value={`${mockStats.averageRating} ⭐`} />
          <StatsCard title="Total Earnings" value={`$${mockStats.totalEarnings}`} />
          <StatsCard title="Pending Critiques" value={mockStats.pendingCritiques.toString()} />
        </div>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending Critiques</TabsTrigger>
            <TabsTrigger value="completed">Completed Critiques</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <h2 className="text-xl font-semibold mb-4">Pending Critiques</h2>
            {mockAssignments.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {mockAssignments.map((assignment) => (
                  <PendingCritiqueCard key={assignment.id} assignment={assignment} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No pending critiques at this time.</p>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            <h2 className="text-xl font-semibold mb-4">Completed Critiques</h2>
            {mockCompletedCritiques.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {mockCompletedCritiques.map((critique) => (
                  <CompletedCritiqueCard key={critique.id} critique={critique} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No completed critiques yet.</p>
            )}
          </TabsContent>
          
          <TabsContent value="payments">
            <PendingPayments />
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

interface PendingCritiqueCardProps {
  assignment: {
    id: string;
    title: string;
    dancerName: string;
    danceStyle: string;
    submittedDate: string;
    dueDate: string;
  };
}

const PendingCritiqueCard: React.FC<PendingCritiqueCardProps> = ({ assignment }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{assignment.title}</CardTitle>
            <CardDescription>Dancer: {assignment.dancerName}</CardDescription>
          </div>
          <Badge>{assignment.danceStyle}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm">
            <p>Submitted: {assignment.submittedDate}</p>
            <p className="font-medium">Due: {assignment.dueDate}</p>
          </div>
          <Button>Start Critique</Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface CompletedCritiqueCardProps {
  critique: {
    id: string;
    title: string;
    dancerName: string;
    danceStyle: string;
    completedDate: string;
    rating: number;
  };
}

const CompletedCritiqueCard: React.FC<CompletedCritiqueCardProps> = ({ critique }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{critique.title}</CardTitle>
            <CardDescription>Dancer: {critique.dancerName}</CardDescription>
          </div>
          <Badge>{critique.danceStyle}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <p>Completed: {critique.completedDate}</p>
            <p>Rating: {critique.rating} ⭐</p>
          </div>
          <Button variant="outline">View Critique</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdjudicatorDashboard;