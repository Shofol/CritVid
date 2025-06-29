import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

    // Get the feedback ID from the URL
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const feedbackId = pathParts[pathParts.length - 1];

    if (!feedbackId) {
      return new Response(
        JSON.stringify({ error: "Feedback ID is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get the critique feedback with all related data
    const { data: feedback, error: feedbackError } = await supabaseClient
      .from("critiques_feedback")
      .select(
        `
        *,
        user:users!critiques_feedback_user_id_fkey (
          id,
          email,
          full_name,
          avatar_url,
          role,
          is_verified,
          created_at,
          updated_at
        ),
        adjudicator:adj_profiles!critiques_feedback_adjudicator_id_fkey (
          id,
          user_id,
          full_name,
          bio,
          specializations,
          experience_years,
          certifications,
          profile_image_url,
          is_verified,
          status,
          created_at,
          updated_at
        ),
        client_video:videos!critiques_feedback_video_id_fkey (
          id,
          title,
          dance_style,
          feedback_requested,
          user_id,
          video_path,
          file_name,
          duration,
          size,
          created_at
        ),
        feedback_video:critique_videos!critiques_feedback_feedback_video_id_fkey (
          id,
          file_path,
          file_name,
          file_size,
          file_type,
          user_id,
          adjudicator_id,
          created_at
        ),
        critique:critiques!critiques_feedback_critique_id_fkey (
          id,
          user_id,
          adjudicator_id,
          video_id,
          status,
          price,
          assigned_at,
          completed_at,
          created_at,
          updated_at
        ),
        review:reviews!critiques_feedback_review_id_fkey (
          id,
          adjudicator_id,
          review,
          rating,
          client_id,
          critique_id,
          created_at
        )
      `
      )
      .eq("id", feedbackId)
      .single();

    if (feedbackError) {
      console.error("Error fetching critique feedback:", feedbackError);
      return new Response(
        JSON.stringify({
          error: "Failed to fetch critique feedback",
          details: feedbackError.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!feedback) {
      return new Response(
        JSON.stringify({ error: "Critique feedback not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: feedback,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
