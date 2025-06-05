import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tasowytszirhdvdiwuia.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhc293eXRzemlyaGR2ZGl3dWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMzE4MjYsImV4cCI6MjA2MjgwNzgyNn0.XN_4zv3Zge2yAz6lzgPWcIn8RSPCw2KboMu29Bwhk38';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export { supabaseUrl, supabaseKey };