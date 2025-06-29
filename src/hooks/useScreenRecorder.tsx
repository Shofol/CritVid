import { useCallback, useRef, useState } from "react";

interface ScreenRecorderOptions {
  mimeType?: string;
  videoBitsPerSecond?: number;
  audioBitsPerSecond?: number;
  onStart?: () => void;
  onStop?: (blob: Blob) => void;
  onError?: (error: Error) => void;
  onAudioStop?: (audioBlob: Blob) => void;
}

export function useScreenRecorder(options: ScreenRecorderOptions = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [recordedVideoBlob, setRecordedVideoBlob] = useState<Blob | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<
    "unknown" | "granted" | "denied"
  >("unknown");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const combinedStreamRef = useRef<MediaStream | null>(null);
  const audioOnlyStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioChunksRef = useRef<Blob[]>([]);

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
        preferCurrentTab: true,
        selfBrowserSurface: "include",
        systemAudio: "include",
      });

      // Request microphone audio
      const micStream = await navigator.mediaDevices.getUserMedia({
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
      audioChunksRef.current = [];

      // Get screen stream with audio
      console.log("📺 Requesting screen capture with audio...");
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
        preferCurrentTab: true,
        selfBrowserSurface: "include",
        systemAudio: "include",
      });

      console.log(
        "🎧 Screen stream audio tracks:",
        screenStream.getAudioTracks().length
      );

      // Get microphone stream
      console.log("🎤 Requesting microphone access...");
      const micStream = await navigator.mediaDevices.getUserMedia({
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

      console.log(
        "🎙️ Microphone stream audio tracks:",
        micStream.getAudioTracks().length
      );

      screenStreamRef.current = screenStream;
      micStreamRef.current = micStream;

      // Create a combined stream with video from screen and mixed audio
      const combinedStream = new MediaStream();

      // Create an audio-only stream for separate microphone recording
      const audioOnlyStream = new MediaStream();

      // Add video track from screen
      const videoTrack = screenStream.getVideoTracks()[0];
      if (videoTrack) {
        combinedStream.addTrack(videoTrack);
        console.log("✅ Video track added to combined stream");
      } else {
        throw new Error("No video track available from screen capture");
      }

      // Handle audio mixing more robustly
      const screenAudioTracks = screenStream.getAudioTracks();
      const micAudioTracks = micStream.getAudioTracks();

      console.log(
        `🔊 Found ${screenAudioTracks.length} screen audio track(s) and ${micAudioTracks.length} mic audio track(s)`
      );

      // Add microphone audio to the audio-only stream (just mic, no mixing)
      if (micAudioTracks.length > 0) {
        micAudioTracks.forEach((track) => {
          audioOnlyStream.addTrack(track);
          console.log("✅ Microphone audio track added to audio-only stream");
        });
      }

      if (screenAudioTracks.length === 0 && micAudioTracks.length === 0) {
        // No audio at all - warn but continue with video only
        console.warn("⚠️ No audio tracks available - recording video only");
        setErrorMessage(
          "⚠️ No audio detected. Make sure to check 'Share audio' when prompted and enable microphone access."
        );
      } else if (screenAudioTracks.length > 0 && micAudioTracks.length > 0) {
        // Both audio sources available - mix them for combined stream
        console.log(
          "🎵 Mixing screen and microphone audio for combined stream..."
        );
        try {
          const audioContext = new AudioContext();
          const screenSource = audioContext.createMediaStreamSource(
            new MediaStream([screenAudioTracks[0]])
          );
          const micSource = audioContext.createMediaStreamSource(micStream);
          const destination = audioContext.createMediaStreamDestination();

          // Create gain nodes for volume control
          const screenGain = audioContext.createGain();
          const micGain = audioContext.createGain();

          // Set volumes (you can adjust these)
          screenGain.gain.value = 0.8; // Screen audio at 80%
          micGain.gain.value = 1.0; // Microphone at 100%

          // Connect sources through gain nodes to destination
          screenSource.connect(screenGain);
          micSource.connect(micGain);
          screenGain.connect(destination);
          micGain.connect(destination);

          // Add mixed audio track to combined stream only
          destination.stream.getAudioTracks().forEach((track) => {
            combinedStream.addTrack(track);
            console.log("✅ Mixed audio track added to combined stream");
          });
        } catch (audioError) {
          console.error(
            "❌ Audio mixing failed, falling back to microphone only for combined stream:",
            audioError
          );
          // Fallback to microphone only for combined stream
          micAudioTracks.forEach((track) => {
            combinedStream.addTrack(track);
            console.log(
              "✅ Microphone audio track added to combined stream (fallback)"
            );
          });
        }
      } else if (screenAudioTracks.length > 0) {
        // Only screen audio available - add to combined stream
        console.log("🔊 Using screen audio only for combined stream");
        screenAudioTracks.forEach((track) => {
          combinedStream.addTrack(track);
          console.log("✅ Screen audio track added to combined stream");
        });
      } else if (micAudioTracks.length > 0) {
        // Only microphone audio available - add to combined stream
        console.log("🎤 Using microphone audio only for combined stream");
        micAudioTracks.forEach((track) => {
          combinedStream.addTrack(track);
          console.log("✅ Microphone audio track added to combined stream");
        });
      }

      combinedStreamRef.current = combinedStream;
      audioOnlyStreamRef.current = audioOnlyStream;

      // Log final stream composition
      console.log("🎬 Final combined stream composition:", {
        videoTracks: combinedStream.getVideoTracks().length,
        audioTracks: combinedStream.getAudioTracks().length,
      });

      console.log("🎵 Audio-only stream composition:", {
        audioTracks: audioOnlyStream.getAudioTracks().length,
      });

      // Determine MIME type for video
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

      // Determine MIME type for audio
      let audioMimeType = "audio/webm;codecs=opus";
      if (!MediaRecorder.isTypeSupported(audioMimeType)) {
        audioMimeType = "audio/webm";
        if (!MediaRecorder.isTypeSupported(audioMimeType)) {
          audioMimeType = "audio/mp4";
        }
      }

      console.log("📼 Using video MIME type:", mimeType);
      console.log("🎵 Using audio MIME type:", audioMimeType);

      // Create MediaRecorder for combined video/audio
      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType,
        videoBitsPerSecond: options.videoBitsPerSecond || 2500000, // 2.5 Mbps
        audioBitsPerSecond: options.audioBitsPerSecond || 192000, // Enhanced 192 kbps for clearer audio
      });
      mediaRecorderRef.current = mediaRecorder;

      // Create MediaRecorder for audio-only
      const audioRecorder = new MediaRecorder(audioOnlyStream, {
        mimeType: audioMimeType,
        audioBitsPerSecond: options.audioBitsPerSecond || 192000, // Enhanced 192 kbps for clearer audio
      });
      audioRecorderRef.current = audioRecorder;

      // Set up event listeners for video recorder
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
          "🛑 Video recording stopped, processing",
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
        setRecordedVideoBlob(videoBlob);
        console.log("✅ Screen recording completed:", videoBlob.size, "bytes");

        if (options.onStop) options.onStop(videoBlob);
      };

      mediaRecorder.onerror = (event) => {
        console.error("❌ MediaRecorder error:", event);
        const error = new Error("Recording failed");
        setErrorMessage(error.message);
        if (options.onError) options.onError(error);
      };

      // Set up event listeners for audio recorder
      audioRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log(
            "🎵 Audio chunk received:",
            event.data.size,
            "bytes, total:",
            audioChunksRef.current.length
          );
        } else {
          console.warn("⚠️ Empty audio chunk");
        }
      };

      audioRecorder.onstop = () => {
        console.log(
          "🛑 Audio recording stopped, processing",
          audioChunksRef.current.length,
          "chunks"
        );

        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: audioMimeType,
          });
          const audioUrl = URL.createObjectURL(audioBlob);

          setRecordedAudioUrl(audioUrl);
          setRecordedAudioBlob(audioBlob);
          console.log("✅ Audio recording completed:", audioBlob.size, "bytes");

          if (options.onAudioStop) options.onAudioStop(audioBlob);
        }
      };

      audioRecorder.onerror = (event) => {
        console.error("❌ Audio MediaRecorder error:", event);
        const error = new Error("Audio recording failed");
        setErrorMessage(error.message);
        if (options.onError) options.onError(error);
      };

      // Handle screen share ending
      videoTrack.addEventListener("ended", () => {
        console.log("🛑 Screen share ended by user");
        stopRecording();
      });

      // Start both recorders
      mediaRecorder.start(100); // Collect data every 100ms
      audioRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      console.log("✅ Screen and audio recording started");

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
    if (!isRecording) {
      console.warn("⚠️ No active recording to stop");
      return;
    }

    try {
      console.log("🛑 Stopping screen and audio recording...");

      // Stop video recorder
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        mediaRecorderRef.current.stop();
      }

      // Stop audio recorder
      if (
        audioRecorderRef.current &&
        audioRecorderRef.current.state === "recording"
      ) {
        audioRecorderRef.current.stop();
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

      if (audioOnlyStreamRef.current) {
        audioOnlyStreamRef.current.getTracks().forEach((track) => track.stop());
        audioOnlyStreamRef.current = null;
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

    console.log("🧹 Clearing screen and audio recordings...");
    setRecordedVideoUrl(null);
    setRecordedVideoBlob(null);
    setRecordedAudioUrl(null);
    setRecordedAudioBlob(null);
    setErrorMessage(null);
    chunksRef.current = [];
    audioChunksRef.current = [];

    // Clean up streams
    [
      screenStreamRef,
      micStreamRef,
      combinedStreamRef,
      audioOnlyStreamRef,
    ].forEach((streamRef) => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    });
  }, [isRecording]);

  return {
    isRecording,
    recordedVideoUrl,
    recordedVideoBlob,
    recordedAudioUrl,
    recordedAudioBlob,
    permissionStatus,
    errorMessage,
    requestPermissions,
    startRecording,
    stopRecording,
    clearRecording,
  };
}
