import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ReviewPermissions {
  canReview: boolean;
  hasReviewed: boolean;
  userRole: string | null;
  loading: boolean;
}

export const useReviewPermissions = (critiqueId: string, adjudicatorId: string): ReviewPermissions => {
  const [permissions, setPermissions] = useState<ReviewPermissions>({
    canReview: false,
    hasReviewed: false,
    userRole: null,
    loading: true
  });

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setPermissions({
            canReview: false,
            hasReviewed: false,
            userRole: null,
            loading: false
          });
          return;
        }

        // Get user role
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        const userRole = userData?.role || null;

        // Only clients can review
        if (userRole !== 'client') {
          setPermissions({
            canReview: false,
            hasReviewed: false,
            userRole,
            loading: false
          });
          return;
        }

        // Check if user has already reviewed this critique
        const { data: existingReview } = await supabase
          .from('adjudicator_reviews')
          .select('id')
          .eq('critique_id', critiqueId)
          .eq('client_id', user.id)
          .single();

        const hasReviewed = !!existingReview;

        setPermissions({
          canReview: !hasReviewed,
          hasReviewed,
          userRole,
          loading: false
        });
      } catch (error) {
        console.error('Error checking review permissions:', error);
        setPermissions({
          canReview: false,
          hasReviewed: false,
          userRole: null,
          loading: false
        });
      }
    };

    if (critiqueId && adjudicatorId) {
      checkPermissions();
    }
  }, [critiqueId, adjudicatorId]);

  return permissions;
};