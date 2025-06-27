import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS
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

    // Get the user from the auth header
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Get the request body
    const { profile, headshotFile } = await req.json();

    // Upload headshot to storage if provided
    let headshotUrl = profile.headshot;
    if (headshotFile) {
      // Handle different file formats
      let base64Data = headshotFile;

      // Check if it's a data URL format (starts with data:)
      if (headshotFile.startsWith("data:")) {
        // Extract base64 part after the comma
        const parts = headshotFile.split(",");
        if (parts.length !== 2) {
          throw new Error("Invalid data URL format for headshot");
        }
        base64Data = parts[1];
      }

      // Validate that we have base64 data
      if (!base64Data || typeof base64Data !== "string") {
        throw new Error("Invalid headshot file data");
      }

      // Convert base64 to blob
      const binaryData = atob(base64Data);
      const bytes = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "image/jpeg" });

      const fileName = `${user.id}/${Date.now()}.jpg`;
      const { data: uploadData, error: uploadError } =
        await supabaseClient.storage.from("headshots").upload(fileName, blob, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabaseClient.storage
        .from("headshots")
        .getPublicUrl(uploadData.path);

      headshotUrl = publicUrl;
    }

    // Save adjudicator profile
    const { data: profileData, error: profileError } = await supabaseClient
      .from("adj_profiles")
      .upsert({
        user_id: user.id,
        name: profile.name,
        email: profile.email,
        experience: profile.experience,
        exp_years: profile.exp_years,
        ppc: profile.ppc,
        turnaround_days: profile.turnaround_days,
        headshot: headshotUrl,
      })
      .select()
      .single();

    if (profileError) {
      console.error("Profile error:", profileError);
      throw profileError;
    }

    // Save certificates
    if (profile.certificates?.length > 0) {
      const certificates = profile.certificates.map((cert) => ({
        adjudicator_id: profileData.id,
        title: cert.title,
        issuer: cert.issuer,
        issue_date: cert.issue_date,
      }));

      const { error: certError } = await supabaseClient
        .from("adjudicator_certificates")
        .upsert(certificates);

      if (certError) {
        console.error("Certificate error:", certError);
        throw certError;
      }
    }

    // Save dance styles
    if (profile.dance_styles?.length > 0) {
      const danceStyles = profile.dance_styles.map((styleId) => ({
        adjudicator_id: profileData.id,
        dance_style: styleId,
      }));

      const { error: styleError } = await supabaseClient
        .from("adj_dance_styles")
        .upsert(danceStyles);

      if (styleError) {
        console.error("Dance style error:", styleError);
        throw styleError;
      }
    }

    return new Response(
      JSON.stringify({
        data: profileData,
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
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
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
});
