import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface AccountStatusToggleProps {
  isActive: boolean;
  adjudicatorId: string;
  onStatusChange?: (newStatus: boolean) => void;
}

const AccountStatusToggle: React.FC<AccountStatusToggleProps> = ({
  isActive,
  adjudicatorId,
  onStatusChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(isActive);
  const { toast } = useToast();

  const toggleAccountStatus = async () => {
    try {
      setLoading(true);
      
      const newStatus = !currentStatus;
      
      // First try to use the Supabase function
      try {
        const response = await fetch(
          'https://tasowytszirhdvdiwuia.supabase.co/functions/v1/20c7a8e8-33f2-4aa8-9946-b78afcdaabc7',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              adjudicatorId,
              isActive: newStatus,
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Function call failed');
        }
      } catch (functionError) {
        console.error('Function error, falling back to direct update:', functionError);
        // Fallback to direct database update
        const { error } = await supabase
          .from('adjudicator_profiles')
          .update({ is_active: newStatus })
          .eq('id', adjudicatorId);
        
        if (error) throw error;
      }
      
      setCurrentStatus(newStatus);
      if (onStatusChange) onStatusChange(newStatus);
      
      toast({
        title: newStatus ? 'Account Reactivated' : 'Account Suspended',
        description: newStatus 
          ? 'Your account is now active and visible to dancers.' 
          : 'Your account is now suspended and hidden from dancers.',
        variant: newStatus ? 'default' : 'destructive',
      });
    } catch (error) {
      console.error('Error updating account status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update your account status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={toggleAccountStatus}
      disabled={loading}
      variant={currentStatus ? 'destructive' : 'default'}
      className={`w-full ${currentStatus ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
    >
      {loading ? 'Processing...' : (
        currentStatus ? 
          '🔴 Suspend My Account' : 
          '🟢 Reactivate My Account'
      )}
    </Button>
  );
};

export default AccountStatusToggle;