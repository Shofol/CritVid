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

export interface PaymentWorkflowData {
  critiqueId: string;
  userId: string;
  adjudicatorId: string;
  amount: number;
  currency: string;
  status: CritiquePaymentStatus;
}