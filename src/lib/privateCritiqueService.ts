import { supabase } from './supabase';

/**
 * Service for managing private critique mode
 * Updated to always return true for studio_critique role
 */
export const privateCritiqueService = {
  /**
   * Get the current private critique mode status
   * Always returns true for studio_critique role
   */
  async getStatus(): Promise<boolean> {
    // Always return true - private critique mode is always enabled
    return true;
  },

  /**
   * Toggle private critique mode
   * Now a no-op function that always returns true
   */
  async toggleStatus(enabled: boolean): Promise<boolean> {
    // No-op function that always returns true
    return true;
  }
};
