import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StandardVideoPlayer from '@/components/StandardVideoPlayer';

export default function VideoPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Demo video URL - replace with actual video source
  const videoSrc = "https://d64gsuwffb70l.cloudfront.net/6823bfb42897122395a1a2c7_1748919902805_4f0678d3.png";
  
  // For demo purposes, we'll use a sample video URL
  const demoVideoSrc = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Video Player</CardTitle>
          </CardHeader>
          <CardContent>
            <StandardVideoPlayer
              src={demoVideoSrc}
              title={`Video ${id || '1'}`}
              className="aspect-video w-full"
            />
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Video Information</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Video ID:</strong> {id || '1'}</p>
                <p><strong>Format:</strong> MP4</p>
                <p><strong>Quality:</strong> HD</p>
                <p><strong>Status:</strong> Ready to play</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}