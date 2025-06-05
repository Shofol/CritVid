/**
 * Types for video timeline actions and synchronization
 */

export interface VideoAction {
  type: 'play' | 'pause' | 'seek';
  timestamp: number; // When the action occurred during recording
  videoTime?: number; // For seek actions, the time in the video
}

export interface TimelineActionMap {
  [timestamp: number]: VideoAction;
}

export interface SynchronizedPlaybackOptions {
  videoElement: HTMLVideoElement;
  audioElement?: HTMLAudioElement;
  actions: VideoAction[];
  onComplete?: () => void;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isPaused: boolean;
  isBuffering: boolean;
  isComplete: boolean;
}
