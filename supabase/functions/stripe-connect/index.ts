import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Stripe API helper functions
async function stripeRequest(
  endpoint: string,
  method: string,
  data?: Record<string, unknown>
) {
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) {
    throw new Error("STRIPE_SECRET_KEY not configured");
  }

  const url = `https://api.stripe.com/v1/${endpoint}`;
  const headers = {
    Authorization: `Bearer ${stripeKey}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  let body: string | undefined;
  if (data) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    }
    body = params.toString();
  }

  const response = await fetch(url, {
    method,
    headers,
    body,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error?.message || `Stripe API error: ${response.status}`
    );
  }

  return response.json();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Initialize Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the authorization header
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");

    // Verify the user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    // Parse request body only once
    const body = await req.json();
    const { method } = body;

    switch (method) {
      case "create_account":
        return await handleCreateAccount(body, supabase, user);
      case "get_account":
        return await handleGetAccount(supabase, user);
      case "create_onboarding_link":
        return await handleCreateOnboardingLink(body, supabase, user);
      case "test":
        return new Response(
          JSON.stringify({
            message: "Stripe Connect function is working",
            method,
            user_id: user.id,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      default:
        throw new Error("Invalid method");
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function handleCreateAccount(
  body: Record<string, unknown>,
  supabase: any,
  user: any
) {
  const { country = "AU", email, business_type = "individual" } = body;

  // Check if user already has a Stripe account
  const { data: existingAccount } = await supabase
    .from("adjudicator_profiles")
    .select("stripe_account_id")
    .eq("user_id", user.id)
    .single();

  if (existingAccount?.stripe_account_id) {
    return new Response(
      JSON.stringify({
        error: "Stripe account already exists",
        account_id: existingAccount.stripe_account_id,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // Create Stripe Connect account
  const accountData = {
    type: "express",
    country: String(country),
    email: String(email || user.email),
    business_type: String(business_type),
    "capabilities[card_payments][requested]": "true",
    "capabilities[transfers][requested]": "true",
    "business_profile[url]": "https://app.critvidapp.com/",
  };

  const account = await stripeRequest("accounts", "POST", accountData);

  // Save the account ID to the database
  await supabase.from("adjudicator_profiles").upsert({
    user_id: user.id,
    stripe_account_id: account.id,
    stripe_account_status: "pending",
  });

  return new Response(
    JSON.stringify({
      account_id: account.id,
      status: "pending",
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

async function handleGetAccount(supabase: any, user: any) {
  // Get the Stripe account ID from the database
  const { data: profile } = await supabase
    .from("adjudicator_profiles")
    .select("stripe_account_id, stripe_account_status")
    .eq("user_id", user.id)
    .single();

  if (!profile?.stripe_account_id) {
    return new Response(JSON.stringify({ error: "No Stripe account found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Get account details from Stripe
  const account = await stripeRequest(
    `accounts/${profile.stripe_account_id}`,
    "GET"
  );

  return new Response(JSON.stringify({ account }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function handleCreateOnboardingLink(
  body: Record<string, unknown>,
  supabase: any,
  user: any
) {
  const { return_url } = body;

  // Get the Stripe account ID from the database
  const { data: profile } = await supabase
    .from("adjudicator_profiles")
    .select("stripe_account_id")
    .eq("user_id", user.id)
    .single();

  if (!profile?.stripe_account_id) {
    return new Response(JSON.stringify({ error: "No Stripe account found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Create onboarding link
  const linkData = {
    account: profile.stripe_account_id,
    refresh_url: String(return_url),
    return_url: String(return_url),
    type: "account_onboarding",
  };

  const accountLink = await stripeRequest("account_links", "POST", linkData);

  return new Response(JSON.stringify({ url: accountLink.url }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
