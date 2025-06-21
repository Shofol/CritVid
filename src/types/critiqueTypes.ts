/**
 * Types for the critique editor and player
 */

export interface VideoMetadata {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  duration?: number;
  mimeType?: string;
}

// export interface CritiqueData {
//   id: string;
//   videoId: string;
//   audioBlob?: Blob;
//   audioUrl?: string;
//   drawingData?: DrawingData;
//   videoActions?: VideoAction[];
//   transcript?: string;
//   exerciseSuggestions?: string[];
//   createdAt: string;
//   updatedAt: string;
//   status: "draft" | "completed" | "published";
// }

export type Critique = {
  id: string; // UUID
  created_at: string; // ISO timestamp
  user_id?: string | null; // UUID
  adjudicator_id?: string | null; // UUID
  video_id?: number | null; // bigint
  status?: "pending" | "under_review" | "completed";
  price?: number | null; // numeric
  completion_date?: string | null; // stored as text in DB
  review_id?: string | null; // UUID

  // Related data from joins
  user?: {
    id: string;
    email: string;
    full_name: string;
    avatar_url?: string;
    role: string;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
  };
  adjudicator?: {
    id: string;
    name: string;
    email: string;
    experience: string;
    exp_years: number;
    ppc: number;
    turnaround_days: number;
    headshot?: string;
    location: string;
    approved: boolean;
    created_at: string;
    user_id: string;
  };
  video?: {
    id: number;
    title: string;
    dance_style: number;
    feedback_requested: string;
    user_id: string;
    video_path?: string;
    file_name?: string;
    duration?: number;
    size?: number;
    created_at: string;
    dance_style_details?: {
      id: number;
      name: string;
    };
    dance_style_name?: string;
  };
  review?: {
    id: string;
    review: string;
    rating: number;
    created_at: string;
    client_id: string;
    client?: {
      id: string;
    };
  };

  // Computed fields for easier access
  title?: string;
  student?: string;
  requestedAt?: string;
  dueDate?: string;
};

export interface DrawingData {
  paths: DrawingPath[];
}

export interface DrawingPath {
  points: Point[];
  color: string;
  width: number;
  timestamp: number;
  duration?: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface VideoAction {
  type: "play" | "pause" | "seek";
  timestamp: number; // When the action occurred during recording
  videoTime?: number; // For seek actions, the time in the video
}

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  startTime: number | null;
  elapsedTime: number;
  audioBlob: Blob | null;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isPaused: boolean;
  isBuffering: boolean;
  isComplete: boolean;
}

export interface DrawAction {
  path: { x: number; y: number }[];
  timestamp: number;
  startTime: number;
  endTime: number;
  color: string;
  width: number;
  id?: string;
  isVisible?: boolean;
}

export interface TimelineEvent {
  type: "pause" | "resume" | "seek" | "play";
  timestamp: number;
  time: number;
  duration?: number;
  id?: string;
}
