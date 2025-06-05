// Types for the adjudicator flow

export interface AdjudicatorApplication {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  credentials: string;
  danceStyles: string[];
  price: number;
  expectedTurnaround: number;
  idVerificationStatus: 'pending' | 'verified' | 'rejected';
  applicationStatus: 'pending' | 'approved' | 'rejected' | 'trial';
  createdAt: string;
  updatedAt: string;
}

export interface AdjudicatorProfile {
  id: string;
  userId: string;
  fullName: string;
  credentials: string;
  danceStyles: string[];
  price: number;
  expectedTurnaround: number;
  rating: number;
  totalCritiques: number;
  totalEarnings: number;
  createdAt: string;
  updatedAt: string;
  biography?: string;
  headshotUrl?: string;
  yearsExperience?: string;
  accreditations?: string[];
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    website?: string;
    [key: string]: string | undefined;
  };
  lastUpdated?: string;
}

export interface Adjudicator {
  id: string;
  name: string;
  bio: string;
  specialties: string[];
  rating: number;
  price: number;
  turnaroundTime: number;
  totalCritiques: number;
  profileImage?: string;
  avatar?: string;
  location?: string;
  experience?: number;
  rate?: number;
  reviewCount?: number;
}

export interface CritiqueAssignment {
  id: string;
  submissionId: string;
  adjudicatorId: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface CritiqueFeedback {
  id: string;
  critiqueId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface AdjudicatorStats {
  totalCritiques: number;
  totalEarnings: number;
  averageRating: number;
  pendingCritiques: number;
}