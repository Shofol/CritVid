export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'adjudicator' | 'admin';
  status: 'active' | 'suspended' | 'deleted';
  dateJoined: string;
  videosUploaded: number;
  critiquesReceived: number;
  permissions?: {
    receiveCritiques?: boolean;
    giveCritiques?: boolean;
    accessAdmin?: boolean;
  };
  payment?: {
    history: PaymentRecord[];
    accountCredit: number;
    payoutSplit?: number; // percentage for adjudicator
    payoutStatus?: 'active' | 'paused';
  };
  activity?: {
    videoUploads: ActivityRecord[];
    critiquesCompleted: ActivityRecord[];
    flaggedReports: FlaggedReport[];
    critiquesCount: number;
  };
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  type: 'purchase' | 'refund' | 'payout' | 'credit';
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

export interface ActivityRecord {
  id: string;
  date: string;
  title: string;
  status: string;
  details?: string;
}

export interface FlaggedReport {
  id: string;
  date: string;
  reason: string;
  status: 'open' | 'resolved' | 'dismissed';
  reportedBy: string;
}
