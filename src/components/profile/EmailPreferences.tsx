import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { LoadingButton } from '@/components/ui/loading-button';

type EmailPreferencesProps = {
  userId: string;
};

type EmailPreferences = {
  marketingEmails: boolean;
  notificationEmails: boolean;
  critiqueReadyEmails: boolean;
};

export const EmailPreferences = ({ userId }: EmailPreferencesProps) => {
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

  const handleSavePreferences = async () => {
    if (!userId) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('user_email_preferences')
        .upsert({
          user_id: userId,
          marketing_emails: preferences.marketingEmails,
          notification_emails: preferences.notificationEmails,
          critique_ready_emails: preferences.critiqueReadyEmails,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: 'Preferences Updated',
        description: 'Your changes have been saved successfully.',
      });
    } catch (error) {
      console.error('Error saving email preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to save email preferences',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Preferences</CardTitle>
        <CardDescription>
          Manage the types of emails you receive from CritVid
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="marketing-emails">Marketing Emails</Label>
            <p className="text-sm text-muted-foreground">
              Receive updates about new features and promotions
            </p>
          </div>
          <Switch
            id="marketing-emails"
            checked={preferences.marketingEmails}
            onCheckedChange={(checked) =>
              setPreferences({ ...preferences, marketingEmails: checked })
            }
            disabled={isLoading}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notification-emails">Notification Emails</Label>
            <p className="text-sm text-muted-foreground">
              Receive emails about account activity and updates
            </p>
          </div>
          <Switch
            id="notification-emails"
            checked={preferences.notificationEmails}
            onCheckedChange={(checked) =>
              setPreferences({ ...preferences, notificationEmails: checked })
            }
            disabled={isLoading}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="critique-ready-emails">Critique Ready Emails</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications when your critiques are ready
            </p>
          </div>
          <Switch
            id="critique-ready-emails"
            checked={preferences.critiqueReadyEmails}
            onCheckedChange={(checked) =>
              setPreferences({ ...preferences, critiqueReadyEmails: checked })
            }
            disabled={isLoading}
          />
        </div>
      </CardContent>
      <CardFooter>
        <LoadingButton 
          onClick={handleSavePreferences} 
          isLoading={isSaving}
          loadingText="Saving..."
          disabled={isLoading}
        >
          Save Preferences
        </LoadingButton>
      </CardFooter>
    </Card>
  );
};
