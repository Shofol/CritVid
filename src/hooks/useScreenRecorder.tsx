import { useCallback, useRef, useState } from "react";

interface ScreenRecorderOptions {
  mimeType?: string;
  videoBitsPerSecond?: number;
  audioBitsPerSecond?: number;
  onStart?: () => void;
  onStop?: (blob: Blob) => void;
  onError?: (error: Error) => void;
}

export function useScreenRecorder(options: ScreenRecorderOptions = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<
    "unknown" | "granted" | "denied"
  >("unknown");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const combinedStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const requestPermissions = useCallback(async () => {
    try {
      console.log("🎥 Requesting screen recording permissions...");
      setErrorMessage(null);

      // Request screen capture with audio
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Request microphone audio
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
        },
      });

      // Stop test streams
      screenStream.getTracks().forEach((track) => track.stop());
      micStream.getTracks().forEach((track) => track.stop());

      setPermissionStatus("granted");
      console.log("✅ Screen recording permissions granted");
      return true;
    } catch (error: unknown) {
      console.error("❌ Screen recording permission denied:", error);
      setPermissionStatus("denied");

      let errorMsg =
        "Failed to access screen recording. Please check your browser settings.";

      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError") {
          errorMsg =
            "🎥 Screen recording access blocked — please enable permissions in your browser.";
        } else if (error.name === "NotSupportedError") {
          errorMsg = "🎥 Screen recording is not supported in your browser.";
        }
      }

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
      console.log("🎥 Starting screen recording...");
      setErrorMessage(null);
      chunksRef.current = [];

      // Get screen stream with audio
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Get microphone stream
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
        },
      });

      screenStreamRef.current = screenStream;
      micStreamRef.current = micStream;

      // Create a combined stream with video from screen and mixed audio
      const combinedStream = new MediaStream();

      // Add video track from screen
      const videoTrack = screenStream.getVideoTracks()[0];
      if (videoTrack) {
        combinedStream.addTrack(videoTrack);
      }

      // Mix audio streams using Web Audio API
      const audioContext = new AudioContext();
      const screenSource = screenStream.getAudioTracks()[0]
        ? audioContext.createMediaStreamSource(
            new MediaStream([screenStream.getAudioTracks()[0]])
          )
        : null;
      const micSource = audioContext.createMediaStreamSource(micStream);
      const destination = audioContext.createMediaStreamDestination();

      // Connect both audio sources to the destination
      if (screenSource) {
        screenSource.connect(destination);
      }
      micSource.connect(destination);

      // Add mixed audio track to combined stream
      destination.stream.getAudioTracks().forEach((track) => {
        combinedStream.addTrack(track);
      });

      combinedStreamRef.current = combinedStream;

      // Determine MIME type
      let mimeType = "video/webm;codecs=vp9,opus";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm;codecs=vp8,opus";
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = "video/webm";
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = "video/mp4";
          }
        }
      }

      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType,
        videoBitsPerSecond: options.videoBitsPerSecond || 2500000, // 2.5 Mbps
        audioBitsPerSecond: options.audioBitsPerSecond || 128000, // 128 kbps
      });
      mediaRecorderRef.current = mediaRecorder;

      // Set up event listeners
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
          console.log(
            "📊 Video chunk received:",
            event.data.size,
            "bytes, total:",
            chunksRef.current.length
          );
        } else {
          console.warn("⚠️ Empty video chunk");
        }
      };

      mediaRecorder.onstop = () => {
        console.log(
          "🛑 Recording stopped, processing",
          chunksRef.current.length,
          "chunks"
        );

        if (chunksRef.current.length === 0) {
          const error = new Error("No video data captured. Please try again.");
          setErrorMessage(error.message);
          if (options.onError) options.onError(error);
          return;
        }

        const videoBlob = new Blob(chunksRef.current, { type: mimeType });
        const videoUrl = URL.createObjectURL(videoBlob);

        setRecordedVideoUrl(videoUrl);
        console.log("✅ Screen recording completed:", videoBlob.size, "bytes");

        if (options.onStop) options.onStop(videoBlob);
      };

      mediaRecorder.onerror = (event) => {
        console.error("❌ MediaRecorder error:", event);
        const error = new Error("Recording failed");
        setErrorMessage(error.message);
        if (options.onError) options.onError(error);
      };

      // Handle screen share ending
      videoTrack.addEventListener("ended", () => {
        console.log("🛑 Screen share ended by user");
        stopRecording();
      });

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      console.log("✅ Screen recording started with MIME type:", mimeType);

      if (options.onStart) options.onStart();
    } catch (error: unknown) {
      console.error("❌ Failed to start screen recording:", error);
      let errorMsg =
        "Failed to start screen recording. Please check permissions.";

      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError") {
          errorMsg =
            "🎥 Screen recording access blocked — please enable permissions in your browser.";
        } else if (error.name === "NotSupportedError") {
          errorMsg = "🎥 Screen recording is not supported in your browser.";
        }
      }

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
      console.log("🛑 Stopping screen recording...");

      if (mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }

      setIsRecording(false);

      // Clean up streams
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }

      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
        micStreamRef.current = null;
      }

      if (combinedStreamRef.current) {
        combinedStreamRef.current.getTracks().forEach((track) => track.stop());
        combinedStreamRef.current = null;
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

    console.log("🧹 Clearing screen recording...");
    setRecordedVideoUrl(null);
    setErrorMessage(null);
    chunksRef.current = [];

    // Clean up streams
    [screenStreamRef, micStreamRef, combinedStreamRef].forEach((streamRef) => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    });
  }, [isRecording]);

  return {
    isRecording,
    recordedVideoUrl,
    permissionStatus,
    errorMessage,
    requestPermissions,
    startRecording,
    stopRecording,
    clearRecording,
  };
}
