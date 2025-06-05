import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

// Redirect to PlaybackTracker for all video critique viewing
const VideoCritique: React.FC = () => {
  const { id } = useParams();
  
  if (id) {
    return <Navigate to={`/critique-editor/${id}`} replace />;
  }
  
  return <Navigate to="/critique-editor" replace />;
};

export default VideoCritique;