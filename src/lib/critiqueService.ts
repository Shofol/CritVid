import {
  ASSIGN_CRITIQUE_FUNCTION,
  GET_CRITIQUE_BY_ID_FUNCTION,
} from "../config/constants";
import { Critique } from "../types/critiqueTypes";
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
