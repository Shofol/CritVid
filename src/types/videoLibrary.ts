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
