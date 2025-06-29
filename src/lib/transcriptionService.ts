import { TRANSCRIBE_AUDIO_FUNCTION } from "../config/constants";
import { getAuthToken } from "./authUtils";

export interface TranscriptionRequest {
  audioFilePath: string;
  bucketName?: string;
}

export interface TranscriptionResponse {
  success: boolean;
  transcription?: string;
  error?: string;
  details?: string;
}

export const transcribeAudio = async (
  audioFilePath: string,
  bucketName: string = "dance-critiques"
): Promise<TranscriptionResponse> => {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("No access token available");

    const response = await fetch(TRANSCRIBE_AUDIO_FUNCTION, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audioFilePath,
        bucketName,
      } as TranscriptionRequest),
    });

    const result = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: "Failed to transcribe audio",
        details: result.error || "Transcription function failed",
      };
    }

    return result as TranscriptionResponse;
  } catch (err) {
    console.error("Transcription service error:", err);
    return {
      success: false,
      error: "Failed to transcribe audio",
      details: err instanceof Error ? err.message : "Unknown error",
    };
  }
};
