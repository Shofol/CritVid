import React from 'react';
import { Slider } from '@/components/ui/slider';

interface DrawingDurationControlProps {
  duration: number;
  onChange: (duration: number) => void;
}

const DrawingDurationControl: React.FC<DrawingDurationControlProps> = ({ 
  duration, 
  onChange 
}) => {
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-white mb-1">
        <span>Duration:</span>
        <span>{duration}s</span>
      </div>
      <Slider
        value={[duration]}
        min={1}
        max={10}
        step={1}
        onValueChange={(values) => onChange(values[0])}
        className="w-full"
        data-testid="drawing-duration-slider"
      />
    </div>
  );
};

export default DrawingDurationControl;