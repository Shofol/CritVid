export interface VideoSubmissionExtended {
  id: string;
  dancerId: string;
  title: string;
  danceStyle: string;
  videoUrl: string;
  thumbnailUrl?: string;
  feedbackRequested: string;
  status: 'pending' | 'assigned' | 'completed';
  createdAt: string;
  isTestVideo?: boolean; // Flag to identify test videos
}

export interface VideoFilter {
  style?: string;
  status?: 'pending' | 'assigned' | 'completed' | 'all';
  searchQuery?: string;
  sortBy?: 'date' | 'title' | 'style';
  sortOrder?: 'asc' | 'desc';
}

export type DanceStyle = 'Ballet' | 'Contemporary' | 'Jazz' | 'Hip Hop' | 'Breaking' | 'Tap' | 'Lyrical' | 'Modern' | 'All';

export const danceStyles: DanceStyle[] = [
  'All',
  'Ballet',
  'Contemporary',
  'Jazz',
  'Hip Hop',
  'Breaking',
  'Tap',
  'Lyrical',
  'Modern'
];
