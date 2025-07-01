import { SAVE_VIDEO_FUNCTION } from "../config/constants";
import { getAuthToken } from "./authUtils";
import { supabase } from "./supabase";

/**
 * Interface for video upload data
 */
export interface VideoUploadData {
  title: string;
  danceStyle: string;
  feedback?: string;
  videoFile: File;
  duration: number;
  size: number;
}

/**
 * Service for handling video uploads to Supabase
 */
export const videoUploadService = {
  /**
   * Upload a video file to Supabase storage
   * @param data The video upload data including file and metadata
   * @returns The uploaded video ID
   */
  uploadVideo: async (data: VideoUploadData): Promise<string> => {
    try {
      // Get the current user
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      const userId = userData?.user?.id;

      // For authenticated users, use the edge function approach
      const timestamp = new Date().getTime();
      const fileExt = data.videoFile.name.split(".").pop();
      const fileName = `${timestamp}-${data.videoFile.name.substring(
        0,
        20
      )}.${fileExt}`;

      const response = await fetch(SAVE_VIDEO_FUNCTION, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify({
          title: data.title,
          danceStyle: data.danceStyle,
          feedback: data.feedback,
          fileName,
          userId,
          duration: data.duration,
          size: data.size,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create video record");
      }

      if (result.uploadUrl) {
        const uploadResponse = await fetch(result.uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": data.videoFile.type,
          },
          body: data.videoFile,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload video file");
        }
      }

      return result.videoId;
    } catch (error) {
      console.error("Error uploading video:", error);
      throw error;
    }
  },

  /**
   * Get a list of videos for the current user
   * @returns Array of user videos
   */
  getUserVideos: async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      if (!userId) {
        console.warn("No authenticated user found, checking for demo videos");
        const demoUserId = localStorage.getItem("demoUserId");

        if (demoUserId) {
          const { data, error } = await supabase
            .from("videos")
            .select("*")
            .eq("user_id", demoUserId)
            .order("created_at", { ascending: false });

          if (error) throw error;
          return Array.isArray(data) ? data : [];
        }

        return [];
      }

      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching user videos:", error);
      return [];
    }
  },
};
