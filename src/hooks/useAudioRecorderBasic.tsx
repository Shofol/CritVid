import { useCallback, useRef, useState } from "react";

interface AudioRecorderOptions {
  onError?: (error: Error) => void;
}

export function useAudioRecorderBasic(options: AudioRecorderOptions = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<
    "unknown" | "granted" | "denied"
  >("unknown");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const requestMicrophonePermission = useCallback(async () => {
    try {
      console.log("🎤 Requesting microphone permission...");
      setErrorMessage(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,

          sampleRate: { ideal: 48000, min: 44100 },
          sampleSize: { ideal: 16, min: 16 },
          channelCount: { ideal: 1, exact: 1 },
        },
      });

      const audioContext = new AudioContext({ sampleRate: 48000 });
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 2048;
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;
      analyser.smoothingTimeConstant = 0.85;

      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);

      audioContext.close();

      stream.getTracks().forEach((track) => track.stop());

      setPermissionStatus("granted");
      console.log("✅ Microphone permission granted with enhanced settings");
      return true;
    } catch (error) {
      console.error("❌ Microphone permission denied:", error);
      setPermissionStatus("denied");

      const errorMsg =
        error instanceof Error && error.name === "NotAllowedError"
          ? "🎤 Microphone access blocked — please enable permissions in your browser."
          : "Failed to access microphone. Please check your browser settings.";

      setErrorMessage(errorMsg);
      if (options.onError) options.onError(new Error(errorMsg));
      return false;
    }
  }, [options]);

  const startRecording = useCallback(async () => {
    if (isRecording) {
      console.warn("⚠️ Already recording");
      return;
    }

    try {
      console.log("🎤 Starting enhanced audio recording...");
      setErrorMessage(null);
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,

          sampleRate: { ideal: 48000, min: 44100 },
          sampleSize: { ideal: 16, min: 16 },
          channelCount: { ideal: 1, exact: 1 },
        },
      });

      streamRef.current = stream;

      let mimeType = "audio/webm;codecs=opus";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        const codecOptions = [
          "audio/webm;codecs=pcm",
          "audio/webm",
          "audio/mp4;codecs=aac",
          "audio/mp4",
          "audio/ogg;codecs=opus",
        ];

        for (const codec of codecOptions) {
          if (MediaRecorder.isTypeSupported(codec)) {
            mimeType = codec;
            break;
          }
        }
      }

      const enhancedAudioBitsPerSecond = 192000;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: enhancedAudioBitsPerSecond,
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
          console.log(
            "📊 Enhanced audio chunk received:",
            event.data.size,
            "bytes, total:",
            chunksRef.current.length
          );
        } else {
          console.warn("⚠️ Empty audio chunk");
        }
      };

      mediaRecorder.onstop = () => {
        console.log(
          "🛑 Enhanced recording stopped, processing",
          chunksRef.current.length,
          "chunks"
        );

        if (chunksRef.current.length === 0) {
          const error = new Error(
            "No audio data captured. Check microphone permissions."
          );
          setErrorMessage(error.message);
          if (options.onError) options.onError(error);
          return;
        }

        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);

        setRecordedAudioUrl(audioUrl);
        console.log(
          "✅ Enhanced audio recording completed:",
          audioBlob.size,
          "bytes, bitrate:",
          enhancedAudioBitsPerSecond
        );
      };

      mediaRecorder.onerror = (event) => {
        console.error("❌ MediaRecorder error:", event);
        const error = new Error("Recording failed");
        setErrorMessage(error.message);
        if (options.onError) options.onError(error);
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      console.log(
        "✅ Enhanced recording started with MIME type:",
        mimeType,
        "bitrate:",
        enhancedAudioBitsPerSecond
      );
    } catch (error) {
      console.error("❌ Failed to start enhanced recording:", error);
      const errorMsg =
        error instanceof Error && error.name === "NotAllowedError"
          ? "🎤 Microphone access blocked — please enable permissions in your browser."
          : "Failed to start recording. Please check microphone permissions.";

      setErrorMessage(errorMsg);
      if (options.onError) options.onError(new Error(errorMsg));
    }
  }, [isRecording, options]);

  const stopRecording = useCallback(async () => {
    if (!isRecording || !mediaRecorderRef.current) {
      console.warn("⚠️ No active recording to stop");
      return;
    }

    try {
      console.log("🛑 Stopping recording...");

      if (mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }

      setIsRecording(false);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    } catch (error) {
      console.error("❌ Error stopping recording:", error);
      setIsRecording(false);
    }
  }, [isRecording]);

  const clearRecording = useCallback(() => {
    if (isRecording) {
      console.warn("⚠️ Cannot clear while recording");
      return;
    }

    console.log("🧹 Clearing recording...");
    setRecordedAudioUrl(null);
    setErrorMessage(null);
    chunksRef.current = [];

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
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
    clearRecording,
  };
}
