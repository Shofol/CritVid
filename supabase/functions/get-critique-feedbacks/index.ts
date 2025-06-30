import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    // Create Supabase client
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

    // Get query parameters
    const url = new URL(req.url);
    const adjudicatorId = url.searchParams.get("adjudicator_id");
    const userId = url.searchParams.get("user_id");
    const status = url.searchParams.get("status");

    // Build the base query with review relationship (left join)
    let query = supabaseClient.from("critiques_feedback").select(`
        *,
        client_video:client_video_id (
          id,
          title,
          dance_style:dance_style(
            id,
            name
          )
        ),
        user:user_id(
          id,
          full_name
        ),
        review:review_id(
          id,
          rating,
          review,
          created_at
        ),
        critique:critique_id(
          id,
          price
        ),
        feedback_video:feedback_video_id (
          id,
          file_path,
          file_name,
          file_size,
          file_type,
          audio_file_path,
          audio_file_name,
          audio_file_size,
          audio_file_type
        )
      `);

    // Apply filters
    if (adjudicatorId) {
      query = query.eq("adjudicator_id", adjudicatorId);
    }
    if (userId) {
      query = query.eq("user_id", userId);
    }
    if (status) {
      query = query.eq("status", status);
    }

    // Execute the query
    const { data: critiques, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Error fetching critiques:", error);
      throw error;
    }

    // Process the data to handle null review_id
    const processedCritiques =
      critiques?.map((critique) => ({
        ...critique,
        // Ensure review is null if review_id is null
        review: critique.review_id ? critique.review : null,
      })) || [];

    return new Response(
      JSON.stringify({
        data: processedCritiques,
        count: processedCritiques.length,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching critiques:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch critiques",
        details: error.message,
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
