import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface UsePrivateCritiqueModeResult {
  isEnabled: boolean;
  isLoading: boolean;
  error: string | null;
  togglePrivateCritiqueMode: (enabled: boolean) => Promise<void>;
}

// Modified to always return enabled=true for studio_critique role
export function usePrivateCritiqueMode(): UsePrivateCritiqueModeResult {
  const [isEnabled, setIsEnabled] = useState(true); // Default to true
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The toggle function is kept for backward compatibility
  // but doesn't actually change the state anymore
  const togglePrivateCritiqueMode = async (enabled: boolean) => {
    // Simply return without doing anything
    return;
  };

  return { isEnabled: true, isLoading, error, togglePrivateCritiqueMode };
}
