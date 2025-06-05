import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Play, Upload, ArrowLeft } from 'lucide-react';
import { mockData } from '@/data/mockData';
import { mockAdjudicatorData } from '@/data/mockAdjudicatorData';

const ThankYou: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const videoId = searchParams.get('video');
  const adjudicatorId = searchParams.get('adjudicator');
  
  const video = mockData.videos.find(v => v.id === videoId);
  const adjudicator = mockAdjudicatorData.find(a => a.id === adjudicatorId);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Your video has been sent for critique. You'll receive an email confirmation shortly.
          </p>
        </div>

        {video && adjudicator && (
          <div className="space-y-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <Play className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{video.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {video.danceStyle} • Sent to {adjudicator.name}
                    </p>
                    <Badge variant="outline" className="mt-1">Pending Critique</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Adjudicator:</span>
                    <p className="font-medium">{adjudicator.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Critique Fee:</span>
                    <p className="font-medium">${adjudicator.rate}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Expected Turnaround:</span>
                    <p className="font-medium">2-3 business days</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Paid:</span>
                    <p className="font-medium">${(adjudicator.rate + 2.5).toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Video Sent</p>
                    <p className="text-sm text-muted-foreground">
                      Your video has been securely sent to {adjudicator.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Critique in Progress</p>
                    <p className="text-sm text-muted-foreground">
                      The adjudicator will review and provide detailed feedback
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-semibold text-gray-600">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Receive Critique</p>
                    <p className="text-sm text-muted-foreground">
                      You'll be notified when your critique is ready to view
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={() => navigate('/video-library')} 
            variant="outline" 
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to My Videos
          </Button>
          <Button 
            onClick={() => navigate('/upload-video')} 
            className="flex-1"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Another Video
          </Button>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-sm text-blue-800">
            <strong>Need help?</strong> Contact our support team at support@critvid.com
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default ThankYou;