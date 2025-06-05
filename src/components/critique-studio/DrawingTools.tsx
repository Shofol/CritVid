import React from 'react';
import { Button } from '@/components/ui/button';

interface DrawingToolsProps {
  isDrawMode: boolean;
  toggleDrawMode: () => void;
  isDisabled?: boolean;
}

const DrawingTools: React.FC<DrawingToolsProps> = ({
  isDrawMode,
  toggleDrawMode,
  isDisabled = false
}) => {
  return (
    <Button
      onClick={toggleDrawMode}
      variant={isDrawMode ? "secondary" : "outline"}
      disabled={isDisabled}
    >
      {isDrawMode ? "Exit Draw Mode" : "Draw Mode"}
    </Button>
  );
};

export default DrawingTools;
