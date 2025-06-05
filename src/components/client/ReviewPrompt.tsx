import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare } from 'lucide-react';
import AdjudicatorReviewForm from '@/components/adjudicator/AdjudicatorReviewForm';
import { supabase } from '@/lib/supabase';

interface ReviewPromptProps {
  critiqueId: string;
  adjudicatorId: string;
  adjudicatorName: string;
  clientId: string;
}

const ReviewPrompt: React.FC<ReviewPromptProps> = ({
  critiqueId,
  adjudicatorId,
  adjudicatorName,
  clientId
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkExistingReview();
  }, [critiqueId, clientId]);

  const checkExistingReview = async () => {
    try {
      const { data, error } = await supabase
        .from('adjudicator_reviews')
        .select('id')
        .eq('critique_id', critiqueId)
        .eq('client_id', clientId)
        .single();

      if (data) {
        setHasReviewed(true);
      }
    } catch (error) {
      // No existing review found, which is fine
      setHasReviewed(false);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = () => {
    setHasReviewed(true);
    setShowReviewForm(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse h-16 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (hasReviewed) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <Star className="h-5 w-5 text-green-600 fill-current" />
            </div>
            <div>
              <p className="font-medium text-green-800">
                Thank you for your review!
              </p>
              <p className="text-sm text-green-600">
                Your feedback helps other clients choose the right adjudicator.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showReviewForm) {
    return (
      <AdjudicatorReviewForm
        adjudicatorId={adjudicatorId}
        critiqueId={critiqueId}
        clientId={clientId}
        onReviewSubmitted={handleReviewSubmitted}
        onCancel={() => setShowReviewForm(false)}
      />
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          How was your experience?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-blue-700">
            Help other clients by sharing your experience with <strong>{adjudicatorName}</strong>.
            Your review will help them choose the right adjudicator for their needs.
          </p>
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowReviewForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Star className="h-4 w-4 mr-2" />
              Leave a Review
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setHasReviewed(true)}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewPrompt;