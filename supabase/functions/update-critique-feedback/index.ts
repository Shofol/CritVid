import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: {
            Authorization: req.headers.get("Authorization"),
          },
        },
      }
    );

    // Get request data
    const {
      feedbackId,
      exercises,
      suggestions,
      transcription,
      note,
      written_feedback,
    } = await req.json();

    console.log("📝 Received update parameters:", {
      feedbackId,
      exercises,
      suggestions,
      transcription,
      note,
      written_feedback,
    });

    if (!feedbackId) {
      return new Response(
        JSON.stringify({
          error: "Missing required field: feedbackId is required",
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
          status: 400,
        }
      );
    }

    // Prepare the update data
    const updateData: {
      exercises?: string | null;
      suggestions?: string | null;
      transcription?: string | null;
      note?: string | null;
      written_feedback?: string | null;
    } = {};

    if (exercises !== undefined) updateData.exercises = exercises;
    if (suggestions !== undefined) updateData.suggestions = suggestions;
    if (transcription !== undefined) updateData.transcription = transcription;
    if (note !== undefined) updateData.note = note;
    if (written_feedback !== undefined)
      updateData.written_feedback = written_feedback;

    console.log("📝 Updating data:", updateData);

    // Update the record in the critiques_feedback table
    const { data: feedbackData, error: feedbackError } = await supabaseClient
      .from("critiques_feedback")
      .update(updateData)
      .eq("id", feedbackId)
      .select();

    if (feedbackError) {
      console.error("Database error updating feedback record:", feedbackError);
      throw feedbackError;
    }

    console.log("✅ Updated feedback record:", feedbackData[0]);

    console.log("✅ Feedback update completed successfully");
    return new Response(
      JSON.stringify({
        success: true,
        feedbackId: feedbackId,
        message: "Critique feedback updated successfully",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error updating critique feedback:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
});
