import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User } from '@/types/user';
import UserEditTabs from './UserEditTabs';
import { useToast } from '@/hooks/use-toast';

interface EditUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdate?: (updatedUser: User) => void;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({ 
  user: initialUser, 
  open, 
  onOpenChange,
  onUserUpdate 
}) => {
  const [user, setUser] = useState<User>(initialUser);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleUserUpdate = async (updatedFields: Partial<User>) => {
    setIsSaving(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedUser = { ...user, ...updatedFields };
      setUser(updatedUser);
      
      // Show success toast
      toast({
        title: "Changes saved",
        description: "Your changes have been saved successfully.",
      });

      // Notify parent component
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User: {user.name}</DialogTitle>
        </DialogHeader>
        <UserEditTabs user={user} onUserUpdate={handleUserUpdate} />
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
