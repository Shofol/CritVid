import { Gauge, Pause, Play, RotateCcw, Volume2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";

interface VideoControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

const VideoControls: React.FC<VideoControlsProps> = ({ videoRef }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const updatePlayState = () => setIsPlaying(!video.paused);
    const updateVolume = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };
    const updatePlaybackRate = () => setPlaybackRate(video.playbackRate);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("play", updatePlayState);
    video.addEventListener("pause", updatePlayState);
    video.addEventListener("volumechange", updateVolume);
    video.addEventListener("ratechange", updatePlaybackRate);

    // Initialize values
    if (video.readyState >= 1) {
      updateDuration();
      updateVolume();
      updatePlayState();
      updatePlaybackRate();
    }

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("play", updatePlayState);
      video.removeEventListener("pause", updatePlayState);
      video.removeEventListener("volumechange", updateVolume);
      video.removeEventListener("ratechange", updatePlaybackRate);
    };
  }, [videoRef]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video || !duration) return;

    const seekTime = (value[0] / 100) * duration;
    video.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = value[0] / 100;
    video.volume = newVolume;
    video.muted = newVolume === 0;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const restart = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSpeedChange = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = speed;
    setPlaybackRate(speed);
    setShowSpeedOptions(false);
  };

  const toggleSpeedOptions = () => {
    setShowSpeedOptions(!showSpeedOptions);
  };

  return (
    <div className="bg-black/10 text-white p-4 rounded-lg space-y-3 absolute bottom-0 left-0 right-0">
      {/* Progress Bar */}
      <div className="space-y-2">
        <Slider
          value={[progressPercentage]}
          onValueChange={handleSeek}
          max={100}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            onClick={restart}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-200"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>

          <Button
            onClick={togglePlayPause}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-200"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </Button>

          {/* Speed Control Button */}
          <div className="relative">
            <Button
              onClick={toggleSpeedOptions}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-200 flex items-center gap-1"
            >
              <Gauge className="w-4 h-4" />
              <span className="text-xs">{playbackRate}x</span>
            </Button>

            {/* Speed Options Dropdown */}
            {showSpeedOptions && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 rounded-lg p-2 shadow-lg border border-gray-700">
                <div className="text-xs text-gray-300 mb-2 text-center">
                  Speed
                </div>
                <div className="flex flex-col gap-1 min-w-[60px]">
                  {speedOptions.map((speed) => (
                    <Button
                      key={speed}
                      onClick={() => handleSpeedChange(speed)}
                      variant={playbackRate === speed ? "default" : "ghost"}
                      size="sm"
                      className={`text-xs px-3 py-1 h-7 justify-center ${
                        playbackRate === speed
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {speed}x
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Volume Controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={toggleMute}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-200"
          >
            <Volume2 className={`w-4 h-4 ${isMuted ? "text-red-400" : ""}`} />
          </Button>

          <div className="w-20">
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoControls;
