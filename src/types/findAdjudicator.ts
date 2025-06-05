export interface Adjudicator {
  id: string;
  userId: string;
  name: string;
  profileImage: string;
  credentials: string;
  danceStyles: string[];
  price: number;
  averageTurnaround: number;
  rating: number;
  totalCritiques?: number;
  bio?: string;
  availability?: string;
}

export interface AdjudicatorFilter {
  danceStyles: string[];
  priceRange: [number, number];
  rating: number;
  availability?: string;
}
