import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PlaybackTracker from '@/components/PlaybackTracker';
import PlaybackPreviewPlayerEnhanced from '@/components/PlaybackPreviewPlayerEnhanced';
import { AppLayout } from '@/components/AppLayout';

interface DrawAction {
  path: { x: number; y: number }[];
  timestamp: number;
  startTime: number;
  endTime: number;
  color: string;
  width: number;
  id?: string;
  isVisible?: boolean;
}

interface TimelineEvent {
  type: 'pause' | 'resume' | 'seek' | 'play';
  timestamp: number;
  time: number;
  duration?: number;
}

interface CritiqueSession {
  videoUrl: string;
  audioUrl: string | null;
  drawActions: DrawAction[];
  timelineEvents: TimelineEvent[];
  createdAt: string;
  id: string;
}

const PlaybackTrackerPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const [isPreview, setIsPreview] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [drawActions, setDrawActions] = useState<DrawAction[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>('https://www.w3schools.com/html/mov_bbb.mp4');
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const savedDraft = localStorage.getItem(`critique_draft_${videoId || 'demo'}`);
    if (savedDraft) {
      try {
        const session: CritiqueSession = JSON.parse(savedDraft);
        setRecordedAudioUrl(session.audioUrl);
        setDrawActions(session.drawActions || []);
        setTimelineEvents(session.timelineEvents || []);
      } catch (error) {
        console.error('Failed to load saved draft:', error);
      }
    }
  }, [videoId]);

  const handlePreviewCritique = () => {
    const savedDraft = localStorage.getItem(`critique_draft_${videoId || 'demo'}`);
    if (savedDraft) {
      try {
        const session: CritiqueSession = JSON.parse(savedDraft);
        setRecordedAudioUrl(session.audioUrl);
        setDrawActions(session.drawActions || []);
        setTimelineEvents(session.timelineEvents || []);
      } catch (error) {
        console.error('Failed to load saved draft for preview:', error);
      }
    }
    setIsPreview(true);
  };

  const handleBackToEditor = () => {
    setIsPreview(false);
  };

  if (isPreview) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Critique Preview</h1>
              <button
                onClick={handleBackToEditor}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Back to Editor
              </button>
            </div>
            <p className="text-gray-600 mt-2">
              Preview your recorded critique with synchronized audio, video, and drawings.
            </p>
          </div>
          
          <PlaybackPreviewPlayerEnhanced
            videoUrl={videoUrl}
            audioUrl={recordedAudioUrl || ''}
            drawActions={drawActions}
            timelineEvents={timelineEvents}
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Critique Studio</h1>
          <p className="text-gray-600">
            Record audio commentary and draw annotations while watching the video. Use the unified controls to start/stop your critique session.
          </p>
          {videoId && (
            <p className="text-sm text-blue-600 mt-2">
              Editing video: {videoId}
            </p>
          )}
        </div>
        
        <PlaybackTracker
          videoUrl={videoUrl}
          setRecordedAudioUrl={setRecordedAudioUrl}
          drawActions={drawActions}
          setDrawActions={setDrawActions}
          videoRef={videoRef}
          onPreviewCritique={handlePreviewCritique}
        />
      </div>
    </AppLayout>
  );
};

export default PlaybackTrackerPage;