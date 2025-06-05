export interface AdjudicatorAdminProfile extends AdjudicatorProfile {
  email: string;
  bio: string;
  accountStatus: 'active' | 'suspended' | 'archived';
  permissions: {
    availableForCritiques: boolean;
    publiclyVisible: boolean;
    canUseAdvancedTools: boolean;
  };
  financial: {
    paymentSplitPercentage: number; // percentage the adjudicator receives
    totalEarnings: number;
    payoutStatus: 'active' | 'paused' | 'hold';
    payoutSchedule: string;
  };
  performance: {
    critiquesCompleted: number;
    averageRating: number;
    internalNotes: string;
    lastActive: string;
    pendingCritiques: number;
  };
  tags: string[];
  notificationsEnabled: boolean;
}

export interface AdjudicatorPaymentRecord {
  id: string;
  date: string;
  amount: number;
  type: 'payout' | 'refund' | 'bonus';
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

export interface AdjudicatorCritique {
  id: string;
  videoTitle: string;
  clientName: string;
  dateAssigned: string;
  dateCompleted?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'refunded';
  earnings: number;
}

import { AdjudicatorProfile } from './adjudicator';
