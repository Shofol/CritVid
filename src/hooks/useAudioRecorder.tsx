import { useState, useRef, useEffect, useCallback } from 'react';
import { RecordingState } from '@/types/critiqueTypes';

interface AudioRecorderOptions {
  mimeType?: string;
  audioBitsPerSecond?: number;
  onStart?: () => void;
  onStop?: (blob: Blob) => void;
  onPause?: () => void;
  onResume?: () => void;
  onError?: (error: Error) => void;
}

export function useAudioRecorder(options: AudioRecorderOptions = {}) {
  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    startTime: null,
    elapsedTime: 0,
    audioBlob: null
  });

  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const recordingPromiseRef = useRef<{ resolve: (blob: Blob | null) => void; reject: (error: Error) => void } | null>(null);
  
  const mimeType = options.mimeType || 'audio/webm';
  const audioBitsPerSecond = options.audioBitsPerSecond || 128000;

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && state.isRecording) {
        try {
          mediaRecorderRef.current.stop();
        } catch (e) {
          console.error("Error stopping MediaRecorder on unmount:", e);
        }
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state.isRecording]);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    startTimeRef.current = Date.now() - state.elapsedTime;
    
    timerRef.current = window.setInterval(() => {
      if (startTimeRef.current) {
        const elapsedTime = Date.now() - startTimeRef.current;
        setState(prev => ({
          ...prev,
          elapsedTime
        }));
      }
    }, 100) as unknown as number;
  }, [state.elapsedTime]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      console.log('🎤 Starting audio recording...');
      
      // Clear any previous chunks
      chunksRef.current = [];
      
      // Request microphone permissions with better constraints
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1
        } 
      });
      
      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      streamRef.current = stream;

      // Test audio levels to ensure microphone is working
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      source.connect(analyser);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      const hasAudio = dataArray.some(value => value > 0);
      
      if (!hasAudio) {
        console.warn('⚠️ No audio input detected');
      }
      
      audioContext.close();

      // Determine best supported MIME type
      let finalMimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(finalMimeType)) {
        finalMimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(finalMimeType)) {
          finalMimeType = 'audio/mp4';
          if (!MediaRecorder.isTypeSupported(finalMimeType)) {
            finalMimeType = '';
          }
        }
      }

      const recorder = new MediaRecorder(stream, { 
        mimeType: finalMimeType || undefined,
        audioBitsPerSecond 
      }); 
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
          console.log("📊 Audio chunk:", event.data.size, "bytes, total chunks:", chunksRef.current.length);
        } else {
          console.warn("⚠️ Empty audio chunk received");
        }
      };

      recorder.onstop = () => {
        console.log('🛑 Recording stopped, chunks:', chunksRef.current.length);
        
        if (chunksRef.current.length === 0) {
          console.error("❌ No audio chunks recorded");
          const error = new Error("No audio data captured. Check microphone permissions and ensure microphone is not muted.");
          
          if (recordingPromiseRef.current) {
            recordingPromiseRef.current.reject(error);
            recordingPromiseRef.current = null;
          }
          
          if (options.onError) options.onError(error);
          return;
        }
        
        const audioBlob = new Blob(chunksRef.current, { type: finalMimeType || 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        console.log("✅ Audio blob created:", audioBlob.size, "bytes");
        
        setState((prev) => ({
          ...prev,
          audioBlob,
          isRecording: false,
        }));
        
        setRecordedAudioUrl(audioUrl);
        
        if (recordingPromiseRef.current) {
          recordingPromiseRef.current.resolve(audioBlob);
          recordingPromiseRef.current = null;
        }
        
        if (options.onStop) options.onStop(audioBlob);
      };

      recorder.onerror = (event) => {
        console.error('❌ MediaRecorder error:', event);
        const error = new Error('MediaRecorder error occurred');
        
        if (recordingPromiseRef.current) {
          recordingPromiseRef.current.reject(error);
          recordingPromiseRef.current = null;
        }
        
        if (options.onError) options.onError(error);
      };

      // Start with more frequent data collection
      recorder.start(250); // 250ms intervals for better chunk capture
      setState((prev) => ({ ...prev, isRecording: true, startTime: Date.now() }));
      startTimer();
      
      if (options.onStart) options.onStart();
      console.log('✅ Recording started with MIME type:', finalMimeType);

    } catch (error) {
      console.error("❌ Recording error:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      const finalError = new Error(`Failed to start recording: ${errorMessage}`);
      
      if (options.onError) options.onError(finalError);
      throw finalError;
    }
  }, [mimeType, audioBitsPerSecond, options, startTimer]);
  
  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    if (!mediaRecorderRef.current || !state.isRecording) {
      console.warn('⚠️ No active recording to stop');
      return null;
    }

    return new Promise((resolve, reject) => {
      recordingPromiseRef.current = { resolve, reject };
      
      try {
        console.log('🛑 Stopping recording, current chunks:', chunksRef.current.length);
        
        // Force final data collection
        if (mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.requestData();
          
          // Delay to ensure final chunk is captured
          setTimeout(() => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
              mediaRecorderRef.current.stop();
            }
          }, 300); // Increased delay
        }
        
        stopTimer();
        
        // Timeout fallback
        setTimeout(() => {
          if (recordingPromiseRef.current) {
            console.warn('⚠️ Stop timeout, resolving with current state');
            recordingPromiseRef.current.resolve(state.audioBlob);
            recordingPromiseRef.current = null;
          }
        }, 5000); // Increased timeout
        
      } catch (error) {
        console.error('❌ Error stopping recording:', error);
        recordingPromiseRef.current = null;
        const err = error instanceof Error ? error : new Error(String(error));
        
        if (options.onError) options.onError(err);
        reject(err);
      }
    });
  }, [state.isRecording, state.audioBlob, stopTimer, options]);
  
  const clearRecording = useCallback(() => {
    if (state.isRecording) {
      console.warn("⚠️ Cannot clear recording while recording is in progress");
      return;
    }
    
    console.log('🧹 Clearing recording data...');
    setState({
      isRecording: false,
      isPaused: false,
      startTime: null,
      elapsedTime: 0,
      audioBlob: null
    });
    
    setRecordedAudioUrl(null);
    chunksRef.current = [];
    startTimeRef.current = null;
    
    if (!state.isRecording && streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, [state.isRecording]);

  return {
    isRecording: state.isRecording,
    recordedAudioUrl,
    startRecording,
    stopRecording,
    clearRecording,
    state
  };
}