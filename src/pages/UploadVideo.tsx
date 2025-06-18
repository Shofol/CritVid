import { AppLayout } from "@/components/AppLayout";
import VideoUploadForm from "@/components/client/VideoUploadForm";
import { toast } from "@/components/ui/use-toast";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UploadVideo: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a pre-selected adjudicator from the assignment flow
    const selectedAdjudicatorId = sessionStorage.getItem(
      "selectedAdjudicatorId"
    );
    const selectedAdjudicatorName = sessionStorage.getItem(
      "selectedAdjudicatorName"
    );

    if (selectedAdjudicatorId && selectedAdjudicatorName) {
      toast({
        title: "Adjudicator Pre-selected",
        description: `Your video will be automatically sent to ${selectedAdjudicatorName} after upload.`,
      });
    }
  }, []);

  const handleUploadSuccess = (videoId: string) => {
    // Check if there's a pre-selected adjudicator
    const selectedAdjudicatorId = sessionStorage.getItem(
      "selectedAdjudicatorId"
    );
    const selectedAdjudicatorName = sessionStorage.getItem(
      "selectedAdjudicatorName"
    );

    if (selectedAdjudicatorId) {
      // Auto-assign video to the pre-selected adjudicator
      toast({
        title: "Video Uploaded & Assigned",
        description: `Your video has been uploaded and sent to ${selectedAdjudicatorName} for critique.`,
      });

      // Clear the session storage
      sessionStorage.removeItem("selectedAdjudicatorId");
      sessionStorage.removeItem("selectedAdjudicatorName");
    } else {
      toast({
        title: "Video Uploaded",
        description: "Your video has been uploaded successfully.",
      });
    }

    // Navigate to video library
    navigate("/video-library");
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Upload Video</h1>
        <VideoUploadForm onUploadSuccess={handleUploadSuccess} />
      </div>
    </AppLayout>
  );
};

export default UploadVideo;
