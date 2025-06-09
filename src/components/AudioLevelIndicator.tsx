import { Mic, MicOff } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface AudioLevelIndicatorProps {
  stream: MediaStream | null;
  isRecording: boolean;
}

const AudioLevelIndicator: React.FC<AudioLevelIndicatorProps> = ({
  stream,
  isRecording,
}) => {
  const [audioLevel, setAudioLevel] = useState(0);
  const [isOptimalLevel, setIsOptimalLevel] = useState(false);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!stream || !isRecording) {
      setAudioLevel(0);
      setIsOptimalLevel(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    try {
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 2048;
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;
      analyser.smoothingTimeConstant = 0.85;

      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateAudioLevel = () => {
        if (analyser) {
          analyser.getByteFrequencyData(dataArray);

          // Calculate RMS (Root Mean Square) for better level representation
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i] * dataArray[i];
          }
          const rms = Math.sqrt(sum / dataArray.length);
          const normalizedLevel = Math.min(100, (rms / 128) * 100);

          setAudioLevel(normalizedLevel);

          // Optimal level is between 20-80% for clear speech
          setIsOptimalLevel(normalizedLevel >= 20 && normalizedLevel <= 80);

          animationRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };

      updateAudioLevel();

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        audioContext.close();
      };
    } catch (error) {
      console.error("Error setting up audio level monitoring:", error);
    }
  }, [stream, isRecording]);

  if (!stream || !isRecording) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-500 rounded-lg border">
        <MicOff className="w-4 h-4" />
        <span className="text-sm">Audio monitoring inactive</span>
      </div>
    );
  }

  const getLevelColor = () => {
    if (audioLevel === 0) return "bg-gray-300";
    if (audioLevel < 10) return "bg-red-400"; // Too quiet
    if (audioLevel < 20) return "bg-yellow-400"; // Quiet
    if (audioLevel <= 80) return "bg-green-400"; // Optimal
    return "bg-red-500"; // Too loud
  };

  const getLevelText = () => {
    if (audioLevel === 0) return "Silent";
    if (audioLevel < 10) return "Too quiet";
    if (audioLevel < 20) return "Quiet";
    if (audioLevel <= 80) return "Good level";
    return "Too loud";
  };

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-white border rounded-lg shadow-sm">
      <Mic
        className={`w-4 h-4 ${isOptimalLevel ? "text-green-600" : "text-gray-500"}`}
      />

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-gray-700">Audio Level</span>
          <span
            className={`text-xs font-semibold ${isOptimalLevel ? "text-green-600" : "text-gray-500"}`}
          >
            {getLevelText()}
          </span>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ${getLevelColor()}`}
            style={{ width: `${Math.min(100, audioLevel)}%` }}
          />
        </div>
      </div>

      <div className="text-xs text-gray-500 min-w-[3rem] text-right">
        {Math.round(audioLevel)}%
      </div>
    </div>
  );
};

export default AudioLevelIndicator;
