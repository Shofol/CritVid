import { User, PaymentRecord, ActivityRecord, FlaggedReport } from '@/types/user';

// Mock payment records
const generatePaymentHistory = (userId: string, isAdjudicator: boolean): PaymentRecord[] => {
  const records: PaymentRecord[] = [];
  
  // Add purchase records for clients
  if (!isAdjudicator) {
    records.push(
      {
        id: `pay-${userId}-1`,
        date: '2023-11-15',
        amount: 49.99,
        type: 'purchase',
        status: 'completed',
        description: 'Critique package purchase'
      },
      {
        id: `pay-${userId}-2`,
        date: '2023-12-05',
        amount: 29.99,
        type: 'purchase',
        status: 'completed',
        description: 'Single critique purchase'
      }
    );
  }
  
  // Add payout records for adjudicators
  if (isAdjudicator) {
    records.push(
      {
        id: `pay-${userId}-1`,
        date: '2023-11-20',
        amount: 120.00,
        type: 'payout',
        status: 'completed',
        description: 'Monthly payout - November'
      },
      {
        id: `pay-${userId}-2`,
        date: '2023-12-20',
        amount: 85.50,
        type: 'payout',
        status: 'pending',
        description: 'Monthly payout - December'
      }
    );
  }
  
  return records;
};

// Mock activity records
const generateActivityRecords = (userId: string, isAdjudicator: boolean): {
  videoUploads: ActivityRecord[],
  critiquesCompleted: ActivityRecord[]
} => {
  const videoUploads: ActivityRecord[] = [];
  const critiquesCompleted: ActivityRecord[] = [];
  
  if (!isAdjudicator) {
    videoUploads.push(
      {
        id: `vid-${userId}-1`,
        date: '2023-11-10',
        title: 'Contemporary Solo Performance',
        status: 'Completed',
        details: 'Critique received on Nov 15'
      },
      {
        id: `vid-${userId}-2`,
        date: '2023-12-01',
        title: 'Ballet Technique Practice',
        status: 'In Review',
        details: 'Assigned to adjudicator'
      }
    );
  }
  
  if (isAdjudicator) {
    critiquesCompleted.push(
      {
        id: `crit-${userId}-1`,
        date: '2023-11-12',
        title: 'Critique for Emma J. - Jazz Solo',
        status: 'Completed',
        details: '4.8/5 rating received'
      },
      {
        id: `crit-${userId}-2`,
        date: '2023-11-25',
        title: 'Critique for Michael C. - Contemporary',
        status: 'Completed',
        details: '5/5 rating received'
      },
      {
        id: `crit-${userId}-3`,
        date: '2023-12-05',
        title: 'Critique for David R. - Ballet',
        status: 'In Progress',
        details: 'Due by Dec 10'
      }
    );
  }
  
  return { videoUploads, critiquesCompleted };
};

// Extended mock user data with detailed information
export const mockUserData: User[] = [
  {
    id: '1',
    name: 'Emma Johnson',
    email: 'emma.j@example.com',
    role: 'user',
    status: 'active',
    dateJoined: '2023-03-10',
    videosUploaded: 12,
    critiquesReceived: 8,
    permissions: {
      receiveCritiques: true,
      accessAdmin: false
    },
    payment: {
      history: generatePaymentHistory('1', false),
      accountCredit: 25.00
    },
    activity: {
      videoUploads: generateActivityRecords('1', false).videoUploads,
      critiquesCompleted: [],
      flaggedReports: [],
      critiquesCount: 8
    }
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.c@example.com',
    role: 'user',
    status: 'active',
    dateJoined: '2023-04-15',
    videosUploaded: 5,
    critiquesReceived: 3,
    permissions: {
      receiveCritiques: true,
      accessAdmin: false
    },
    payment: {
      history: generatePaymentHistory('2', false),
      accountCredit: 0
    },
    activity: {
      videoUploads: generateActivityRecords('2', false).videoUploads,
      critiquesCompleted: [],
      flaggedReports: [],
      critiquesCount: 3
    }
  },
  {
    id: '3',
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    role: 'adjudicator',
    status: 'active',
    dateJoined: '2023-02-22',
    videosUploaded: 0,
    critiquesReceived: 0,
    permissions: {
      giveCritiques: true,
      accessAdmin: false
    },
    payment: {
      history: generatePaymentHistory('3', true),
      accountCredit: 0,
      payoutSplit: 65,
      payoutStatus: 'active'
    },
    activity: {
      videoUploads: [],
      critiquesCompleted: generateActivityRecords('3', true).critiquesCompleted,
      flaggedReports: [],
      critiquesCount: 15
    }
  },
  {
    id: '4',
    name: 'David Rodriguez',
    email: 'david.r@example.com',
    role: 'user',
    status: 'suspended',
    dateJoined: '2023-05-05',
    videosUploaded: 2,
    critiquesReceived: 1,
    permissions: {
      receiveCritiques: false,
      accessAdmin: false
    },
    payment: {
      history: generatePaymentHistory('4', false),
      accountCredit: 10.00
    },
    activity: {
      videoUploads: generateActivityRecords('4', false).videoUploads,
      critiquesCompleted: [],
      flaggedReports: [
        {
          id: 'flag-1',
          date: '2023-06-10',
          reason: 'Inappropriate content in video',
          status: 'resolved',
          reportedBy: 'System'
        }
      ],
      critiquesCount: 1
    }
  },
];
