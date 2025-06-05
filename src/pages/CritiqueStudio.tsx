import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

// Redirect to PlaybackTracker for all critique editing
const CritiqueStudio: React.FC = () => {
  const { videoId } = useParams();
  
  if (videoId) {
    return <Navigate to={`/critique-editor/${videoId}`} replace />;
  }
  
  return <Navigate to="/critique-editor" replace />;
};

export default CritiqueStudio;