import { GENERATE_DANCE_SUGGESTIONS_FUNCTION } from "../config/constants";
import { getAuthToken } from "./authUtils";

export interface Suggestion {
  description: string;
}

export interface SuggestionRequest {
  transcription: string;
  danceStyle: string;
  requestedNumber: number;
}

export interface SuggestionResponse {
  success: boolean;
  suggestions?: Suggestion[];
  error?: string;
  details?: string;
}

export const generateDanceSuggestions = async (
  transcription: string,
  danceStyle: string,
  requestedNumber: number = 5
): Promise<SuggestionResponse> => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("No access token available");

    const response = await fetch(GENERATE_DANCE_SUGGESTIONS_FUNCTION, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transcription,
        danceStyle,
        requestedNumber,
      } as SuggestionRequest),
    });

    const result = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: "Failed to generate suggestions",
        details: result.error || "Suggestion generation function failed",
      };
    }

    return result as SuggestionResponse;
  } catch (err) {
    console.error("Suggestion generation service error:", err);
    return {
      success: false,
      error: "Failed to generate suggestions",
      details: err instanceof Error ? err.message : "Unknown error",
    };
  }
};
