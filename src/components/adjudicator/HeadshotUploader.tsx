import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface HeadshotUploaderProps {
  currentUrl?: string;
  onUploadComplete?: (url: string) => void;
}

const HeadshotUploader: React.FC<HeadshotUploaderProps> = ({ currentUrl, onUploadComplete }) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (currentUrl) {
      setPreviewUrl(currentUrl);
    }
  }, [currentUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file.',
        variant: 'destructive',
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    // Create a preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    setIsUploading(true);

    try {
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `headshots/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('headshots')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data } = supabase.storage
        .from('headshots')
        .getPublicUrl(filePath);

      if (onUploadComplete && data.publicUrl) {
        onUploadComplete(data.publicUrl);
      }

      toast({
        title: 'Upload successful',
        description: 'Your headshot has been uploaded.',
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your headshot. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {previewUrl ? (
        <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-primary">
          <img 
            src={previewUrl} 
            alt="Headshot preview" 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-40 h-40 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground">
          <span className="text-muted-foreground text-sm text-center px-2">
            No headshot uploaded
          </span>
        </div>
      )}
      
      <div className="flex flex-col items-center space-y-2 w-full">
        <Button
          variant="outline"
          onClick={() => document.getElementById('headshot-upload')?.click()}
          disabled={isUploading}
          className="w-full"
        >
          {isUploading ? 'Uploading...' : previewUrl ? 'Change Headshot' : 'Upload Headshot'}
        </Button>
        <input
          id="headshot-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
        <p className="text-xs text-muted-foreground text-center">
          Upload a professional headshot (JPG, PNG). <br />
          Max size: 5MB
        </p>
      </div>
    </div>
  );
};

export default HeadshotUploader;
