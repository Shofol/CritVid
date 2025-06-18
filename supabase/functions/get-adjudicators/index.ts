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

    // Fetch adjudicators with all joined data using explicit joins
    const { data: adjudicators, error: adjudicatorsError } =
      await supabaseClient
        .from("adj_profiles")
        .select(
          `
        *,
        dance_styles:adj_dance_styles (
          id,
          dance_style:dance_styles (
            id,
            name
          )
        ),
        reviews:adj_reviews (
          id,
          review,
          rating,
          created_at,
          client_id
        ),
        certificates:adjudicator_certificates (
          id,
          title,
          issuer,
          issue_date
        )
      `
        )
        .eq("approved", true)
        .order("created_at", { ascending: false });

    if (adjudicatorsError) {
      throw adjudicatorsError;
    }

    // Get user data separately to avoid relationship issues
    const userIds =
      adjudicators?.map((adj) => adj.user_id).filter(Boolean) || [];
    let usersData: any[] = [];

    if (userIds.length > 0) {
      const { data: users, error: usersError } = await supabaseClient
        .from("users")
        .select("id, email, full_name, avatar_url, role, is_verified")
        .in("id", userIds);

      if (usersError) {
        console.warn("Error fetching users:", usersError);
      } else {
        usersData = users || [];
      }
    }

    // Get client data for reviews
    const clientIds =
      adjudicators
        ?.flatMap((adj) =>
          (adj.reviews || []).map((review) => review.client_id)
        )
        .filter(Boolean) || [];

    let clientsData: any[] = [];

    if (clientIds.length > 0) {
      const { data: clients, error: clientsError } = await supabaseClient
        .from("users")
        .select("id, full_name")
        .in("id", clientIds);

      if (clientsError) {
        console.warn("Error fetching clients:", clientsError);
      } else {
        clientsData = clients || [];
      }
    }

    // Transform the data to match the expected format
    const transformedAdjudicators =
      adjudicators?.map((adjudicator) => {
        // Find user data
        const user = usersData.find((u) => u.id === adjudicator.user_id) || {};

        // Calculate average rating and review count
        const reviews = adjudicator.reviews || [];
        const averageRating =
          reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) /
              reviews.length
            : 0;
        const reviewCount = reviews.length;

        // Transform dance styles
        const danceStyles = (adjudicator.dance_styles || [])
          .map((ds) => ds.dance_style)
          .filter(Boolean);

        // Transform reviews with client data
        const transformedReviews = reviews.map((review) => {
          const client =
            clientsData.find((c) => c.id === review.client_id) || {};
          return {
            ...review,
            client: {
              id: review.client_id,
              full_name: client.full_name || "Anonymous",
            },
          };
        });

        return {
          id: adjudicator.id,
          name: adjudicator.name,
          email: adjudicator.email,
          experience: adjudicator.experience,
          exp_years: adjudicator.exp_years,
          ppc: adjudicator.ppc,
          turnaround_days: adjudicator.turnaround_days,
          headshot: adjudicator.headshot,
          location: adjudicator.location,
          approved: adjudicator.approved,
          created_at: adjudicator.created_at,
          user_id: adjudicator.user_id,
          // Calculated fields
          rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
          review_count: reviewCount,
          // Joined data
          user: user,
          dance_styles: danceStyles,
          reviews: transformedReviews,
          certificates: adjudicator.certificates || [],
        };
      }) || [];

    return new Response(
      JSON.stringify({
        data: transformedAdjudicators,
        count: transformedAdjudicators.length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching adjudicators:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to fetch adjudicators",
        details: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
