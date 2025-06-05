import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { videoUploadService } from '@/lib/videoUploadService';
import { supabase } from '@/lib/supabase';

const EnhancedVideoUploadForm: React.FC = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [danceStyle, setDanceStyle] = useState('');
  const [feedback, setFeedback] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || !title || !danceStyle) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields and upload a video",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(10);
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      const isAuthenticated = !!userData?.user?.id;
      
      if (!isAuthenticated) {
        toast({
          title: "Demo Mode Active",
          description: "You're not signed in. Video will be uploaded in demo mode and may not be permanently saved.",
          variant: "default"
        });
        
        const demoUserId = 'demo-user-' + Math.random().toString(36).substring(2, 9);
        localStorage.setItem('demoUserId', demoUserId);
      }
      
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 5;
          return newProgress < 90 ? newProgress : prev;
        });
      }, 500);
      
      const videoId = await videoUploadService.uploadVideo({
        title,
        danceStyle,
        feedback,
        videoFile
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast({
        title: "Video uploaded successfully",
        description: isAuthenticated 
          ? "Redirecting to critique editor..." 
          : "Your video was uploaded in demo mode. Redirecting to editor...",
      });
      
      // Reset form
      setVideoFile(null);
      setTitle('');
      setDanceStyle('');
      setFeedback('');
      setUploadProgress(0);
      
      // Redirect directly to PlaybackTracker with the video ID
      navigate(`/critique-editor/${videoId}`);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Video for Critique</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="video">Video File</Label>
            <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center">
              {videoFile ? (
                <div className="space-y-2">
                  <p className="font-medium">{videoFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setVideoFile(null)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10 text-muted-foreground mb-2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <p className="mb-2 font-medium">Drag and drop your video here</p>
                  <p className="text-sm text-muted-foreground mb-2">MP4, MOV or AVI up to 500MB</p>
                  <Input
                    id="video"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('video')?.click()}>
                    Browse Files
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              placeholder="e.g., Ballet Variation" 
              required 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="danceStyle">Dance Style</Label>
            <Select value={danceStyle} onValueChange={setDanceStyle}>
              <SelectTrigger>
                <SelectValue placeholder="Select dance style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ballet">Ballet</SelectItem>
                <SelectItem value="Contemporary">Contemporary</SelectItem>
                <SelectItem value="Jazz">Jazz</SelectItem>
                <SelectItem value="Hip Hop">Hip Hop</SelectItem>
                <SelectItem value="Tap">Tap</SelectItem>
                <SelectItem value="Ballroom">Ballroom</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="feedback">Are you looking for specific feedback? Mention it here.</Label>
            <Textarea 
              id="feedback" 
              placeholder="e.g., I'd like feedback on my technique and expression" 
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
          
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <p className="text-sm text-center mt-1">{uploadProgress}% Uploaded</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button type="submit" disabled={isUploading} className="w-full">
            {isUploading ? 'Uploading...' : 'Submit for Critique'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EnhancedVideoUploadForm;