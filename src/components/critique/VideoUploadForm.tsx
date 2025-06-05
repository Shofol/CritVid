import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockVideoSubmissions } from '@/data/mockData';
import { toast } from '@/components/ui/use-toast';

const VideoUploadForm: React.FC = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [danceStyle, setDanceStyle] = useState('');
  const [feedback, setFeedback] = useState('');
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
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
    
    // Simulate upload process and add to mock data
    setTimeout(() => {
      // Create a mock video URL
      const mockVideoUrl = URL.createObjectURL(videoFile);
      
      // In a real app, you would upload to storage and save to database
      // For now, we'll just add to our mock data
      const newVideoId = (parseInt(mockVideoSubmissions[mockVideoSubmissions.length - 1].id) + 1).toString();
      
      // Add to mock data (in a real app this would be a database call)
      mockVideoSubmissions.push({
        id: newVideoId,
        dancerId: '1', // Assuming current user
        title,
        danceStyle,
        videoUrl: mockVideoUrl,
        feedbackRequested: feedback,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      
      setIsUploading(false);
      
      // Show success message
      toast({
        title: "Video uploaded successfully",
        description: "Your video has been submitted for critique",
      });
      
      // Reset form
      setVideoFile(null);
      setTitle('');
      setDanceStyle('');
      setFeedback('');
      
      // Redirect to dashboard to see the new video
      navigate('/dashboard');
    }, 2000);
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Video for Critique</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Video Upload */}
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
          
          {/* Title */}
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
          
          {/* Dance Style */}
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
          
          {/* Feedback Requested */}
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
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isUploading} className="w-full">
            {isUploading ? 'Uploading...' : 'Submit for Critique'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default VideoUploadForm;