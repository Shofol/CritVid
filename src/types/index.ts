export interface VideoSubmission {
  id: string;
  title: string;
  dancerName: string;
  danceStyle: string;
  videoUrl: string;
  thumbnailUrl: string;
  uploadDate: string;
  status: 'pending' | 'reviewed' | 'critiqued';
  duration: number;
}

export interface CritiqueData {
  id: string;
  videoId: string;
  notes: string;
  timestamps: { time: number; note: string }[];
  audioRecordings?: Blob[];
  drawingData?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdjudicatorProfile {
  id: string;
  name: string;
  email: string;
  specialties: string[];
  bio: string;
  avatarUrl: string;
  status: 'active' | 'pending' | 'inactive';
  joinDate: string;
  completedCritiques: number;
}
