import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Edit } from 'lucide-react';
import { CritiquePaymentStatus, paymentService } from '@/lib/paymentService';
import { useToast } from '@/hooks/use-toast';
import RevisionRequestModal from './RevisionRequestModal';

interface CritiquePaymentActionsProps {
  critiqueId: string;
  userId?: string;
  paymentStatus?: CritiquePaymentStatus | null;
  onStatusUpdate?: (newStatus: CritiquePaymentStatus) => void;
  onApproval?: () => void;
}

const CritiquePaymentActions: React.FC<CritiquePaymentActionsProps> = ({
  critiqueId,
  userId = 'demo-user',
  paymentStatus,
  onStatusUpdate,
  onApproval
}) => {
  const [isApproving, setIsApproving] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const { toast } = useToast();

  // Safe check for payment status
  const status = paymentStatus?.payment_status || 'pending_approval';
  const isPending = status === 'pending_approval';

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      if (onApproval) {
        onApproval();
      } else {
        const result = await paymentService.approveCritiquePayment(critiqueId, userId);
        if (result.success && onStatusUpdate) {
          onStatusUpdate(result.critique);
        }
      }
      toast({
        title: 'Payment Approved',
        description: 'The critique payment has been released to the adjudicator.'
      });
    } catch (error) {
      toast({
        title: 'Approval Failed',
        description: 'Failed to approve payment. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleRevisionRequested = () => {
    if (paymentStatus && onStatusUpdate) {
      const updatedStatus: CritiquePaymentStatus = {
        ...paymentStatus,
        payment_status: 'disputed',
        disputed: true
      };
      onStatusUpdate(updatedStatus);
    }
  };

  if (!isPending) {
    return null;
  }

  return (
    <>
      <div className="flex space-x-3 mt-4">
        <Button
          onClick={handleApprove}
          disabled={isApproving}
          className="flex-1"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          {isApproving ? 'Approving...' : '✅ Approve Critique'}
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowRevisionModal(true)}
          className="flex-1"
        >
          <Edit className="h-4 w-4 mr-2" />
          ✏️ Needs Revision
        </Button>
      </div>

      <RevisionRequestModal
        isOpen={showRevisionModal}
        onClose={() => setShowRevisionModal(false)}
        critiqueId={critiqueId}
        userId={userId}
        onRevisionRequested={handleRevisionRequested}
      />
    </>
  );
};

export default CritiquePaymentActions;