import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { videoUploadService } from "@/lib/videoUploadService";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DanceStyle } from "../../types/videoLibrary";

const VideoUploadForm: React.FC = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [size, setSize] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [danceStyle, setDanceStyle] = useState("");
  const [danceStyleName, setDanceStyleName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [danceStyles, setDanceStyles] = useState<DanceStyle[]>([]);

  useEffect(() => {
    const fetchDanceStyles = async () => {
      const { data, error } = await supabase.from("dance_styles").select("*");
      if (error) {
        console.error("Error fetching dance styles:", error);
      }
      setDanceStyles(data);
    };
    fetchDanceStyles();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Set file size in bytes
      setSize(file.size);

      // Get video duration
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        setDuration(video.duration);
      };

      video.src = URL.createObjectURL(file);
      setVideoFile(file);
    }
  };

  const handleDanceStyleChange = (value: string) => {
    const selectedStyle = danceStyles.find((style) => style.id === value);
    if (selectedStyle) {
      setDanceStyle(selectedStyle.id);
      setDanceStyleName(selectedStyle.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || !title || !danceStyle) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields and upload a video",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const isAuthenticated = !!userData?.user?.id;

      if (!isAuthenticated) {
        return;
      }

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 5;
          return newProgress < 90 ? newProgress : prev;
        });
      }, 500);

      const videoId = await videoUploadService.uploadVideo({
        title,
        danceStyle,
        feedback,
        videoFile,
        duration,
        size,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast({
        title: "Video uploaded successfully",
        description: isAuthenticated
          ? "Redirecting to dashboard..."
          : "Your video was uploaded in demo mode. Redirecting to editor...",
      });

      // Reset form
      setVideoFile(null);
      setTitle("");
      setDanceStyle("");
      setDanceStyleName("");
      setFeedback("");
      setUploadProgress(0);

      // Redirect directly to PlaybackTracker with the video ID
      navigate(`/dashboard`);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
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
                    File Size: {(size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Duration: {Math.floor(duration / 60)}:
                    {(duration % 60).toFixed(0).padStart(2, "0")}
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
                  <p className="mb-2 font-medium">
                    Drag and drop your video here
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    MP4, MOV or AVI up to 500MB
                  </p>
                  <Input
                    id="video"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("video")?.click()}
                  >
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
            <Select value={danceStyle} onValueChange={handleDanceStyleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select dance style">
                  {danceStyleName}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {danceStyles.map((item) => {
                  return (
                    <SelectItem value={item.id} key={item.id}>
                      {item.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">
              Are you looking for specific feedback? Mention it here.
            </Label>
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
              <p className="text-sm text-center mt-1">
                {uploadProgress}% Uploaded
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button type="submit" disabled={isUploading} className="w-full">
            {isUploading ? "Uploading..." : "Submit for Critique"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default VideoUploadForm;
