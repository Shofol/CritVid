import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useRef, useState } from "react";

interface HeadshotUploaderProps {
  currentUrl?: string;
  onUploadComplete?: (url: string, file: File) => void;
}

const HeadshotUploader: React.FC<HeadshotUploaderProps> = ({
  currentUrl,
  onUploadComplete,
}) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const headshotInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUrl) {
      setPreviewUrl(currentUrl);
    }
  }, [currentUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Create a preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    setIsUploading(true);

    try {
      // Convert image to JPEG if it's not already
      let processedFile = file;
      if (!file.type.includes("jpeg") && !file.type.includes("jpg")) {
        const img = new Image();
        img.src = objectUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);

        // Convert to JPEG
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
            },
            "image/jpeg",
            0.9
          );
        });
        processedFile = new File(
          [blob],
          file.name.replace(/\.[^/.]+$/, ".jpg"),
          {
            type: "image/jpeg",
          }
        );
      }

      if (onUploadComplete) {
        onUploadComplete(objectUrl, processedFile);
      }

      toast({
        title: "Image processed",
        description:
          "Your headshot has been processed and is ready for upload.",
      });
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Processing failed",
        description:
          "There was an error processing your headshot. Please try again.",
        variant: "destructive",
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
        <button
          onClick={() => {
            headshotInputRef.current.click();
          }}
          className="w-40 h-40 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground"
        >
          <span className="text-muted-foreground text-sm text-center px-2">
            No headshot uploaded
          </span>
        </button>
      )}

      <div className="flex flex-col items-center space-y-2 max-w-2xl">
        <Button
          variant="outline"
          onClick={() => {
            headshotInputRef.current.click();
          }}
          disabled={isUploading}
          className="w-full"
        >
          {isUploading
            ? "Processing..."
            : previewUrl
            ? "Change Headshot"
            : "Upload Headshot"}
        </Button>
        <input
          ref={headshotInputRef}
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
