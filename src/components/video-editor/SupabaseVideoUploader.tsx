import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Upload, Check, AlertCircle } from 'lucide-react';
import { uploadVideo, getSignedUrl, VIDEO_UPLOADS_BUCKET } from '@/lib/storage';

interface SupabaseVideoUploaderProps {
  onUploadComplete: (filePath: string, signedUrl: string) => void;
  onUploadStart?: () => void;
  userId?: string; // Optional user ID for organizing uploads
}

const SupabaseVideoUploader: React.FC<SupabaseVideoUploaderProps> = ({
  onUploadComplete,
  onUploadStart,
  userId
}) => {
  const [uploadState, setUploadState] = useState({
    isUploading: false,
    progress: 0,
    error: undefined as string | undefined,
    filePath: undefined as string | undefined,
    signedUrl: undefined as string | undefined
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Notify parent component that upload is starting
      if (onUploadStart) {
        onUploadStart();
      }

      // Update state to show upload is starting
      setUploadState({
        isUploading: true,
        progress: 0,
        error: undefined,
        filePath: undefined,
        signedUrl: undefined
      });

      // Create a folder path using userId if available
      const folderPath = userId ? `user_${userId}` : 'uploads';
      
      // Set up upload tracking with XHR to monitor progress
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const uploadProgress = (event.loaded / event.total) * 100;
          setUploadState(prev => ({
            ...prev,
            progress: Math.round(uploadProgress)
          }));
        }
      });

      // Perform the actual upload
      const filePath = await uploadVideo(file, folderPath);
      
      // Get a signed URL for the uploaded file
      const signedUrl = await getSignedUrl(VIDEO_UPLOADS_BUCKET, filePath);

      // Update state and notify parent
      setUploadState({
        isUploading: false,
        progress: 100,
        error: undefined,
        filePath,
        signedUrl
      });

      onUploadComplete(filePath, signedUrl);
    } catch (error) {
      console.error('Error during upload:', error);
      setUploadState({
        isUploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Unknown error during upload',
        filePath: undefined,
        signedUrl: undefined
      });
    }
  };

  const handleRetry = () => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: undefined,
      filePath: undefined,
      signedUrl: undefined
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full space-y-4">
      {!uploadState.isUploading && !uploadState.error && uploadState.progress < 100 && (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <h3 className="font-medium">Upload your dance video</h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop or click to select a video file
            </p>
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              className="mt-2"
            >
              Select Video
            </Button>
          </div>
        </div>
      )}

      {uploadState.isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Uploading...</span>
            <span className="text-sm">{uploadState.progress}%</span>
          </div>
          <Progress value={uploadState.progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Uploading your video to secure storage...
          </p>
        </div>
      )}

      {uploadState.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Upload Failed</AlertTitle>
          <AlertDescription>
            {uploadState.error}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetry}
              className="mt-2 w-full"
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {uploadState.progress === 100 && (
        <Alert variant="default" className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900 dark:text-green-400">
          <Check className="h-4 w-4" />
          <AlertTitle>Upload Complete</AlertTitle>
          <AlertDescription>
            Your video has been uploaded successfully.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SupabaseVideoUploader;