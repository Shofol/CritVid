import {
  ASSIGN_CRITIQUE_FUNCTION,
  GET_CRITIQUE_BY_ID_FUNCTION,
  GET_CRITIQUE_FEEDBACK_BY_ID_FUNCTION,
  SAVE_CRITIQUE_FEEDBACK_FUNCTION,
  UPDATE_CRITIQUE_FEEDBACK_FUNCTION,
} from "../config/constants";
import { supabase } from "../lib/supabase";
import { Critique, CritiqueFeedback } from "../types/critiqueTypes";
import { getAuthToken } from "./authUtils";

// Save critique record
export const assignCritique = async (
  userId: string,
  adjudicatorId: string,
  videoId: string,
  price: number
): Promise<{ success: boolean; critiqueId?: string; error?: string }> => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("No access token available");

    const response = await fetch(ASSIGN_CRITIQUE_FUNCTION, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        adjudicatorId,
        videoId: parseInt(videoId),
        price,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Failed to save critique");
    }

    return {
      success: true,
      critiqueId: result.critiqueId,
    };
  } catch (error) {
    console.error("Error saving critique:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get critiques using the new edge function
export const getCritiques = async (params?: {
  adjudicatorId?: string;
  userId?: string;
  status?: string;
}): Promise<Critique[]> => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("No access token available");

    const url = new URL(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-critiques`
    );

    if (params?.adjudicatorId) {
      url.searchParams.set("adjudicator_id", params.adjudicatorId);
    }
    if (params?.userId) {
      url.searchParams.set("user_id", params.userId);
    }
    if (params?.status) {
      url.searchParams.set("status", params.status);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch critiques");
    }

    return result.data || [];
  } catch (error) {
    console.error("Error fetching critiques:", error);
    throw error;
  }
};

// Get a single critique by ID
export const getCritiqueById = async (
  critiqueId: string
): Promise<Critique> => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("No access token available");

    const response = await fetch(
      `${GET_CRITIQUE_BY_ID_FUNCTION}/${critiqueId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch critique");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching critique:", error);
    throw error;
  }
};

// Legacy function for backward compatibility
export const getPendingCritiques = async (
  userId: string
): Promise<Critique[]> => {
  return getCritiques({ userId, status: "pending" });
};

// Get critiques for adjudicator
export const getAdjudicatorCritiques = async (
  adjudicatorId: string,
  status?: string
): Promise<Critique[]> => {
  return getCritiques({ adjudicatorId, status });
};

// Get all critiques for a user
export const getUserCritiques = async (userId: string): Promise<Critique[]> => {
  return getCritiques({ userId });
};

// Save critique feedback with video
export const saveCritiqueFeedback = async (
  userId: string,
  adjudicatorId: string,
  clientVideoId: number,
  critiqueId?: string,
  reviewId?: string,
  videoBlob?: Blob,
  audioBlob?: Blob,
  exercises?: string,
  suggestions?: string,
  transcription?: string,
  note?: string
): Promise<{
  success: boolean;
  feedbackId?: string;
  feedbackVideoId?: number;
  error?: string;
}> => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("No access token available");

    // Step 1: Save feedback data first to get the feedback ID
    console.log("📝 Saving feedback data...");
    const response = await fetch(SAVE_CRITIQUE_FEEDBACK_FUNCTION, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        adjudicatorId,
        clientVideoId,
        critiqueId,
        reviewId,
        exercises,
        suggestions,
        transcription,
        note,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Failed to save critique feedback");
    }

    const feedbackId = result.feedbackId;
    console.log("✅ Feedback saved with ID:", feedbackId);

    let feedbackVideoId: number | undefined;

    // Step 2: Upload video to storage if provided, using feedback ID as filename
    if (videoBlob && audioBlob) {
      try {
        console.log("📹 Uploading video to storage...");

        // Use feedback ID as filename
        const fileName = `${feedbackId}.webm`;
        const audioFileName = `${feedbackId}.mp3`;

        // Upload to dance-critiques bucket
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("dance-critiques")
          .upload(fileName, videoBlob, {
            cacheControl: "3600",
            upsert: false,
            contentType: "video/webm",
          });

        if (uploadError) {
          console.error("Error uploading video:", uploadError);
          throw uploadError;
        }

        console.log("✅ Video uploaded successfully:", uploadData.path);

        const { data: audioUploadData, error: audioUploadError } =
          await supabase.storage
            .from("dance-critiques")
            .upload(audioFileName, audioBlob, {
              cacheControl: "3600",
              upsert: false,
              contentType: "audio/mp3",
            });
        if (audioUploadError) {
          console.error("Error uploading audio:", audioUploadError);
          throw audioUploadError;
        }
        console.log("✅ Audio uploaded successfully:", audioUploadData.path);

        // Create a record in the critique_videos table
        const { data: videoRecordData, error: videoError } = await supabase
          .from("critique_videos")
          .insert([
            {
              file_name: fileName,
              file_path: uploadData.path,
              file_size: videoBlob.size,
              file_type: "video/webm",
              audio_file_name: audioFileName,
              audio_file_path: audioUploadData.path,
              audio_file_size: audioBlob.size,
              audio_file_type: "audio/mp3",
              user_id: userId,
              adjudicator_id: adjudicatorId,
            },
          ])
          .select();

        if (videoError) {
          console.error("Error creating video record:", videoError);
          throw videoError;
        }
        feedbackVideoId = videoRecordData[0].id;
        console.log("✅ Created video record with ID:", feedbackVideoId);

        // Step 3: Update the feedback record with the video ID
        const { error: updateError } = await supabase
          .from("critiques_feedback")
          .update({
            feedback_video_id: feedbackVideoId,
          })
          .eq("id", feedbackId);

        if (updateError) {
          console.error("Error updating feedback with video ID:", updateError);
          throw updateError;
        }

        console.log("✅ Updated feedback record with video ID");
      } catch (videoError) {
        console.error("Error in video upload process:", videoError);
        // Continue without video if upload fails
        console.log(
          "⚠️ Video upload failed, but feedback was saved successfully"
        );
      }
    }

    return {
      success: true,
      feedbackId: feedbackId,
      feedbackVideoId: feedbackVideoId,
    };
  } catch (error) {
    console.error("Error saving critique feedback:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get critique feedback by ID with all foreign key data
export const getCritiqueFeedbackById = async (
  feedbackId: string
): Promise<{
  success: boolean;
  data?: CritiqueFeedback;
  error?: string;
}> => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("No access token available");

    const response = await fetch(
      `${GET_CRITIQUE_FEEDBACK_BY_ID_FUNCTION}/${feedbackId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch critique feedback");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Error fetching critique feedback:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Update critique feedback
export const updateCritiqueFeedback = async (
  feedbackId: string,
  exercises?: string,
  suggestions?: string,
  transcription?: string,
  note?: string
): Promise<{
  success: boolean;
  feedbackId?: string;
  error?: string;
}> => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("No access token available");

    console.log("📝 Updating feedback data...");
    const response = await fetch(UPDATE_CRITIQUE_FEEDBACK_FUNCTION, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        feedbackId,
        exercises,
        suggestions,
        transcription,
        note,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Failed to update critique feedback");
    }

    console.log("✅ Feedback updated successfully:", result.feedbackId);

    return {
      success: true,
      feedbackId: result.feedbackId,
    };
  } catch (error) {
    console.error("Error updating critique feedback:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
