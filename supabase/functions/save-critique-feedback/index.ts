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
      userId,
      adjudicatorId,
      clientVideoId,
      critiqueId,
      reviewId,
      feedbackVideoId,
      exercises,
      suggestions,
      transcription,
      note,
    } = await req.json();

    console.log("📝 Received parameters:", {
      userId,
      adjudicatorId,
      clientVideoId,
      critiqueId,
      reviewId,
      feedbackVideoId,
      exercises,
      suggestions,
      transcription,
      note,
    });

    if (!userId || !adjudicatorId || !clientVideoId) {
      return new Response(
        JSON.stringify({
          error:
            "Missing required fields: userId, adjudicatorId, and clientVideoId are required",
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

    // Prepare the insert data with both fields if provided
    const insertData: {
      user_id: string;
      adjudicator_id: string;
      client_video_id: number;
      status: string;
      exercises: string | null;
      suggestions: string | null;
      transcription: string | null;
      note: string | null;
      critique_id?: string;
      review_id?: string;
    } = {
      user_id: userId,
      adjudicator_id: adjudicatorId,
      client_video_id: clientVideoId,
      status: "pending",
      exercises: exercises || null,
      suggestions: suggestions || null,
      transcription: transcription || null,
      note: note || null,
      critique_id: critiqueId || null,
      review_id: reviewId || null,
    };

    console.log("📝 Inserting data:", insertData);

    // Create a record in the critiques_feedback table
    const { data: feedbackData, error: feedbackError } = await supabaseClient
      .from("critiques_feedback")
      .insert([insertData])
      .select();
    if (feedbackError) {
      console.error("Database error creating feedback record:", feedbackError);
      throw feedbackError;
    }
    const feedbackId = feedbackData[0].id;
    console.log("✅ Created feedback record with ID:", feedbackId);

    console.log("✅ Feedback process completed successfully");
    return new Response(
      JSON.stringify({
        success: true,
        feedbackId: feedbackId,
        message: "Critique feedback saved successfully",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error saving critique feedback:", error);
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
