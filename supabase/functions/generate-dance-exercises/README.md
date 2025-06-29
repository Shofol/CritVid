# Generate Dance Exercises Edge Function

This edge function takes a transcription of dance critique feedback and generates 5 specific, relevant dance exercises using OpenAI's GPT-4 model.

## Usage

### Request

```typescript
POST /functions/v1/generate-dance-exercises
Content-Type: application/json
Authorization: Bearer <supabase-token>

{
  "transcription": "Your dance critique transcription here..."
}
```

### Response

```typescript
{
  "success": true,
  "exercises": [
    {
      "title": "Exercise Title",
      "description": "1-2 sentence description of how to do the exercise and what it improves"
    },
    // ... 5 total exercises
  ]
}
```

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key for GPT-4 access
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Features

- Analyzes transcription to identify dance style and skill level
- Generates 5 specific exercises targeting areas mentioned in the critique
- Ensures exercises are appropriate for the dance style and skill level
- Returns structured data for easy frontend integration
- Handles errors gracefully with fallback exercises if needed

## Error Handling

The function returns appropriate error messages for:

- Missing transcription
- Missing OpenAI API key
- OpenAI API failures
- Internal server errors
