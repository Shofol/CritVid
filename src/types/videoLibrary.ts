export interface VideoSubmissionExtended {
  id: string;
  dancerId: string;
  title: string;
  danceStyle: string;
  videoUrl: string;
  thumbnailUrl?: string;
  feedbackRequested: string;
  status: "pending" | "assigned" | "completed";
  createdAt: string;
  isTestVideo?: boolean; // Flag to identify test videos
}

export type Video = {
  id: number;
  created_at: string; // ISO 8601 timestamp
  title: string;
  dance_style: number; // references dance_styles.id
  feedback_requested: string;
  user_id: string; // UUID format
  video_path?: string | null;
  file_name?: string | null;
  duration?: number | null; // in seconds or milliseconds, depending on how it's stored
  size?: number | null; // typically in bytes
};

export interface VideoFilter {
  style?: string;
  status?: "pending" | "assigned" | "completed" | "all";
  searchQuery?: string;
  sortBy?: "date" | "title" | "style";
  sortOrder?: "asc" | "desc";
}

export type DanceStyle = {
  id: number;
  name: string;
};
