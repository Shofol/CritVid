import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { PenLine, Trash2 } from 'lucide-react';

interface DrawingToolsProps {
  isDrawingEnabled: boolean;
  onToggleDrawing: (enabled: boolean) => void;
  onClearCanvas?: () => void;
}

const DrawingTools: React.FC<DrawingToolsProps> = ({
  isDrawingEnabled,
  onToggleDrawing,
  onClearCanvas
}) => {
  // Use a memoized handler to ensure the toggle works correctly
  const handleToggleDrawing = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent any event bubbling that might trigger parent handlers
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    console.log('DrawingTools: Toggle button clicked, current state:', isDrawingEnabled);
    // IMPORTANT: We're passing the opposite of current state, not referencing any recording state
    onToggleDrawing(!isDrawingEnabled);
  }, [isDrawingEnabled, onToggleDrawing]);
  
  // Memoize clear handler to prevent unnecessary re-renders
  const handleClearCanvas = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent any event bubbling that might trigger parent handlers
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    if (onClearCanvas) {
      console.log('DrawingTools: Clear canvas button clicked');
      onClearCanvas();
    }
  }, [onClearCanvas]);
  
  return (
    <div className="flex gap-2" data-testid="drawing-tools">
      <Button
        variant={isDrawingEnabled ? "secondary" : "outline"}
        size="sm"
        onClick={handleToggleDrawing}
        className="flex items-center"
        title={isDrawingEnabled ? "Disable drawing" : "Enable drawing"}
        data-testid="drawing-toggle-button"
        type="button" // Explicitly set type to prevent form submission
      >
        <PenLine className="w-4 h-4 mr-1" />
        {isDrawingEnabled ? 'Drawing On' : 'Draw'}
      </Button>
      
      {isDrawingEnabled && onClearCanvas && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearCanvas}
          title="Clear all drawings"
          data-testid="clear-drawings-button"
          type="button" // Explicitly set type to prevent form submission
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default DrawingTools;