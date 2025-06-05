import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Review {
  id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  client_id: string;
}

interface AdjudicatorReviewListProps {
  adjudicatorId: string;
  showToClients?: boolean;
}

const AdjudicatorReviewList: React.FC<AdjudicatorReviewListProps> = ({
  adjudicatorId,
  showToClients = true
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('adjudicator_reviews')
          .select('*')
          .eq('adjudicator_id', adjudicatorId)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setReviews(data || []);
        setTotalReviews(data?.length || 0);
        
        if (data && data.length > 0) {
          const avg = data.reduce((sum, review) => sum + review.rating, 0) / data.length;
          setAverageRating(Math.round(avg * 10) / 10);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [adjudicatorId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!showToClients) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Reviews</span>
          {totalReviews > 0 && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {renderStars(Math.round(averageRating))}
                <span className="ml-2 text-sm font-medium">
                  {averageRating} ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
                </span>
              </div>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No reviews yet.
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Client Review
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {formatDate(review.created_at)}
                    </Badge>
                  </div>
                  {renderStars(review.rating)}
                </div>
                {review.review_text && (
                  <p className="text-sm text-gray-700 mt-2">
                    {review.review_text}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdjudicatorReviewList;