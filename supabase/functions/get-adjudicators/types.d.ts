export interface DanceStyle {
  id: number;
  name: string;
}

export interface AdjudicatorCertificate {
  id: number;
  title: string;
  issuer: string;
  issue_date: string;
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

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: string;
  is_verified: boolean;
}

export interface AdjudicatorProfile {
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
  rating: number;
  review_count: number;
  user: User;
  dance_styles: DanceStyle[];
  reviews: AdjudicatorReview[];
  certificates: AdjudicatorCertificate[];
}

export interface GetAdjudicatorsResponse {
  data: AdjudicatorProfile[];
  count: number;
}
