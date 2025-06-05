import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Star, Users, TrendingUp } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { AdjudicatorReviewList } from '@/components/adjudicator/AdjudicatorReviewList';

const Reviews: React.FC = () => {
  const navigate = useNavigate();

  // Mock data for featured reviews
  const featuredReviews = [
    {
      id: '1',
      adjudicatorName: 'Sarah Johnson',
      rating: 5,
      reviewText: 'Absolutely fantastic feedback! Sarah provided detailed insights that really helped improve my technique.',
      clientName: 'Emma D.',
      date: '2 days ago'
    },
    {
      id: '2', 
      adjudicatorName: 'Michael Chen',
      rating: 5,
      reviewText: 'Professional, thorough, and encouraging. The critique was exactly what I needed.',
      clientName: 'David R.',
      date: '1 week ago'
    },
    {
      id: '3',
      adjudicatorName: 'Maria Lopez',
      rating: 4,
      reviewText: 'Great attention to detail and constructive feedback. Very helpful for my ballet training.',
      clientName: 'Sophie M.',
      date: '2 weeks ago'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Reviews & Ratings</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what our clients say about their experience with our adjudicators
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Star className="w-8 h-8 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">4.8</div>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="w-8 h-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-sm text-muted-foreground">Total Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">96%</div>
                  <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Featured Reviews</CardTitle>
            <CardDescription>
              Recent reviews from our satisfied clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {featuredReviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{review.adjudicatorName}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-muted-foreground">by {review.clientName}</span>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>
                  <p className="text-muted-foreground">{review.reviewText}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">Ready to Get Your Dance Critique?</h3>
              <p className="text-muted-foreground">
                Join thousands of dancers who have improved their skills with professional feedback
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/find-adjudicator')}>
                  Find an Adjudicator
                </Button>
                <Button variant="outline" onClick={() => navigate('/upload-video')}>
                  Upload Your Video
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Reviews;