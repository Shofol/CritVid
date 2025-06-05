import { supabase } from './supabase';

export interface CritiquePaymentStatus {
  id: string;
  payment_status: 'pending_approval' | 'approved' | 'auto_approved' | 'disputed';
  payment_released_at?: string;
  auto_approved: boolean;
  finalized_at?: string;
  expected_release_date?: string;
  disputed: boolean;
  dispute_reason?: string;
}

export const paymentService = {
  async approveCritiquePayment(critiqueId: string, userId: string) {
    try {
      const response = await fetch(
        'https://tasowytszirhdvdiwuia.supabase.co/functions/v1/257c5f36-7642-47bb-960d-d30014eaf854',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabase.supabaseKey}`
          },
          body: JSON.stringify({ critiqueId, userId })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to approve payment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error approving payment:', error);
      throw error;
    }
  },

  async requestCritiqueRevision(critiqueId: string, userId: string, feedback: string) {
    try {
      // Mock implementation for revision request
      // In a real app, this would call a Supabase function
      const response = {
        success: true,
        message: 'Revision request submitted successfully'
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return response;
    } catch (error) {
      console.error('Error requesting revision:', error);
      throw error;
    }
  },

  async getCritiquePaymentStatus(critiqueId: string): Promise<CritiquePaymentStatus | null> {
    try {
      const { data, error } = await supabase
        .from('critiques')
        .select('id, payment_status, payment_released_at, auto_approved, finalized_at, expected_release_date, disputed, dispute_reason')
        .eq('id', critiqueId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching payment status:', error);
      return null;
    }
  },

  getExpectedReleaseDate(finalizedAt: string): Date {
    const finalizedDate = new Date(finalizedAt);
    const releaseDate = new Date(finalizedDate);
    releaseDate.setDate(releaseDate.getDate() + 7);
    return releaseDate;
  },

  formatPaymentStatus(status: string): string {
    switch (status) {
      case 'pending_approval':
        return 'Pending Client Approval';
      case 'approved':
        return 'Approved';
      case 'auto_approved':
        return 'Auto-Approved';
      case 'disputed':
        return 'Disputed';
      default:
        return 'Unknown';
    }
  }
};