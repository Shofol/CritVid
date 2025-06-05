import { supabase } from './supabase';

export interface AdjudicatorReview {
  id: string;
  critique_id: string;
  client_id: string;
  adjudicator_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
}

export const reviewService = {
  async submitReview(critiqueId: string, adjudicatorId: string, rating: number, reviewText?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if user is a client
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData?.role !== 'client') {
      throw new Error('Only clients can submit reviews');
    }

    // Check for existing review
    const { data: existingReview } = await supabase
      .from('adjudicator_reviews')
      .select('id')
      .eq('critique_id', critiqueId)
      .eq('client_id', user.id)
      .single();

    if (existingReview) {
      throw new Error('Review already submitted for this critique');
    }

    // Insert review
    const { data, error } = await supabase
      .from('adjudicator_reviews')
      .insert({
        critique_id: critiqueId,
        client_id: user.id,
        adjudicator_id: adjudicatorId,
        rating,
        review_text: reviewText || null
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async getReviewsForAdjudicator(adjudicatorId: string) {
    const { data, error } = await supabase
      .from('adjudicator_reviews')
      .select('*')
      .eq('adjudicator_id', adjudicatorId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  },

  async checkReviewExists(critiqueId: string, clientId: string) {
    const { data, error } = await supabase
      .from('adjudicator_reviews')
      .select('id')
      .eq('critique_id', critiqueId)
      .eq('client_id', clientId)
      .single();

    return !!data && !error;
  }
};