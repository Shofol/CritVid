import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from './use-toast';

type EmailPreferences = {
  marketingEmails: boolean;
  notificationEmails: boolean;
  critiqueReadyEmails: boolean;
};

export function useEmailPreferences(userId: string) {
  const [preferences, setPreferences] = useState<EmailPreferences>({
    marketingEmails: true,
    notificationEmails: true,
    critiqueReadyEmails: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_email_preferences')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setPreferences({
            marketingEmails: data.marketing_emails,
            notificationEmails: data.notification_emails,
            critiqueReadyEmails: data.critique_ready_emails,
          });
        }
      } catch (error) {
        console.error('Error fetching email preferences:', error);
        toast({
          title: 'Error',
          description: 'Failed to load email preferences',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, [userId, toast]);

  const savePreferences = async (newPreferences: EmailPreferences) => {
    if (!userId) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('user_email_preferences')
        .upsert({
          user_id: userId,
          marketing_emails: newPreferences.marketingEmails,
          notification_emails: newPreferences.notificationEmails,
          critique_ready_emails: newPreferences.critiqueReadyEmails,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) throw error;

      setPreferences(newPreferences);
      toast({
        title: 'Preferences Updated',
        description: 'Your email preferences have been saved.',
      });
      
      return true;
    } catch (error) {
      console.error('Error saving email preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to save email preferences',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    preferences,
    isLoading,
    isSaving,
    savePreferences,
    setPreferences
  };
}
