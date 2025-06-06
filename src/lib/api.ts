import { getAuthToken } from "./authUtils";

export interface AdjudicatorProfile {
  id?: string;
  user_id?: string;
  full_name: string;
  credentials: string;
  biography?: string;
  headshot_url?: string;
  years_experience?: string;
  accreditations?: string[];
  social_media?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    website?: string;
    [key: string]: string | undefined;
  };
  dance_styles?: string[];
  price?: number;
  expected_turnaround?: number;
  rating?: number;
  total_critiques?: number;
  total_earnings?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  last_updated?: string;
}

// Get the adjudicator profile
export const getAdjudicatorProfile = async (
  userId?: string
): Promise<AdjudicatorProfile | null> => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("No access token available");

    const url = new URL(
      "https://tasowytszirhdvdiwuia.supabase.co/functions/v1/7b5389d0-b6f3-4881-91c5-ce003858a30a"
    );
    if (userId) {
      url.searchParams.append("userId", userId);
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
      throw new Error(result.error || "Failed to fetch profile");
    }

    return result.profile;
  } catch (error) {
    console.error("Error fetching adjudicator profile:", error);
    throw error;
  }
};

// Update the adjudicator profile
export const updateAdjudicatorProfile = async (
  profile: AdjudicatorProfile
): Promise<AdjudicatorProfile> => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("No access token available");

    const response = await fetch(
      "https://tasowytszirhdvdiwuia.supabase.co/functions/v1/0627b4c6-b5d9-49dd-8e6e-45e128967d68",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile }),
      }
    );

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Failed to update profile");
    }

    return result.profile;
  } catch (error) {
    console.error("Error updating adjudicator profile:", error);
    throw error;
  }
};

// Save audio critique
export const saveAudioCritique = async (audioBlob: Blob, videoId: string) => {
  try {
    // For now, we'll implement a simple version that saves to localStorage
    // In a real implementation, this would upload to Supabase storage
    const audioUrl = URL.createObjectURL(audioBlob);

    // Save blob data to localStorage (this is just for demo purposes)
    // In production, we would upload to a server/storage
    const reader = new FileReader();

    return new Promise<{ success: boolean; url?: string; error?: string }>(
      (resolve) => {
        reader.onloadend = () => {
          try {
            // Store the base64 data
            localStorage.setItem(
              `audio_data_${videoId}`,
              reader.result as string
            );
            localStorage.setItem(
              `last_saved_${videoId}`,
              new Date().toISOString()
            );

            // Get existing recordings or create new array
            const existingData = localStorage.getItem(`recordings_${videoId}`);
            const recordings = existingData ? JSON.parse(existingData) : [];

            // Add new recording URL
            recordings.push(audioUrl);

            // Save updated recordings list
            localStorage.setItem(
              `recordings_${videoId}`,
              JSON.stringify(recordings)
            );

            resolve({
              success: true,
              url: audioUrl,
            });
          } catch (e) {
            console.error("Error saving to localStorage:", e);
            resolve({
              success: false,
              error: "Failed to save recording to local storage",
            });
          }
        };

        reader.onerror = () => {
          resolve({
            success: false,
            error: "Error reading audio data",
          });
        };

        reader.readAsDataURL(audioBlob);
      }
    );
  } catch (error) {
    console.error("Error in saveAudioCritique:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
};

// Generate exercise suggestions using AI
export const generateExerciseSuggestions = async (
  prompt: string
): Promise<string[]> => {
  try {
    // Call our Supabase Edge Function
    const response = await fetch(
      "https://tasowytszirhdvdiwuia.supabase.co/functions/v1/c0d997fb-829c-4cc4-8b38-66b44f21e3f6",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.text();
    try {
      const jsonData = JSON.parse(data);
      return jsonData.suggestions || [];
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError, "Raw response:", data);
      return [];
    }
  } catch (error) {
    console.error("Error generating suggestions:", error);
    // Fallback to mock data if the API call fails
    return [
      "Practice relevé in parallel position to strengthen ankles",
      "Focus on core engagement during pirouettes",
      "Work on port de bras with resistance bands",
      "Practice petit allegro to improve quick footwork",
      "Try balance exercises on a balance board",
    ];
  }
};

// Save video critique draft
export const saveVideoCritiqueDraft = async (draft: {
  videoId: string;
  notes: string;
  timestamps: { time: number; note: string }[];
  audioUrls: string[];
}) => {
  try {
    // In a real app, this would save to a database
    // For demo purposes, we'll use localStorage
    const draftData = {
      ...draft,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      `critique_draft_${draft.videoId}`,
      JSON.stringify(draftData)
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error saving draft:", error);
    return {
      success: false,
      error: "Failed to save draft",
    };
  }
};

// Load video critique draft
export const loadVideoCritiqueDraft = (videoId: string) => {
  try {
    const draftData = localStorage.getItem(`critique_draft_${videoId}`);
    if (!draftData) return null;

    return JSON.parse(draftData);
  } catch (error) {
    console.error("Error loading draft:", error);
    return null;
  }
};
