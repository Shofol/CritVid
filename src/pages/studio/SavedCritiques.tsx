import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Calendar, User, Trash2 } from 'lucide-react';

interface SavedCritique {
  id: string;
  videoTitle: string;
  studentName: string;
  status: 'draft' | 'finalized';
  createdAt: string;
  updatedAt: string;
  videoId: string;
}

const SavedCritiques: React.FC = () => {
  const { setPrivateCritiqueMode } = useApp();
  const [critiques, setCritiques] = useState<SavedCritique[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPrivateCritiqueMode(true);
    
    const fetchCritiques = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/studio/critiques');
        // const data = await response.json();
        
        // Mock data for now
        setTimeout(() => {
          setCritiques([
            {
              id: 'critique-1',
              videoTitle: 'Ballet Technique Assessment',
              studentName: 'Sarah Mitchell',
              status: 'finalized',
              createdAt: '2024-01-15',
              updatedAt: '2024-01-16',
              videoId: 'video-1'
            },
            {
              id: 'critique-2',
              videoTitle: 'Jazz Routine Practice',
              studentName: 'Michael Chen',
              status: 'draft',
              createdAt: '2024-01-14',
              updatedAt: '2024-01-15',
              videoId: 'video-2'
            },
            {
              id: 'critique-3',
              videoTitle: 'Contemporary Solo',
              studentName: 'Emma Rodriguez',
              status: 'draft',
              createdAt: '2024-01-10',
              updatedAt: '2024-01-12',
              videoId: 'video-3'
            }
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch critiques:', error);
        setLoading(false);
      }
    };

    fetchCritiques();
    
    return () => {
      setPrivateCritiqueMode(false);
    };
  }, [setPrivateCritiqueMode]);

  const handleDelete = async (critiqueId: string) => {
    if (window.confirm('Are you sure you want to delete this critique?')) {
      // TODO: Implement delete API call
      setCritiques(prev => prev.filter(c => c.id !== critiqueId));
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'finalized' ? (
      <Badge variant="default">Finalized</Badge>
    ) : (
      <Badge variant="secondary">Draft</Badge>
    );
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto py-6">
          <h1 className="text-3xl font-bold mb-6">Saved Critiques</h1>
          <Card>
            <CardContent className="p-6">
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
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Saved Critiques</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Critique Library</CardTitle>
            <p className="text-muted-foreground">
              Manage your saved critique drafts and finalized critiques
            </p>
          </CardHeader>
          <CardContent>
            {critiques.length > 0 ? (
              <div className="space-y-4">
                {critiques.map((critique) => (
                  <div key={critique.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium">{critique.videoTitle}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {critique.studentName}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Updated {critique.updatedAt}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(critique.status)}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-3">
                      {critique.status === 'finalized' ? (
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/client/view-critique/${critique.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </Button>
                      ) : null}
                      <Button size="sm" asChild>
                        <Link to={`/critique-editor/${critique.videoId}`}>
                          <Edit className="h-4 w-4 mr-2" />
                          {critique.status === 'draft' ? 'Edit' : 'Edit Critique'}
                        </Link>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDelete(critique.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>You don't have any saved critiques yet.</p>
                <Button className="mt-4" asChild>
                  <Link to="/studio/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SavedCritiques;