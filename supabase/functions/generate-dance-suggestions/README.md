# Generate Dance Suggestions Edge Function

This edge function generates AI-powered dance improvement suggestions based on a transcription of adjudicator feedback.

## Function Details

- **Function Name**: `generate-dance-suggestions`
- **Purpose**: Generate specific, actionable dance improvement suggestions from critique transcriptions
- **Input**: Transcription text, dance style, and number of suggestions requested
- **Output**: Array of suggestion objects with description

## Usage

```typescript
const { data, error } = await supabase.functions.invoke(
  "generate-dance-suggestions",
  {
    body: {
      transcription: "Your critique transcription here...",
      danceStyle: "Contemporary",
      requestedNumber: 5,
    },
  }
);
```

## Response Format

```json
{
  "success": true,
  "suggestions": [
    {
      "title": "Improve Arm Placement",
      "description": "Focus on maintaining consistent arm positions throughout the routine."
    },
    {
      "title": "Enhance Musicality",
      "description": "Work on hitting the beats more precisely and expressing the music through movement."
    }
  ]
}
```

## Environment Variables Required

- `OPENAI_API_KEY`: Your OpenAI API key for GPT-4 access
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Deployment

Deploy this function using the Supabase CLI:

```bash
supabase functions deploy generate-dance-suggestions
```
