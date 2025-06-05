import React from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import DELETE_AdvancedVideoEditor from '@/components/video-editor/DELETE_AdvancedVideoEditor';

// DEPRECATED: This page is no longer used in the unified critique system
// Use PlaybackTrackerPage.tsx instead

const DELETE_AdvancedVideoEditorPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  
  // Mock video URL - in real app this would come from API
  const videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";

  const handleSave = (data: any) => {
    console.log('Saving video edit data:', data);
    // Save logic would go here
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Advanced Video Editor</h1>
          <p className="text-gray-600">
            DEPRECATED: This editor has been replaced by the unified PlaybackTracker system.
          </p>
          {videoId && (
            <p className="text-sm text-blue-600 mt-2">
              Video ID: {videoId}
            </p>
          )}
        </div>
        
        <DELETE_AdvancedVideoEditor
          videoUrl={videoUrl}
          onSave={handleSave}
        />
      </div>
    </AppLayout>
  );
};

export default DELETE_AdvancedVideoEditorPage;