# Transcribe Audio Edge Function

This Supabase Edge Function transcribes audio files using OpenAI's Whisper API.

## Setup

1. Deploy the function to your Supabase project:

   ```bash
   supabase functions deploy transcribe-audio
   ```

2. Set the required environment variable:
   ```bash
   supabase secrets set OPENAI_API_KEY=your_openai_api_key_here
   ```

## Usage

### Request

Send a POST request to the function with the following JSON body:

```json
{
  "audioFilePath": "path/to/audio/file.mp3",
  "bucketName": "dance-critiques" // optional, defaults to "dance-critiques"
}
```

### Response

#### Success Response

```json
{
  "success": true,
  "transcription": "The transcribed text from the audio file..."
}
```

#### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details" // optional
}
```

## Example Usage

```typescript
const { data, error } = await supabase.functions.invoke("transcribe-audio", {
  body: {
    audioFilePath: "feedback-audio/12345.mp3",
    bucketName: "dance-critiques",
  },
});

if (error) {
  console.error("Error:", error);
} else {
  console.log("Transcription:", data.transcription);
}
```

## Notes

- The function downloads the audio file from Supabase storage
- Uses OpenAI's Whisper-1 model for transcription
- Supports various audio formats (MP3, WAV, M4A, etc.)
- Maximum file size: 25MB (OpenAI limit)
