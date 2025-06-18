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
    const { title, danceStyle, feedback, fileName, userId } = await req.json();

    if (!title || !danceStyle || !userId) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
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

    // Create a record in the videos table
    const { data, error } = await supabaseClient
      .from("videos")
      .insert([
        {
          title,
          dance_style: danceStyle,
          feedback_requested: feedback,
          user_id: userId,
          video_path: fileName ? `video-uploads/${userId}/${fileName}` : null,
        },
      ])
      .select();

    if (error) throw error;

    // Generate a signed URL for uploading the video directly to storage
    let uploadUrl = null;
    if (fileName) {
      const filePath = `${userId}/${fileName}`;
      const { data: signedUrlData, error: signedUrlError } =
        await supabaseClient.storage
          .from("video-uploads")
          .createSignedUploadUrl(filePath);

      if (signedUrlError) throw signedUrlError;
      uploadUrl = signedUrlData.signedUrl;
    }

    return new Response(
      JSON.stringify({
        success: true,
        videoId: data[0].id,
        uploadUrl,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error saving video:", error);
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
