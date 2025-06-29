import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ExerciseRequest {
  transcription: string;
}

interface Exercise {
  title: string;
  description: string;
}

interface ExerciseResponse {
  success: boolean;
  exercises?: Exercise[];
  error?: string;
}

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

    // Parse the request body
    const { transcription, danceStyle }: ExerciseRequest = await req.json();

    if (!transcription) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Transcription is required",
        } as ExerciseResponse),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
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
        } as ExerciseResponse),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const prompt = `You are a professional dance educator and technique coach, helping dancers improve based on critiques from adjudicators. You will receive a transcription of a voice critique recorded after the dancer's performance.

Your task is to:
- Read the transcript
- The dance style is ${danceStyle}
- Generate five specific, relevant exercises that directly support the critique

Each exercise should:
- Target one key area of improvement mentioned
- Be clearly written and easy to follow
- Be appropriate for the likely age and skill level of the dancer (based on tone of the feedback)
- Reflect the correct style of dance — only suggest exercises that make sense for that genre
- Avoid general or vague advice — be as relevant and actionable as possible

*Format your response like this:*

1. [Exercise Title]
   [1–2 sentence description of how to do the exercise and what it improves]

Transcript:
${transcription}

Please respond with exactly 5 exercises in the format specified above.`;

    // Call OpenAI API for exercise generation
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
          temperature: 0.7,
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
          error: "Failed to generate exercises",
          details: errorData,
        } as ExerciseResponse),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
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
        } as ExerciseResponse),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse the AI response to extract exercises
    const exercises: Exercise[] = [];
    const lines = aiResponse.split("\n");
    let currentExercise: Partial<Exercise> = {};

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Check if line starts with a number (exercise title)
      if (/^\d+\./.test(trimmedLine)) {
        // Save previous exercise if exists
        if (currentExercise.title && currentExercise.description) {
          exercises.push(currentExercise as Exercise);
        }

        // Start new exercise
        const title = trimmedLine.replace(/^\d+\.\s*/, "");
        currentExercise = { title };
      } else if (
        trimmedLine &&
        currentExercise.title &&
        !currentExercise.description
      ) {
        // This is the description for the current exercise
        currentExercise.description = trimmedLine;
      }
    }

    // Add the last exercise if it exists
    if (currentExercise.title && currentExercise.description) {
      exercises.push(currentExercise as Exercise);
    }

    // Ensure we have exactly 5 exercises, pad with defaults if needed
    while (exercises.length < 5) {
      exercises.push({
        title: `Exercise ${exercises.length + 1}`,
        description:
          "Focus on technique and form as mentioned in the critique.",
      });
    }

    // Limit to 5 exercises
    const finalExercises = exercises.slice(0, 5);

    return new Response(
      JSON.stringify({
        success: true,
        exercises: finalExercises,
      } as ExerciseResponse),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
        details: error.message,
      } as ExerciseResponse),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
