import React from 'react';
import { VideoAction } from '@/types/timelineTypes';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface VideoActionsListProps {
  actions: VideoAction[];
  maxHeight?: string;
  showTitle?: boolean;
}

const VideoActionsList: React.FC<VideoActionsListProps> = ({ 
  actions, 
  maxHeight = '200px',
  showTitle = true
}) => {
  if (actions.length === 0) {
    return null;
  }
  
  // Format timestamp (milliseconds) to seconds with 2 decimal places
  const formatTimestamp = (timestamp: number): string => {
    return (timestamp / 1000).toFixed(2) + 's';
  };
  
  // Format video time (seconds) to MM:SS.SS format
  const formatVideoTime = (seconds?: number): string => {
    if (seconds === undefined) return 'N/A';
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toFixed(2).padStart(5, '0')}`;
  };
  
  // Get appropriate color for action type
  const getActionColor = (type: string): string => {
    switch (type) {
      case 'play': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pause': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'seek': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  return (
    <div className="w-full border rounded-md p-3 bg-card">
      {showTitle && (
        <h3 className="text-sm font-medium mb-2">Timeline Actions ({actions.length})</h3>
      )}
      
      <ScrollArea className={`w-full`} style={{ maxHeight }}>
        <div className="space-y-2">
          {actions.map((action, index) => (
            <div key={index} className="flex items-center justify-between text-xs p-2 bg-muted rounded-sm">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={getActionColor(action.type)}>
                  {action.type}
                </Badge>
                <span className="font-mono">{formatTimestamp(action.timestamp)}</span>
              </div>
              <span className="font-mono">Video: {formatVideoTime(action.videoTime)}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default VideoActionsList;