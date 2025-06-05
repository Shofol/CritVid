import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

// Redirect to PlaybackTracker for all video editing
const VideoEditor: React.FC = () => {
  const { videoId, id } = useParams();
  const actualVideoId = videoId || id;
  
  if (actualVideoId) {
    return <Navigate to={`/critique-editor/${actualVideoId}`} replace />;
  }
  
  return <Navigate to="/critique-editor" replace />;
};

export default VideoEditor;