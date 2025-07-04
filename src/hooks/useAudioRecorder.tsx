import { RecordingState } from "@/types/critiqueTypes";
import { useCallback, useEffect, useRef, useState } from "react";

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
    audioBlob: null,
  });

  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const recordingPromiseRef = useRef<{
    resolve: (blob: Blob | null) => void;
    reject: (error: Error) => void;
  } | null>(null);

  const mimeType = options.mimeType || "audio/webm";
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
        streamRef.current.getTracks().forEach((track) => track.stop());
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
        setState((prev) => ({
          ...prev,
          elapsedTime,
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
      console.log("🎤 Starting audio recording...");

      // Clear any previous chunks
      chunksRef.current = [];

      // Enhanced microphone permissions with optimized constraints for speech clarity
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          // Enhanced noise suppression and echo cancellation
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,

          // Higher quality audio settings for clarity
          sampleRate: { ideal: 48000, min: 44100 }, // Higher sample rate for better clarity
          sampleSize: { ideal: 16, min: 16 }, // 16-bit audio depth
          channelCount: { ideal: 1, exact: 1 }, // Mono for voice (clearer than stereo for speech)
        },
      });

      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      streamRef.current = stream;

      // Enhanced audio level testing and microphone validation
      const audioContext = new AudioContext({ sampleRate: 48000 });
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();

      // Configure analyser for better voice detection
      analyser.fftSize = 2048;
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;
      analyser.smoothingTimeConstant = 0.85;

      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      const hasAudio = dataArray.some((value) => value > 0);

      if (!hasAudio) {
        console.warn("⚠️ No audio input detected");
      } else {
        console.log("✅ Audio input detected successfully");
      }

      audioContext.close();

      // Enhanced MIME type selection with better codecs for speech
      let finalMimeType = "audio/webm;codecs=opus";
      if (!MediaRecorder.isTypeSupported(finalMimeType)) {
        // Try other high-quality codecs
        const codecOptions = [
          "audio/webm;codecs=pcm",
          "audio/webm",
          "audio/mp4;codecs=aac",
          "audio/mp4",
          "audio/ogg;codecs=opus",
        ];

        for (const codec of codecOptions) {
          if (MediaRecorder.isTypeSupported(codec)) {
            finalMimeType = codec;
            break;
          }
        }

        if (!finalMimeType) {
          finalMimeType = "";
        }
      }

      // Enhanced MediaRecorder with higher bitrate for better quality
      const enhancedAudioBitsPerSecond = Math.max(audioBitsPerSecond, 192000); // Minimum 192kbps for clear speech

      const recorder = new MediaRecorder(stream, {
        mimeType: finalMimeType || undefined,
        audioBitsPerSecond: enhancedAudioBitsPerSecond,
      });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
          console.log(
            "📊 Audio chunk:",
            event.data.size,
            "bytes, total chunks:",
            chunksRef.current.length
          );
        } else {
          console.warn("⚠️ Empty audio chunk received");
        }
      };

      recorder.onstop = () => {
        console.log("🛑 Recording stopped, chunks:", chunksRef.current.length);

        if (chunksRef.current.length === 0) {
          console.error("❌ No audio chunks recorded");
          const error = new Error(
            "No audio data captured. Check microphone permissions and ensure microphone is not muted."
          );

          if (recordingPromiseRef.current) {
            recordingPromiseRef.current.reject(error);
            recordingPromiseRef.current = null;
          }

          if (options.onError) options.onError(error);
          return;
        }

        const audioBlob = new Blob(chunksRef.current, {
          type: finalMimeType || "audio/webm",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        console.log(
          "✅ Enhanced audio blob created:",
          audioBlob.size,
          "bytes, bitrate:",
          enhancedAudioBitsPerSecond
        );

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
        console.error("❌ MediaRecorder error:", event);
        const error = new Error("MediaRecorder error occurred");

        if (recordingPromiseRef.current) {
          recordingPromiseRef.current.reject(error);
          recordingPromiseRef.current = null;
        }

        if (options.onError) options.onError(error);
      };

      // Enhanced data collection frequency for smoother recording
      recorder.start(100); // 100ms intervals for very smooth capture
      setState((prev) => ({
        ...prev,
        isRecording: true,
        startTime: Date.now(),
      }));
      startTimer();

      if (options.onStart) options.onStart();
      console.log(
        "✅ Enhanced recording started with MIME type:",
        finalMimeType,
        "bitrate:",
        enhancedAudioBitsPerSecond
      );
    } catch (error) {
      console.error("❌ Recording error:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const finalError = new Error(
        `Failed to start recording: ${errorMessage}`
      );

      if (options.onError) options.onError(finalError);
      throw finalError;
    }
  }, [mimeType, audioBitsPerSecond, options, startTimer]);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    if (!mediaRecorderRef.current || !state.isRecording) {
      console.warn("⚠️ No active recording to stop");
      return null;
    }

    return new Promise((resolve, reject) => {
      recordingPromiseRef.current = { resolve, reject };

      try {
        console.log(
          "🛑 Stopping recording, current chunks:",
          chunksRef.current.length
        );

        // Force final data collection
        if (mediaRecorderRef.current.state === "recording") {
          mediaRecorderRef.current.requestData();

          // Delay to ensure final chunk is captured
          setTimeout(() => {
            if (
              mediaRecorderRef.current &&
              mediaRecorderRef.current.state === "recording"
            ) {
              mediaRecorderRef.current.stop();
            }
          }, 300); // Increased delay
        }

        stopTimer();

        // Timeout fallback
        setTimeout(() => {
          if (recordingPromiseRef.current) {
            console.warn("⚠️ Stop timeout, resolving with current state");
            recordingPromiseRef.current.resolve(state.audioBlob);
            recordingPromiseRef.current = null;
          }
        }, 5000); // Increased timeout
      } catch (error) {
        console.error("❌ Error stopping recording:", error);
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

    console.log("🧹 Clearing recording data...");
    setState({
      isRecording: false,
      isPaused: false,
      startTime: null,
      elapsedTime: 0,
      audioBlob: null,
    });

    setRecordedAudioUrl(null);
    chunksRef.current = [];
    startTimeRef.current = null;

    if (!state.isRecording && streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, [state.isRecording]);

  return {
    isRecording: state.isRecording,
    recordedAudioUrl,
    startRecording,
    stopRecording,
    clearRecording,
    state,
  };
}
