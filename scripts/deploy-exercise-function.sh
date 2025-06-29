#!/bin/bash

# Deploy the generate-dance-exercises edge function
echo "Deploying generate-dance-exercises edge function..."

# Navigate to the function directory
cd supabase/functions/generate-dance-exercises

# Deploy the function
supabase functions deploy generate-dance-exercises

echo "generate-dance-exercises function deployed successfully!"
