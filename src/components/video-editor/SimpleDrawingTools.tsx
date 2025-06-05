import React from 'react';
import { Button } from '@/components/ui/button';
import { PenLine, Trash2 } from 'lucide-react';

interface SimpleDrawingToolsProps {
  onToggleDrawing?: () => void;
  onClearCanvas?: () => void;
  isDrawingEnabled?: boolean;
}

/**
 * A simplified drawing tools component for the video editor
 */
const SimpleDrawingTools: React.FC<SimpleDrawingToolsProps> = ({
  onToggleDrawing,
  onClearCanvas,
  isDrawingEnabled = false
}) => {
  return (
    <div className="flex gap-2" data-testid="drawing-tools">
      <Button
        variant={isDrawingEnabled ? "secondary" : "outline"}
        size="sm"
        onClick={onToggleDrawing}
        className="flex items-center"
        title={isDrawingEnabled ? "Disable drawing" : "Enable drawing"}
        data-testid="drawing-toggle-button"
        type="button"
      >
        <PenLine className="w-4 h-4 mr-1" />
        {isDrawingEnabled ? 'Drawing On' : 'Draw'}
      </Button>
      
      {isDrawingEnabled && onClearCanvas && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearCanvas}
          title="Clear all drawings"
          data-testid="clear-drawings-button"
          type="button"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default SimpleDrawingTools;
