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

    // Parse and validate the request body
    const { transcription, danceStyle, requestedNumber } = await req.json();

    // Input validation
    if (!transcription?.trim()) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Transcription is required and cannot be empty",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!danceStyle?.trim()) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Dance style is required",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!requestedNumber || requestedNumber < 1 || requestedNumber > 10) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Requested number must be between 1 and 10",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "OpenAI API key not configured",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Enhanced prompt with better structure
    const prompt = `You are a professional dance educator and technique coach, helping dancers improve based on critiques from adjudicators. You will receive a transcription of a voice critique recorded after the dancer's performance.

Your task is to:
- Read the transcript carefully
- The dance style is: ${danceStyle}
- Generate exactly ${requestedNumber} specific, relevant suggestions that directly support the critique

Each suggestion should:
- Target one key area of improvement mentioned in the critique
- Be clearly written and easy to follow
- Be appropriate for the likely age and skill level of the dancer (based on tone of the feedback)
- Reflect the correct style of dance — only suggest suggestions that make sense for that genre
- Avoid general or vague advice — be as relevant and actionable as possible
- Be concise but informative (1-2 sentences)

Format your response exactly like this:

1. [1–2 sentence description of the suggestion and what it improves]

2. [1–2 sentence description of the suggestion and what it improves]

(Continue for all ${requestedNumber} suggestions)

Transcript:
${transcription}

Please respond with exactly ${requestedNumber} suggestions in the format specified above.`;

    // Call OpenAI API for suggestion generation
    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.1,
          max_tokens: 1000,
        }),
      }
    );

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      console.error("OpenAI API error:", errorData);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to generate suggestions",
          details: errorData,
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const openaiData = await openaiResponse.json();
    const aiResponse = openaiData.choices[0]?.message?.content;

    if (!aiResponse) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No response from AI",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Parse the AI response to extract suggestions
    const suggestions: { description: string }[] = [];
    const lines = aiResponse.split("\n");

    for (const line of lines) {
      const trimmedLine = line.trim();
      // Check if line starts with a number (suggestion)
      if (/^\d+\./.test(trimmedLine)) {
        // Extract the description (everything after the number and period)
        const description = trimmedLine.replace(/^\d+\.\s*/, "");
        if (description) {
          suggestions.push({
            description: description,
          });
        }
      }
    }

    // Ensure we have exactly requested number suggestions, pad with defaults if needed
    while (suggestions.length < requestedNumber) {
      suggestions.push({
        description:
          "Focus on technique and form as mentioned in the critique.",
      });
    }

    // Limit to requested number of suggestions
    const finalSuggestions = suggestions.slice(0, requestedNumber);

    return new Response(
      JSON.stringify({
        success: true,
        suggestions: finalSuggestions,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
