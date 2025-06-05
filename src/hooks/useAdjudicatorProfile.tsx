import { useState, useEffect } from 'react';
import { getAdjudicatorProfile, updateAdjudicatorProfile, AdjudicatorProfile } from '@/lib/api';

export const useAdjudicatorProfile = (userId: string | undefined) => {
  const [profile, setProfile] = useState<AdjudicatorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const profileData = await getAdjudicatorProfile(userId);
        setProfile(profileData);
      } catch (err) {
        console.error('Error fetching adjudicator profile:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const updateProfile = async (updates: Partial<AdjudicatorProfile>) => {
    try {
      setLoading(true);
      
      // Merge existing profile with updates
      const updatedProfile = {
        ...profile,
        ...updates,
      };
      
      // Remove undefined fields
      Object.keys(updatedProfile).forEach(key => {
        if (updatedProfile[key as keyof AdjudicatorProfile] === undefined) {
          delete updatedProfile[key as keyof AdjudicatorProfile];
        }
      });
      
      const result = await updateAdjudicatorProfile(updatedProfile as AdjudicatorProfile);
      setProfile(result);
      return result;
    } catch (err) {
      console.error('Error updating adjudicator profile:', err);
      throw err instanceof Error ? err : new Error('Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, updateProfile };
};
