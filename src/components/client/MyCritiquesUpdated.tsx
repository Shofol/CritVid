import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Calendar, User, Star, MessageSquare } from 'lucide-react';
import { useReviewPermissions } from '@/hooks/useReviewPermissions';

interface Critique {
  id: string;
  title: string;
  adjudicatorName: string;
  adjudicatorId: string;
  dateCritiqued: string;
  status: 'awaiting_approval' | 'paid' | 'completed';
  rating?: number;
}

const CritiqueItem: React.FC<{ critique: Critique }> = ({ critique }) => {
  const reviewPermissions = useReviewPermissions(critique.id, critique.adjudicatorId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'paid':
        return <Badge variant="secondary">Paid</Badge>;
      case 'awaiting_approval':
        return <Badge variant="outline">Awaiting Approval</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium">{critique.title}</h3>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
            <span className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {critique.adjudicatorName}
            </span>
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {critique.dateCritiqued}
            </span>
            {critique.rating && (
              <span className="flex items-center">
                <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                {critique.rating}/5
              </span>
            )}
          </div>
          
          {/* Review prompt for completed critiques */}
          {critique.status === 'completed' && 
           reviewPermissions.canReview && 
           !reviewPermissions.loading && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
              <div className="flex items-center text-blue-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span className="font-medium">How was your experience with this adjudicator?</span>
              </div>
              <p className="text-blue-600 text-xs mt-1">
                Click "View Critique" to leave a review and help other dancers.
              </p>
            </div>
          )}
          
          {reviewPermissions.hasReviewed && (
            <div className="mt-2 text-sm text-green-600">
              ✓ Review submitted
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge(critique.status)}
        </div>
      </div>
      <div className="flex justify-end space-x-2 mt-3">
        <Button size="sm" variant="outline" asChild>
          <Link to={`/client/view-critique/${critique.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            View Critique
          </Link>
        </Button>
        {critique.status === 'awaiting_approval' && (
          <Button size="sm">
            <Star className="h-4 w-4 mr-2" />
            Approve and Rate
          </Button>
        )}
      </div>
    </div>
  );
};

const MyCritiquesUpdated: React.FC = () => {
  const [critiques, setCritiques] = useState<Critique[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCritiques = async () => {
      try {
        setTimeout(() => {
          setCritiques([
            {
              id: '1',
              title: 'Ballet Technique Assessment - Critique',
              adjudicatorName: 'Sarah Johnson',
              adjudicatorId: 'adj-123',
              dateCritiqued: '2024-01-16',
              status: 'completed',
              rating: 5
            },
            {
              id: '2', 
              title: 'Jazz Routine Practice - Critique',
              adjudicatorName: 'Michael Davis',
              adjudicatorId: 'adj-456',
              dateCritiqued: '2024-01-12',
              status: 'awaiting_approval'
            },
            {
              id: '3',
              title: 'Contemporary Solo - Critique',
              adjudicatorName: 'Emma Wilson',
              adjudicatorId: 'adj-789',
              dateCritiqued: '2024-01-09',
              status: 'completed'
            }
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch critiques:', error);
        setCritiques([]);
        setLoading(false);
      }
    };

    fetchCritiques();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            🎥 My Critiques
          </CardTitle>
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
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          🎥 My Critiques
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Final critique videos with overlays, audio feedback, and drawings from adjudicators.
        </p>
      </CardHeader>
      <CardContent>
        {critiques.length > 0 ? (
          <div className="space-y-4">
            {critiques.map((critique) => (
              <CritiqueItem key={critique.id} critique={critique} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No critiques received yet.</p>
            <Button className="mt-4" asChild>
              <Link to="/find-adjudicator">Request Your First Critique</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MyCritiquesUpdated;