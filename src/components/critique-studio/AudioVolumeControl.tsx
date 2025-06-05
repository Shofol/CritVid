import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Volume2 } from 'lucide-react';

interface AudioVolumeControlProps {
  label: string;
  volume: number;
  onChange: (volume: number) => void;
}

const AudioVolumeControl: React.FC<AudioVolumeControlProps> = ({
  label,
  volume,
  onChange
}) => {
  const handleVolumeChange = (value: number[]) => {
    onChange(value[0]);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={`volume-${label}`} className="flex items-center">
          <Volume2 className="h-4 w-4 mr-2" /> 
          <span>{label}</span>
        </Label>
        <span className="text-xs text-muted-foreground">
          {Math.round(volume * 100)}%
        </span>
      </div>
      <Slider
        id={`volume-${label}`}
        min={0}
        max={1}
        step={0.05}
        value={[volume]}
        onValueChange={handleVolumeChange}
        className="w-full"
      />
    </div>
  );
};

export default AudioVolumeControl;