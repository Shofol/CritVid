import { GENERATE_DANCE_EXERCISES_FUNCTION } from "../config/constants";
import { getAuthToken } from "./authUtils";

export interface Exercise {
  title: string;
  description: string;
}

export interface ExerciseRequest {
  transcription: string;
  danceStyle: string;
}

export interface ExerciseResponse {
  success: boolean;
  exercises?: Exercise[];
  error?: string;
  details?: string;
}

export const generateDanceExercises = async (
  transcription: string,
  danceStyle: string
): Promise<ExerciseResponse> => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("No access token available");

    const response = await fetch(GENERATE_DANCE_EXERCISES_FUNCTION, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transcription,
        danceStyle,
      } as ExerciseRequest),
    });

    const result = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: "Failed to generate exercises",
        details: result.error || "Exercise generation function failed",
      };
    }

    return result as ExerciseResponse;
  } catch (err) {
    console.error("Exercise generation service error:", err);
    return {
      success: false,
      error: "Failed to generate exercises",
      details: err instanceof Error ? err.message : "Unknown error",
    };
  }
};
