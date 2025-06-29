import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TranscriptionRequest {
  audioFilePath: string;
  bucketName?: string;
}

interface TranscriptionResponse {
  success: boolean;
  transcription?: string;
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Parse the request body
    const {
      audioFilePath,
      bucketName = "dance-critiques",
    }: TranscriptionRequest = await req.json();

    if (!audioFilePath) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Audio file path is required",
        } as TranscriptionResponse),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "OpenAI API key not configured",
        } as TranscriptionResponse),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Download the audio file from Supabase storage
    const { data: audioData, error: downloadError } =
      await supabaseClient.storage.from(bucketName).download(audioFilePath);

    if (downloadError) {
      console.error("Error downloading audio file:", downloadError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to download audio file",
          details: downloadError.message,
        } as TranscriptionResponse),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!audioData) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Audio file not found",
        } as TranscriptionResponse),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Convert the audio data to a blob
    const audioBlob = new Blob([audioData], { type: "audio/mpeg" });

    // Create FormData for OpenAI API
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.mp3");
    formData.append("model", "whisper-1");

    // Call OpenAI API for transcription
    const openaiResponse = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: formData,
      }
    );

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      console.error("OpenAI API error:", errorData);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to transcribe audio",
          details: errorData,
        } as TranscriptionResponse),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const transcriptionData = await openaiResponse.json();
    const transcription = transcriptionData.text;

    return new Response(
      JSON.stringify({
        success: true,
        transcription,
      } as TranscriptionResponse),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
        details: error.message,
      } as TranscriptionResponse),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
