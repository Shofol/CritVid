import { useState, useRef, useCallback } from 'react';

interface AudioRecorderOptions {
  onError?: (error: Error) => void;
}

export function useAudioRecorderBasic(options: AudioRecorderOptions = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const requestMicrophonePermission = useCallback(async () => {
    try {
      console.log('🎤 Requesting microphone permission...');
      setErrorMessage(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      // Test audio levels
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      source.connect(analyser);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      
      audioContext.close();
      
      // Stop test stream
      stream.getTracks().forEach(track => track.stop());
      
      setPermissionStatus('granted');
      console.log('✅ Microphone permission granted');
      return true;
      
    } catch (error) {
      console.error('❌ Microphone permission denied:', error);
      setPermissionStatus('denied');
      
      const errorMsg = error instanceof Error && error.name === 'NotAllowedError' 
        ? '🎤 Microphone access blocked — please enable permissions in your browser.'
        : 'Failed to access microphone. Please check your browser settings.';
      
      setErrorMessage(errorMsg);
      if (options.onError) options.onError(new Error(errorMsg));
      return false;
    }
  }, [options]);

  const startRecording = useCallback(async () => {
    if (isRecording) {
      console.warn('⚠️ Already recording');
      return;
    }
    
    try {
      console.log('🎤 Starting audio recording...');
      setErrorMessage(null);
      chunksRef.current = [];
      
      // Get fresh stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      
      // Determine MIME type
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4';
        }
      }
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      
      // Set up event listeners BEFORE starting
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
          console.log('📊 Audio chunk received:', event.data.size, 'bytes, total:', chunksRef.current.length);
        } else {
          console.warn('⚠️ Empty audio chunk');
        }
      };
      
      mediaRecorder.onstop = () => {
        console.log('🛑 Recording stopped, processing', chunksRef.current.length, 'chunks');
        
        if (chunksRef.current.length === 0) {
          const error = new Error('No audio data captured. Check microphone permissions.');
          setErrorMessage(error.message);
          if (options.onError) options.onError(error);
          return;
        }
        
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setRecordedAudioUrl(audioUrl);
        console.log('✅ Audio recording completed:', audioBlob.size, 'bytes');
      };
      
      mediaRecorder.onerror = (event) => {
        console.error('❌ MediaRecorder error:', event);
        const error = new Error('Recording failed');
        setErrorMessage(error.message);
        if (options.onError) options.onError(error);
      };
      
      // Start recording with timeslice for regular data flushing
      mediaRecorder.start(100);
      setIsRecording(true);
      console.log('✅ Recording started with MIME type:', mimeType);
      
    } catch (error) {
      console.error('❌ Failed to start recording:', error);
      const errorMsg = error instanceof Error && error.name === 'NotAllowedError'
        ? '🎤 Microphone access blocked — please enable permissions in your browser.'
        : 'Failed to start recording. Please check microphone permissions.';
      
      setErrorMessage(errorMsg);
      if (options.onError) options.onError(new Error(errorMsg));
    }
  }, [isRecording, options]);
  
  const stopRecording = useCallback(async () => {
    if (!isRecording || !mediaRecorderRef.current) {
      console.warn('⚠️ No active recording to stop');
      return;
    }
    
    try {
      console.log('🛑 Stopping recording...');
      
      if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      
      setIsRecording(false);
      
      // Clean up stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
    } catch (error) {
      console.error('❌ Error stopping recording:', error);
      setIsRecording(false);
    }
  }, [isRecording]);
  
  const clearRecording = useCallback(() => {
    if (isRecording) {
      console.warn('⚠️ Cannot clear while recording');
      return;
    }
    
    console.log('🧹 Clearing recording...');
    setRecordedAudioUrl(null);
    setErrorMessage(null);
    chunksRef.current = [];
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, [isRecording]);

  return {
    isRecording,
    recordedAudioUrl,
    permissionStatus,
    errorMessage,
    requestMicrophonePermission,
    startRecording,
    stopRecording,
    clearRecording
  };
}