import { useState, useRef, useCallback } from 'react';
import { RecordingState } from '@/types/critiqueTypes';

interface DualAudioRecorderOptions {
  mimeType?: string;
  audioBitsPerSecond?: number;
  onStart?: () => void;
  onStop?: (previewBlob: Blob, rawBlob: Blob) => void;
  onError?: (error: Error) => void;
}

export function useDualAudioRecorder(options: DualAudioRecorderOptions = {}) {
  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    startTime: null,
    elapsedTime: 0,
    audioBlob: null
  });

  const previewRecorderRef = useRef<MediaRecorder | null>(null);
  const rawRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const previewChunksRef = useRef<Blob[]>([]);
  const rawChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  
  const mimeType = options.mimeType || 'audio/webm';
  const audioBitsPerSecond = options.audioBitsPerSecond || 128000;

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    startTimeRef.current = Date.now() - state.elapsedTime;
    
    timerRef.current = window.setInterval(() => {
      if (startTimeRef.current) {
        const elapsedTime = Date.now() - startTimeRef.current;
        setState(prev => ({ ...prev, elapsedTime }));
      }
    }, 100) as unknown as number;
  }, [state.elapsedTime]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startRecording = async () => {
    try {
      if (!streamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
      }

      // Create two separate recorders from the same stream
      const previewRecorder = new MediaRecorder(streamRef.current!, { 
        mimeType, 
        audioBitsPerSecond 
      });
      const rawRecorder = new MediaRecorder(streamRef.current!, { 
        mimeType, 
        audioBitsPerSecond 
      });
      
      previewRecorderRef.current = previewRecorder;
      rawRecorderRef.current = rawRecorder;
      
      previewChunksRef.current = [];
      rawChunksRef.current = [];

      // Preview recorder (for muxing with video)
      previewRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          previewChunksRef.current.push(event.data);
        }
      };

      // Raw recorder (for AI transcription)
      rawRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          rawChunksRef.current.push(event.data);
        }
      };

      // Handle completion when both recorders stop
      let stoppedCount = 0;
      const handleRecorderStop = () => {
        stoppedCount++;
        if (stoppedCount === 2) {
          const previewBlob = new Blob(previewChunksRef.current, { type: mimeType });
          const rawBlob = new Blob(rawChunksRef.current, { type: mimeType });
          
          setState(prev => ({
            ...prev,
            audioBlob: previewBlob,
            isRecording: false
          }));
          
          options.onStop?.(previewBlob, rawBlob);
        }
      };

      previewRecorder.onstop = handleRecorderStop;
      rawRecorder.onstop = handleRecorderStop;

      // Start both recorders
      previewRecorder.start(100);
      rawRecorder.start(100);
      
      setState(prev => ({ ...prev, isRecording: true }));
      startTimer();
      options.onStart?.();

    } catch (error) {
      console.error('Dual recording error:', error);
      options.onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const stopRecording = async () => {
    if (previewRecorderRef.current && rawRecorderRef.current && state.isRecording) {
      try {
        previewRecorderRef.current.stop();
        rawRecorderRef.current.stop();
        stopTimer();
        
        return new Promise<{ preview: Blob | null; raw: Blob | null }>((resolve) => {
          setTimeout(() => {
            const previewBlob = new Blob(previewChunksRef.current, { type: mimeType });
            const rawBlob = new Blob(rawChunksRef.current, { type: mimeType });
            resolve({ preview: previewBlob, raw: rawBlob });
          }, 300);
        });
      } catch (error) {
        console.error('Error stopping dual recording:', error);
        options.onError?.(error instanceof Error ? error : new Error(String(error)));
        return { preview: null, raw: null };
      }
    }
    return { preview: null, raw: null };
  };

  const clearRecording = () => {
    if (state.isRecording) {
      console.warn('Cannot clear recording while recording is in progress');
      return;
    }
    
    setState({
      isRecording: false,
      isPaused: false,
      startTime: null,
      elapsedTime: 0,
      audioBlob: null
    });
    
    previewChunksRef.current = [];
    rawChunksRef.current = [];
    startTimeRef.current = null;
    
    if (!state.isRecording && streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  return {
    startRecording,
    stopRecording,
    clearRecording,
    state
  };
}