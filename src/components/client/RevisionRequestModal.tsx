import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { paymentService } from '@/lib/paymentService';

interface RevisionRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  critiqueId: string;
  userId: string;
  onRevisionRequested: () => void;
}

const RevisionRequestModal: React.FC<RevisionRequestModalProps> = ({
  isOpen,
  onClose,
  critiqueId,
  userId,
  onRevisionRequested
}) => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast({
        title: 'Feedback Required',
        description: 'Please provide feedback about what needs to be revised.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await paymentService.requestCritiqueRevision(critiqueId, userId, feedback);
      if (result.success) {
        toast({
          title: 'Revision Requested',
          description: 'Your revision request has been sent to the admin for review.'
        });
        onRevisionRequested();
        onClose();
        setFeedback('');
      }
    } catch (error) {
      toast({
        title: 'Request Failed',
        description: 'Failed to submit revision request. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFeedback('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Critique Revision</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="feedback">What would you like to be improved or fixed?</Label>
            <Textarea
              id="feedback"
              placeholder="Please explain what aspects of the critique need revision..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="mt-2"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RevisionRequestModal;