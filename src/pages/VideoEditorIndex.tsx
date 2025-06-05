import React from 'react';
import { Navigate } from 'react-router-dom';

// Redirect to PlaybackTracker for all video editing
const VideoEditorIndex: React.FC = () => {
  return <Navigate to="/critique-editor" replace />;
};

export default VideoEditorIndex;