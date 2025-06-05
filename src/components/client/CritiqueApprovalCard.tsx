import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { paymentService, CritiquePaymentStatus } from '@/lib/paymentService';
import { useToast } from '@/hooks/use-toast';

interface CritiqueApprovalCardProps {
  critiqueId: string;
  userId: string;
  paymentStatus: CritiquePaymentStatus;
  onStatusUpdate: (newStatus: CritiquePaymentStatus) => void;
}

const CritiqueApprovalCard: React.FC<CritiqueApprovalCardProps> = ({
  critiqueId,
  userId,
  paymentStatus,
  onStatusUpdate
}) => {
  const [isApproving, setIsApproving] = useState(false);
  const { toast } = useToast();

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const result = await paymentService.approveCritiquePayment(critiqueId, userId);
      if (result.success) {
        toast({
          title: 'Payment Approved',
          description: 'The critique payment has been released to the adjudicator.'
        });
        onStatusUpdate(result.critique);
      }
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

  const getStatusIcon = () => {
    switch (paymentStatus.payment_status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'auto_approved':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'disputed':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getExpectedReleaseDate = () => {
    if (!paymentStatus.finalized_at) return null;
    return paymentService.getExpectedReleaseDate(paymentStatus.finalized_at);
  };

  const expectedDate = getExpectedReleaseDate();
  const isPending = paymentStatus.payment_status === 'pending_approval';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {getStatusIcon()}
          <span>Payment Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status:</span>
          <Badge variant={isPending ? 'secondary' : 'default'}>
            {paymentService.formatPaymentStatus(paymentStatus.payment_status)}
          </Badge>
        </div>

        {isPending && expectedDate && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Payment will be automatically released on {expectedDate.toLocaleDateString()}
            </AlertDescription>
          </Alert>
        )}

        {isPending && (
          <Button 
            onClick={handleApprove} 
            disabled={isApproving}
            className="w-full"
          >
            {isApproving ? 'Approving...' : 'Approve Critique'}
          </Button>
        )}

        {paymentStatus.payment_released_at && (
          <div className="text-sm text-muted-foreground">
            Payment released on: {new Date(paymentStatus.payment_released_at).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CritiqueApprovalCard;