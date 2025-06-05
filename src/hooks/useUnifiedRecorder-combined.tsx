import { useState, useRef, useEffect, useCallback } from 'react';
import { VideoAction } from '@/types/timelineTypes';
import { saveVideoAction } from '@/lib/playbackSynchronizer';

interface UnifiedRecorderState {
  isRecording: boolean;
  recordingTime: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  videoActions: VideoAction[];
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  recordAction: (type: 'play' | 'pause' | 'seek', videoTime?: number) => void;
  saveRecordingData: (videoId: string) => void;
  clearRecording: () => void;
  error: string | null;
}

export const useUnifiedRecorder = (videoRef: React.RefObject<HTMLVideoElement>): UnifiedRecorderState => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [videoActions, setVideoActions] = useState<VideoAction[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Clear timer
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      
      // Stop media recorder
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      
      // Stop audio stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Revoke audio URL
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);
  
  // Set up video event listeners during recording
  useEffect(() => {
    if (!videoRef.current || !isRecording) return;
    
    const video = videoRef.current;
    
    // Directly attach event handlers to the video element
    const handlePlay = () => {
      const timestamp = Date.now() - startTimeRef.current;
      const action: VideoAction = {
        type: 'play',
        timestamp,
        videoTime: video.currentTime
      };
      setVideoActions(prev => [...prev, action]);
      console.log(`Recorded play at ${timestamp}ms, video time: ${video.currentTime}s`);
      
      // Save immediately to localStorage
      try {
        saveVideoAction('current-video', action);
        // Also save to the actual videoId if we can extract it from the src
        if (video.src) {
          const urlParts = video.src.split('/');
          const filename = urlParts[urlParts.length - 1];
          const simpleVideoId = filename.split('.')[0];
          if (simpleVideoId) {
            saveVideoAction(simpleVideoId, action);
          }
        }
      } catch (e) {
        console.error('Failed to save video play action:', e);
      }
    };
    
    const handlePause = () => {
      const timestamp = Date.now() - startTimeRef.current;
      const action: VideoAction = {
        type: 'pause',
        timestamp,
        videoTime: video.currentTime
      };
      setVideoActions(prev => [...prev, action]);
      console.log(`Recorded pause at ${timestamp}ms, video time: ${video.currentTime}s`);
      
      // Save immediately to localStorage
      try {
        saveVideoAction('current-video', action);
        // Also save to the actual videoId if we can extract it from the src
        if (video.src) {
          const urlParts = video.src.split('/');
          const filename = urlParts[urlParts.length - 1];
          const simpleVideoId = filename.split('.')[0];
          if (simpleVideoId) {
            saveVideoAction(simpleVideoId, action);
          }
        }
      } catch (e) {
        console.error('Failed to save video pause action:', e);
      }
    };
    
    const handleSeeked = () => {
      const timestamp = Date.now() - startTimeRef.current;
      const action: VideoAction = {
        type: 'seek',
        timestamp,
        videoTime: video.currentTime
      };
      setVideoActions(prev => [...prev, action]);
      console.log(`Recorded seek at ${timestamp}ms, video time: ${video.currentTime}s`);
      
      // Save immediately to localStorage
      try {
        saveVideoAction('current-video', action);
        // Also save to the actual videoId if we can extract it from the src
        if (video.src) {
          const urlParts = video.src.split('/');
          const filename = urlParts[urlParts.length - 1];
          const simpleVideoId = filename.split('.')[0];
          if (simpleVideoId) {
            saveVideoAction(simpleVideoId, action);
          }
        }
      } catch (e) {
        console.error('Failed to save video seek action:', e);
      }
    };
    
    // Use addEventListener instead of direct property assignment
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('seeked', handleSeeked);
    
    return () => {
      // Clean up event handlers
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, [videoRef, isRecording]);