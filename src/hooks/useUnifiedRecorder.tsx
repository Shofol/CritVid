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
        streamRef.current = null;
      }
      
      // Revoke audio URL
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);
  
  // Initialize the stream before starting recording
  const initializeStream = async (): Promise<MediaStream | null> => {
    try {
      // Clean up any previous stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      return stream;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Could not access microphone. Please check your browser permissions.');
      return null;
    }
  };
  
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
      saveVideoAction('current-video', action);
    };
    
    const handlePause = () => {
      const timestamp = Date.now() - startTimeRef.current;
      const action: VideoAction = {
        type: 'pause',
        timestamp,
        videoTime: video.currentTime
      };
      setVideoActions(prev => [...prev, action]);
      saveVideoAction('current-video', action);
    };
    
    const handleSeeked = () => {
      const timestamp = Date.now() - startTimeRef.current;
      const action: VideoAction = {
        type: 'seek',
        timestamp,
        videoTime: video.currentTime
      };
      setVideoActions(prev => [...prev, action]);
      saveVideoAction('current-video', action);
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
  
  const startRecording = useCallback(async (): Promise<void> => {
    if (!videoRef.current) {
      setError('Video reference is not available');
      return;
    }
    
    try {
      setError(null);
      setVideoActions([]);
      
      // Initialize a new stream each time
      const stream = await initializeStream();
      if (!stream) {
        throw new Error('Failed to access microphone');
      }
      
      console.log("Stream:", streamRef.current);
      
      // Create media recorder with explicit checking for undefined
      if (!streamRef.current) {
        throw new Error('Media stream is undefined');
      }
      
      // Initialize recorder with specific codec for better compatibility
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        // Create blob from chunks
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        
        // Create URL for the audio blob
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        setIsRecording(false);
      };
      
      // Start recording with timeslice to get data more frequently
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      
      // Start timer and set start time reference
      setRecordingTime(0);
      startTimeRef.current = Date.now();
      
      // Create and start interval timer immediately
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Start video playback and record initial play action
      try {
        await videoRef.current.play();
        // Record initial play action
        const initialAction: VideoAction = {
          type: 'play',
          timestamp: 0,
          videoTime: 0
        };
        setVideoActions([initialAction]);
        saveVideoAction('current-video', initialAction);
      } catch (playError) {
        console.error('Error playing video:', playError);
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Could not access microphone. Please check your browser permissions.');
    }
  }, [videoRef]);
  
  const stopRecording = useCallback((): void => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      // Stop the recorder
      mediaRecorderRef.current.stop();
      
      // Clear timer
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, []);
  
  const recordAction = useCallback((type: 'play' | 'pause' | 'seek', videoTime?: number): void => {
    if (!isRecording) return;
    
    const now = Date.now();
    const timestamp = now - startTimeRef.current;
    const currentVideoTime = videoTime !== undefined ? videoTime : 
                             (videoRef.current ? videoRef.current.currentTime : 0);
    
    const action: VideoAction = {
      type,
      timestamp,
      videoTime: currentVideoTime
    };
    
    setVideoActions(prev => [...prev, action]);
    saveVideoAction('current-video', action);
  }, [isRecording, videoRef]);
  
  const saveRecordingData = useCallback((videoId: string): void => {
    if (!audioBlob) {
      console.warn('No audio blob available to save');
      return;
    }
    
    try {
      // Convert blob to base64 for storage
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          // Store audio data
          localStorage.setItem(`audio_data_${videoId}`, reader.result as string);
          
          // Store video actions
          localStorage.setItem(`video_actions_${videoId}`, JSON.stringify(videoActions));
          
          // Store timestamp
          localStorage.setItem(`last_saved_${videoId}`, new Date().toISOString());
        } catch (storageError) {
          console.error('Error saving to localStorage:', storageError);
          setError('Failed to save recording data to storage');
        }
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Error in saveRecordingData:', error);
      setError('Failed to process recording data');
    }
  }, [audioBlob, videoActions]);
  
  const clearRecording = useCallback((): void => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setVideoActions([]);
    setRecordingTime(0);
    
    // Also clean up the stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, [audioUrl]);
  
  return {
    isRecording,
    recordingTime,
    audioBlob,
    audioUrl,
    videoActions,
    startRecording,
    stopRecording,
    recordAction,
    saveRecordingData,
    clearRecording,
    error
  };
};
