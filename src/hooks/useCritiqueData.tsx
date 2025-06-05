import { useState, useEffect } from 'react';

export interface CritiqueData {
  id: string;
  videoId: string;
  videoTitle: string;
  adjudicatorName?: string;
  status: 'draft' | 'in_progress' | 'completed';
  createdAt: string;
  updatedAt: string;
  videoUrl?: string;
  audioUrl?: string;
  transcript?: string;
  exercises?: string[];
  timelineEvents?: any[];
}

export const useCritiqueData = (critiqueId?: string) => {
  const [critique, setCritique] = useState<CritiqueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!critiqueId) {
      setLoading(false);
      setCritique(null);
      return;
    }

    const fetchCritique = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Mock data for now
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (critiqueId === 'not-found') {
          throw new Error('Critique not found');
        }
        
        const mockData: CritiqueData = {
          id: critiqueId,
          videoId: `video-${critiqueId}`,
          videoTitle: 'Ballet Technique Assessment',
          adjudicatorName: 'Sarah Johnson',
          status: 'completed',
          createdAt: '2024-01-15',
          updatedAt: '2024-01-16',
          videoUrl: 'https://example.com/video.mp4',
          audioUrl: 'https://example.com/audio.mp3',
          transcript: 'Your posture shows excellent alignment in the opening sequence.',
          exercises: Array.isArray([
            'Practice tendu combinations at the barre for 10 minutes daily',
            'Work on port de bras fluidity with slow adagio movements'
          ]) ? [
            'Practice tendu combinations at the barre for 10 minutes daily',
            'Work on port de bras fluidity with slow adagio movements'
          ] : [],
          timelineEvents: Array.isArray([
            { timestamp: 15, type: 'comment', text: 'Good posture here' },
            { timestamp: 45, type: 'drawing', data: {} }
          ]) ? [
            { timestamp: 15, type: 'comment', text: 'Good posture here' },
            { timestamp: 45, type: 'drawing', data: {} }
          ] : []
        };
        
        setCritique(mockData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load critique');
        setCritique(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCritique();
  }, [critiqueId]);

  return {
    critique,
    loading,
    error
  };
};