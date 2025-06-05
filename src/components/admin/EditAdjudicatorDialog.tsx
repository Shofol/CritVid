import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AdjudicatorAdminProfile } from '@/types/adjudicatorAdmin';
import { useToast } from '@/hooks/use-toast';
import AdjudicatorEditTabs from './AdjudicatorEditTabs';

interface EditAdjudicatorDialogProps {
  adjudicator: AdjudicatorAdminProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdjudicatorUpdate?: (updatedAdjudicator: AdjudicatorAdminProfile) => void;
}

const EditAdjudicatorDialog: React.FC<EditAdjudicatorDialogProps> = ({ 
  adjudicator: initialAdjudicator, 
  open, 
  onOpenChange,
  onAdjudicatorUpdate 
}) => {
  const [adjudicator, setAdjudicator] = useState<AdjudicatorAdminProfile>(initialAdjudicator);
  const { toast } = useToast();

  const handleAdjudicatorUpdate = (updatedFields: Partial<AdjudicatorAdminProfile>) => {
    const updatedAdjudicator = { ...adjudicator, ...updatedFields };
    setAdjudicator(updatedAdjudicator);
    
    // In a real implementation, this would call an API endpoint
    // and only update the state after successful response
    toast({
      title: "Adjudicator updated",
      description: "Adjudicator information has been updated successfully."
    });

    // Notify parent component
    if (onAdjudicatorUpdate) {
      onAdjudicatorUpdate(updatedAdjudicator);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Adjudicator: {adjudicator.fullName}</DialogTitle>
        </DialogHeader>
        <AdjudicatorEditTabs 
          adjudicator={adjudicator} 
          onAdjudicatorUpdate={handleAdjudicatorUpdate} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditAdjudicatorDialog;
