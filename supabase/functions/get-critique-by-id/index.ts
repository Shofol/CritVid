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
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get critique ID from URL path
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const critiqueId = pathParts[pathParts.length - 1];

    if (!critiqueId) {
      return new Response(
        JSON.stringify({
          error: "Critique ID is required",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Build the query to get critique with all related data
    const { data: critique, error } = await supabaseClient
      .from("critiques")
      .select(
        `
        *,
        user:users (
          id,
          email,
          full_name,
          avatar_url,
          role,
          is_verified,
          created_at,
          updated_at
        ),
        adjudicator:adj_profiles (
          id,
          name,
          email,
          experience,
          exp_years,
          ppc,
          turnaround_days,
          headshot,
          location,
          approved,
          created_at,
          user_id
        ),
        video:videos (
          id,
          title,
          dance_style,
          feedback_requested,
          user_id,
          video_path,
          file_name,
          duration,
          size,
          created_at,
          dance_style_details:dance_styles (
            id,
            name
          )
        ),
        review:reviews (
          id,
          review,
          rating,
          created_at,
          client_id
        )
      `
      )
      .eq("id", critiqueId)
      .single();

    if (error) {
      console.error("Database error:", error);

      if (error.code === "PGRST116") {
        return new Response(
          JSON.stringify({
            error: "Critique not found",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 404,
          }
        );
      }

      throw error;
    }

    if (!critique) {
      return new Response(
        JSON.stringify({
          error: "Critique not found",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    console.log("Raw critique data:", critique);

    // Get client data for reviews if available
    let clientData = null;
    if (critique.review?.client_id) {
      clientData = {
        id: critique.review.client_id,
      };
    }

    console.log("Processing critique:", {
      id: critique.id,
      user: !!critique.user,
      adjudicator: !!critique.adjudicator,
      video: !!critique.video,
      review: !!critique.review,
    });

    // Transform the data to match the expected format
    const transformedCritique = {
      id: critique.id,
      created_at: critique.created_at,
      user_id: critique.user_id,
      adjudicator_id: critique.adjudicator_id,
      video_id: critique.video_id,
      status: critique.status,
      price: critique.price,
      completion_date: critique.completion_date,
      review_id: critique.review_id,

      // Related data
      user: critique.user,
      adjudicator: critique.adjudicator,
      video: critique.video
        ? {
            ...critique.video,
            dance_style_name: critique.video.dance_style_details?.name,
          }
        : null,
      review: critique.review
        ? {
            ...critique.review,
            client: clientData,
          }
        : null,

      // Computed fields for easier access
      title: critique.video?.title || "Untitled Video",
      student: critique.user?.full_name || "Unknown Student",
      requestedAt: critique.created_at,
      dueDate: critique.completion_date || "No due date set",
    };

    return new Response(
      JSON.stringify({
        data: transformedCritique,
        debug: {
          rawData: critique,
          relationships: {
            hasUser: !!critique.user,
            hasAdjudicator: !!critique.adjudicator,
            hasVideo: !!critique.video,
            hasReview: !!critique.review,
          },
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching critique:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to fetch critique",
        details: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
