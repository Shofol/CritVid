import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Mic, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Completely redesigned to be an informational card with direct links instead of a toggle
const PrivateCritiqueToggle: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Edit Video Tools</CardTitle>
        <CardDescription>
          Create private critiques for your students using our video editing tools
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-md">
              <Pencil className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Drawing Tools</h4>
                <p className="text-sm text-muted-foreground">Annotate videos with drawings</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-md">
              <Mic className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Voice Recording</h4>
                <p className="text-sm text-muted-foreground">Record audio feedback</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-md">
              <Download className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Save Locally</h4>
                <p className="text-sm text-muted-foreground">Download critiques to your device</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-md">
              <Share2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Share with Students</h4>
                <p className="text-sm text-muted-foreground">Send critiques directly to students</p>
              </div>
            </div>
          </div>
          
          <Button asChild className="w-full mt-4">
            <Link to="/video-editor">Open Video Editor</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivateCritiqueToggle;
