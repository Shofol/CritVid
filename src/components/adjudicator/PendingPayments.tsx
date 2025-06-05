import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PendingPayment {
  id: string;
  critiqueTitle: string;
  clientName: string;
  amount: number;
  completedDate: string;
  paymentStatus: 'pending_release' | 'approved' | 'released';
  daysRemaining?: number;
}

const PendingPayments: React.FC = () => {
  const [payments, setPayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      // Mock data for now - replace with actual API call
      setTimeout(() => {
        setPayments([
          {
            id: '1',
            critiqueTitle: 'Ballet Technique Assessment',
            clientName: 'Emma Johnson',
            amount: 75,
            completedDate: '2024-01-15',
            paymentStatus: 'pending_release',
            daysRemaining: 3
          },
          {
            id: '2',
            critiqueTitle: 'Jazz Routine Critique',
            clientName: 'Michael Chen',
            amount: 85,
            completedDate: '2024-01-10',
            paymentStatus: 'approved',
            daysRemaining: 0
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, daysRemaining?: number) => {
    switch (status) {
      case 'pending_release':
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {daysRemaining ? `${daysRemaining} days left` : 'Pending'}
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        );
      case 'released':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            Released
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Pending Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <DollarSign className="h-5 w-5 mr-2" />
          Pending Payments
        </CardTitle>
      </CardHeader>
      <CardContent>
        {payments.length > 0 ? (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{payment.critiqueTitle}</h3>
                    <p className="text-sm text-muted-foreground">Client: {payment.clientName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">${payment.amount}</p>
                    {getStatusBadge(payment.paymentStatus, payment.daysRemaining)}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Completed: {payment.completedDate}</span>
                  {payment.paymentStatus === 'pending_release' && (
                    <span className="text-amber-600">
                      Payment releases in {payment.daysRemaining} days
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No pending payments at this time.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingPayments;