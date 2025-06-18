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
  idVerificationStatus: "pending" | "verified" | "rejected";
  applicationStatus: "pending" | "approved" | "rejected" | "trial";
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

export interface DanceStyle {
  id: number;
  name: string;
}

export interface Review {
  id: number;
  review: string;
  rating: number;
  created_at: string;
  client_name: string;
}

export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  issue_date: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: string;
  is_verified: boolean;
}

export interface AdjudicatorReview {
  id: number;
  review: string;
  rating: number;
  created_at: string;
  client: {
    id: string;
    full_name: string;
  };
}

export interface Adjudicator {
  id: string;
  name: string;
  email: string;
  experience: string;
  exp_years: number;
  ppc: number;
  turnaround_days: number;
  headshot: string;
  location: string;
  approved: boolean;
  created_at: string;
  user_id: string;
  // Calculated fields
  rating: number;
  review_count: number;
  // Related data
  user: User;
  dance_styles: DanceStyle[];
  reviews: AdjudicatorReview[];
  certificates: Certificate[];
}

export interface AdjudicatorsResponse {
  data: Adjudicator[];
  count: number;
}

export interface CritiqueAssignment {
  id: string;
  submissionId: string;
  adjudicatorId: string;
  status: "assigned" | "in_progress" | "completed" | "rejected";
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
