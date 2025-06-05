import React from 'react';
import { useParams } from 'react-router-dom';
import PlaybackTrackerPage from '@/pages/PlaybackTrackerPage';

// Redirect to unified PlaybackTracker editor
const CritiqueEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Use the unified PlaybackTracker for all critique editing
  return <PlaybackTrackerPage />;
};

export default CritiqueEditor;