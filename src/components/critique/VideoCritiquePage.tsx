import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockVideoSubmissions, mockCritiques } from '@/data/mockData';
import CritiquePlayer from '@/components/critique/CritiquePlayer';

interface VideoCritiquePageProps {
  submissionId?: string;
}

const VideoCritiquePage: React.FC<VideoCritiquePageProps> = ({ submissionId = '1' }) => {
  // Find the selected video submission
  const videoSubmission = mockVideoSubmissions.find(v => v.id === submissionId);
  
  // Find any critiques for this submission
  const critiques = mockCritiques.filter(c => c.submissionId === submissionId);
  
  if (!videoSubmission) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Video Not Found</h2>
        <p className="text-muted-foreground">The requested video submission could not be found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{videoSubmission.title}</h1>
          <p className="text-muted-foreground">{videoSubmission.danceStyle} • Submitted on {new Date(videoSubmission.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm capitalize">
          Status: {videoSubmission.status}
        </div>
      </div>

      <Tabs defaultValue="original" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="original">Original Video</TabsTrigger>
          <TabsTrigger value="critique" disabled={critiques.length === 0}>
            Critique {critiques.length === 0 && "(Pending)"}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="original">
          <Card>
            <CardContent className="p-6">
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center relative overflow-hidden">
                <video 
                  controls 
                  className="w-full h-full object-cover"
                  poster="/placeholder.svg"
                >
                  <source src={videoSubmission.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Feedback Requested</h3>
                  <p className="text-muted-foreground">{videoSubmission.feedbackRequested}</p>
                </div>
                
                {videoSubmission.status === 'pending' && (
                  <div className="rounded-md bg-muted p-4">
                    <p className="text-sm">Your video is waiting to be assigned to an adjudicator. You'll receive a notification when the critique is ready.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="critique">
          {critiques.length > 0 ? (
            <CritiquePlayer critique={critiques[0]} />
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p>No critique available yet. Check back later.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VideoCritiquePage;