import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

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

    // Get request data
    const { userId, adjudicatorId, videoId, price } = await req.json();

    if (!userId || !adjudicatorId || !videoId || !price) {
      return new Response(
        JSON.stringify({
          error:
            "Missing required fields: userId, adjudicatorId, videoId, and price are required",
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

    // Create a record in the critiques table
    const { data, error } = await supabaseClient
      .from("critiques")
      .insert([
        {
          user_id: userId,
          adjudicator_id: adjudicatorId,
          video_id: videoId,
          price: price,
          status: 1, // 1 = pending/payment completed, ready for review
          completion_date: null, // Will be set when critique is completed
          review_id: null, // Will be set when review is created
        },
      ])
      .select();

    if (error) {
      console.error("Database error:", error);
      throw error;
    }

    return new Response(
      JSON.stringify({
        success: true,
        critiqueId: data[0].id,
        message: "Critique created successfully",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error saving critique:", error);
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
