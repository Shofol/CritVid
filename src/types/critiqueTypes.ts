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

export interface CritiqueData {
  id: string;
  videoId: string;
  audioBlob?: Blob;
  audioUrl?: string;
  drawingData?: DrawingData;
  videoActions?: VideoAction[];
  transcript?: string;
  exerciseSuggestions?: string[];
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'completed' | 'published';
}

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
  type: 'play' | 'pause' | 'seek';
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
