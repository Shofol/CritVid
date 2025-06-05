import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Upload, Check, AlertCircle } from 'lucide-react';
import { createMuxUploadUrl, checkMuxAssetStatus } from '@/lib/mux';
import { VideoUploadState } from '@/types/muxTypes';

interface MuxVideoUploaderProps {
  onUploadComplete: (assetId: string, playbackUrl: string) => void;
  onUploadStart?: () => void;
}

const MuxVideoUploader: React.FC<MuxVideoUploaderProps> = ({
  onUploadComplete,
  onUploadStart
}) => {
  const [uploadState, setUploadState] = useState<VideoUploadState>({
    isUploading: false,
    progress: 0,
    error: undefined
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadIntervalRef = useRef<number | null>(null);

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
      });

      // Get a direct upload URL from Mux
      const { uploadUrl, uploadId } = await createMuxUploadUrl(file.name);
      
      setUploadState(prev => ({
        ...prev,
        uploadId,
        progress: 10,
      }));

      // Upload the file directly to Mux
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          // Calculate progress (10-90% range for upload)
          const uploadProgress = 10 + (event.loaded / event.total) * 80;
          setUploadState(prev => ({
            ...prev,
            progress: Math.round(uploadProgress)
          }));
        }
      });

      xhr.addEventListener('load', async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setUploadState(prev => ({
            ...prev,
            progress: 90,
          }));

          // Start polling for asset status
          await pollAssetStatus(uploadId);
        } else {
          setUploadState({
            isUploading: false,
            progress: 0,
            error: `Upload failed: ${xhr.statusText}`
          });
        }
      });

      xhr.addEventListener('error', () => {
        setUploadState({
          isUploading: false,
          progress: 0,
          error: 'Network error during upload'
        });
      });

      xhr.open('PUT', uploadUrl, true);
      xhr.send(file);

    } catch (error) {
      console.error('Error during upload:', error);
      setUploadState({
        isUploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Unknown error during upload'
      });
    }
  };

  const pollAssetStatus = async (uploadId: string) => {
    // Clear any existing interval
    if (uploadIntervalRef.current) {
      window.clearInterval(uploadIntervalRef.current);
    }

    // Poll every 2 seconds
    uploadIntervalRef.current = window.setInterval(async () => {
      try {
        const assetStatus = await checkMuxAssetStatus(uploadId);
        
        if (assetStatus.error) {
          throw new Error(assetStatus.error);
        }

        if (assetStatus.ready) {
          // Asset is ready, stop polling
          if (uploadIntervalRef.current) {
            window.clearInterval(uploadIntervalRef.current);
            uploadIntervalRef.current = null;
          }

          // Get the playback URL
          const playbackUrl = `https://stream.mux.com/${assetStatus.playbackIds[0].id}.m3u8`;

          // Update state and notify parent
          setUploadState({
            isUploading: false,
            progress: 100,
            assetId: uploadId,
            playbackUrl
          });

          onUploadComplete(uploadId, playbackUrl);
        } else {
          // Still processing, update progress (90-99% range for processing)
          setUploadState(prev => ({
            ...prev,
            progress: Math.min(99, 90 + Math.floor(Math.random() * 9))
          }));
        }
      } catch (error) {
        console.error('Error checking asset status:', error);
        if (uploadIntervalRef.current) {
          window.clearInterval(uploadIntervalRef.current);
          uploadIntervalRef.current = null;
        }

        setUploadState({
          isUploading: false,
          progress: 0,
          error: error instanceof Error ? error.message : 'Error processing video'
        });
      }
    }, 2000);
  };

  const handleRetry = () => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: undefined
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
            <span className="text-sm font-medium">
              {uploadState.progress < 90 ? 'Uploading...' : 'Processing...'}
            </span>
            <span className="text-sm">{uploadState.progress}%</span>
          </div>
          <Progress value={uploadState.progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {uploadState.progress < 90 
              ? 'Uploading your video to our servers...'
              : 'Processing your video for optimal playback...'}
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
            Your video has been uploaded and processed successfully.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default MuxVideoUploader;
