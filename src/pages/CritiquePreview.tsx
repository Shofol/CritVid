import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import PlaybackPreviewPlayer from '@/components/PlaybackPreviewPlayer';
import CritiqueFeedbackPanel from '@/components/CritiqueFeedbackPanel';
import PaymentStatusBar from '@/components/client/PaymentStatusBar';
import CritiquePaymentActions from '@/components/client/CritiquePaymentActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { CritiquePaymentStatus } from '@/lib/paymentService';

interface TimelineEvent {
  timestamp: number;
  type: 'pause' | 'play' | 'drawing';
  duration?: number;
  data?: any;
}

const CritiquePreview: React.FC = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [drawActions, setDrawActions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<CritiquePaymentStatus | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const loadCritiqueData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call to load critique data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setVideoUrl('https://www.w3schools.com/html/mov_bbb.mp4');
        setAudioUrl('https://www.soundjay.com/misc/sounds/bell-ringing-05.wav');
        
        setTimelineEvents([
          { timestamp: 10, type: 'pause', duration: 3 },
          { timestamp: 25, type: 'pause', duration: 2 },
          { timestamp: 40, type: 'pause', duration: 4 }
        ]);
        
        setDrawActions([
          {
            timestamp: 12,
            type: 'draw',
            points: [{ x: 100, y: 100 }, { x: 150, y: 150 }],
            style: { color: 'red', lineWidth: 3 }
          },
          {
            timestamp: 27,
            type: 'draw', 
            points: [{ x: 200, y: 200 }, { x: 250, y: 180 }],
            style: { color: 'blue', lineWidth: 2 }
          }
        ]);
        
        // Mock payment status - change to 'approved' to test approved state
        setPaymentStatus({
          id: `critique-${videoId}`,
          payment_status: 'pending_approval',
          auto_approved: false,
          disputed: false
        });
        
      } catch (err) {
        setError('Failed to load critique data');
        console.error('Error loading critique:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCritiqueData();
  }, [videoId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleDownload = () => {
    console.log('Download critique');
  };

  const handleShare = () => {
    console.log('Share critique');
  };

  const handlePaymentApproval = () => {
    setPaymentStatus(prev => prev ? {
      ...prev,
      payment_status: 'approved',
      payment_released_at: new Date().toISOString()
    } : null);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading critique preview...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto p-6">
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={handleBack} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const isPending = paymentStatus?.payment_status === 'pending_approval';

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={handleBack} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Critique Preview</h1>
              <p className="text-gray-600">Video ID: {videoId || 'demo'}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleShare} variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button onClick={handleDownload} size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        {/* Payment Status Bar */}
        <PaymentStatusBar paymentStatus={paymentStatus} />
        
        {/* Payment Action Buttons */}
        {isPending && (
          <CritiquePaymentActions 
            critiqueId={`critique-${videoId}`}
            onApproval={handlePaymentApproval}
          />
        )}

        {/* Video Player */}
        <Card>
          <CardHeader>
            <CardTitle>Critique Playback</CardTitle>
          </CardHeader>
          <CardContent>
            <PlaybackPreviewPlayer
              videoUrl={videoUrl}
              audioUrl={audioUrl}
              timelineEvents={timelineEvents}
              drawActions={drawActions}
            />
          </CardContent>
        </Card>

        {/* Written Feedback Panel */}
        <CritiqueFeedbackPanel
          audioUrl={audioUrl}
          videoId={videoId}
          critiqueId={`critique-${videoId}`}
        />
      </div>
    </AppLayout>
  );
};

export default CritiquePreview;