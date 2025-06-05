import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Volume2, Music } from 'lucide-react';
import { AudioMixSettings } from '@/types/drawingTypes';

interface AudioVolumeControlProps {
  audioSettings: AudioMixSettings;
  onVolumeChange: (settings: AudioMixSettings) => void;
}

const AudioVolumeControl: React.FC<AudioVolumeControlProps> = ({
  audioSettings,
  onVolumeChange
}) => {
  const handleVideoVolumeChange = (value: number[]) => {
    onVolumeChange({
      ...audioSettings,
      videoVolume: value[0]
    });
  };

  const handleCritiqueVolumeChange = (value: number[]) => {
    onVolumeChange({
      ...audioSettings,
      critiqueVolume: value[0]
    });
  };

  return (
    <div className="space-y-4 p-3 bg-muted rounded-md">
      <h3 className="text-sm font-medium mb-2">Audio Mix Settings</h3>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="video-volume" className="flex items-center">
            <Music className="h-4 w-4 mr-2" /> 
            <span>Video Volume</span>
          </Label>
          <span className="text-xs text-muted-foreground">
            {Math.round(audioSettings.videoVolume * 100)}%
          </span>
        </div>
        <Slider
          id="video-volume"
          min={0}
          max={1}
          step={0.05}
          value={[audioSettings.videoVolume]}
          onValueChange={handleVideoVolumeChange}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="critique-volume" className="flex items-center">
            <Volume2 className="h-4 w-4 mr-2" /> 
            <span>Critique Volume</span>
          </Label>
          <span className="text-xs text-muted-foreground">
            {Math.round(audioSettings.critiqueVolume * 100)}%
          </span>
        </div>
        <Slider
          id="critique-volume"
          min={0}
          max={1}
          step={0.05}
          value={[audioSettings.critiqueVolume]}
          onValueChange={handleCritiqueVolumeChange}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default AudioVolumeControl;
