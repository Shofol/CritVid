/**
 * Types for drawing functionality
 */

export interface Point {
  x: number;
  y: number;
}

export interface DrawingPath {
  points: Point[];
  color: string;
  width: number;
  timestamp: number; // Timestamp when the drawing was created
  duration?: number; // Optional duration for how long the drawing should be visible
}

export interface TimestampedDrawing {
  paths: DrawingPath[];
}

export interface AudioMixSettings {
  videoVolume: number; // 0 to 1
  critiqueVolume: number; // 0 to 1
}

export interface VideoAction {
  type: 'play' | 'pause' | 'seek';
  timestamp: number; // When the action occurred during recording
  videoTime?: number; // For seek actions, the time in the video
}
