import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Clock } from 'lucide-react';
import { CritiquePaymentStatus } from '@/lib/paymentService';

interface PaymentStatusBarProps {
  paymentStatus: CritiquePaymentStatus | null;
}

const PaymentStatusBar: React.FC<PaymentStatusBarProps> = ({ paymentStatus }) => {
  // Handle null or undefined paymentStatus
  if (!paymentStatus) {
    return (
      <Alert className="border-gray-200 bg-gray-50">
        <Clock className="h-4 w-4 text-gray-600" />
        <AlertDescription className="text-gray-800">
          Loading payment status...
        </AlertDescription>
      </Alert>
    );
  }

  // Safe access to payment_status with fallback
  const status = paymentStatus.payment_status || 'pending_approval';
  const isApproved = status === 'approved' || status === 'auto_approved';
  
  if (isApproved) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          ✔ Payment Approved – Your adjudicator has been paid.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-yellow-200 bg-yellow-50">
      <Clock className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-800">
        ⏳ Awaiting Your Review – Approve or request a revision below.
      </AlertDescription>
    </Alert>
  );
};

export default PaymentStatusBar;