/**
 * Types for the Critique Studio feature
 */

// Drawing stroke type
export interface DrawingStroke {
  points: { x: number; y: number }[];
  color: string;
  width: number;
  timestamp: number; // When the stroke started
  duration: number; // How long to display the stroke
}

// Timeline action type
export interface TimelineAction {
  type: 'play' | 'pause' | 'seek';
  timestamp: number;
  seekTo?: number; // For seek actions
}

// Complete critique data
export interface CritiqueData {
  videoId: string;
  audioBlob?: Blob;
  audioUrl?: string;
  drawings: DrawingStroke[];
  timelineActions: TimelineAction[];
  duration: number;
  createdAt: number;
}

// Video player state
export interface VideoPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  error: string | null;
}

// Recording state
export interface RecordingState {
  isRecording: boolean;
  startTime: number | null;
  duration: number;
  audioBlob: Blob | null;
}

// Drawing state
export interface DrawingState {
  isDrawMode: boolean;
  currentColor: string;
  strokeWidth: number;
  strokes: DrawingStroke[];
}
