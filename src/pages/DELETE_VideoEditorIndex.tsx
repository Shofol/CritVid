import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

// DEPRECATED: This page is no longer used in the unified critique system
// Use PlaybackTrackerPage.tsx instead

const DELETE_VideoEditorIndex: React.FC = () => {
  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            <h1 className="text-3xl font-bold">Video Editor Index (Deprecated)</h1>
          </div>
          
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <p className="text-amber-800 font-medium">
                  ⚠️ This video editor index has been deprecated.
                </p>
                <p className="text-amber-700">
                  All video editing functionality has been consolidated into the unified PlaybackTracker system.
                </p>
                <div className="pt-2">
                  <Button 
                    onClick={() => window.location.href = '/critique-editor'}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Go to Critique Studio
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default DELETE_VideoEditorIndex;