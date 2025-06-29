#!/bin/bash

# Deploy the transcribe-audio edge function to Supabase
echo "🚀 Deploying transcribe-audio edge function..."

# Deploy the function
supabase functions deploy transcribe-audio

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo "✅ Function deployed successfully!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Set your OpenAI API key:"
    echo "   supabase secrets set OPENAI_API_KEY=your_openai_api_key_here"
    echo ""
    echo "2. Test the function:"
    echo "   curl -X POST https://your-project.supabase.co/functions/v1/transcribe-audio \\"
    echo "     -H 'Authorization: Bearer YOUR_ANON_KEY' \\"
    echo "     -H 'Content-Type: application/json' \\"
    echo "     -d '{\"audioFilePath\": \"path/to/audio.mp3\"}'"
else
    echo "❌ Function deployment failed!"
    exit 1
fi
