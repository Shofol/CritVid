/**
 * Types for Mux video integration
 */

export interface MuxUploadResponse {
  uploadUrl: string;
  uploadId: string;
}

export interface MuxAssetStatus {
  status: string;
  playbackIds?: Array<{ id: string; policy: string }>;
  ready: boolean;
  duration?: number;
  aspectRatio?: string;
  error?: string;
}

export interface MuxPlaybackUrls {
  playbackId: string;
  hlsUrl: string;
  mp4Url: string;
  thumbnailUrl: string;
  status: string;
  duration?: number;
  aspectRatio?: string;
}

export interface VideoUploadState {
  isUploading: boolean;
  progress: number;
  uploadId?: string;
  assetId?: string;
  error?: string;
  playbackUrl?: string;
}

export interface VideoTimestamp {
  time: number;
  isPaused: boolean;
}

export interface SyncedCritiqueData {
  videoTimestamps: VideoTimestamp[];
  drawingData: string | null;
  audioUrl: string | null;
}
