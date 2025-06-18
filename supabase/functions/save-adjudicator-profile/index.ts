import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

interface Certificate {
  title: string;
  issuer: string;
  issue_date: string;
}

interface AdjudicatorProfile {
  name: string;
  email: string;
  experience: string;
  exp_years: number;
  ppc: number;
  turnaround_days: number;
  headshot: string;
  certificates: Certificate[];
  dance_styles: number[];
}

serve(async (req) => {
  // Handle CORS
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
      // Get file extension from the base64 string
      const matches = headshotFile.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        throw new Error("Invalid file format");
      }

      const contentType = matches[1];
      const base64Data = matches[2];
      const fileExtension = contentType.split("/")[1];

      const { data: uploadData, error: uploadError } =
        await supabaseClient.storage
          .from("headshots")
          .upload(`${user.id}/${Date.now()}.${fileExtension}`, base64Data, {
            contentType: contentType,
            upsert: true,
          });

      if (uploadError) throw uploadError;

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

    if (profileError) throw profileError;

    // Save certificates
    if (profile.certificates?.length > 0) {
      const certificates = profile.certificates.map((cert: Certificate) => ({
        adjudicator_id: profileData.id,
        title: cert.title,
        issuer: cert.issuer,
        issue_date: cert.issue_date,
      }));

      const { error: certError } = await supabaseClient
        .from("adjudicator_certificates")
        .upsert(certificates);

      if (certError) throw certError;
    }

    // Save dance styles
    if (profile.dance_styles?.length > 0) {
      const danceStyles = profile.dance_styles.map((styleId: number) => ({
        adjudicator_id: profileData.id,
        dance_style: styleId,
      }));

      const { error: styleError } = await supabaseClient
        .from("adj_dance_styles")
        .upsert(danceStyles);

      if (styleError) throw styleError;
    }

    return new Response(JSON.stringify({ data: profileData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
