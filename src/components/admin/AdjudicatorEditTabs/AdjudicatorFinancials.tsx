import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdjudicatorAdminProfile, AdjudicatorPaymentRecord } from '@/types/adjudicatorAdmin';

interface AdjudicatorFinancialsProps {
  adjudicator: AdjudicatorAdminProfile;
  onUpdate: (updatedFields: Partial<AdjudicatorAdminProfile>) => void;
}

// Mock payment history data
const mockPaymentHistory: AdjudicatorPaymentRecord[] = [
  {
    id: '1',
    date: '2023-07-15',
    amount: 240.00,
    type: 'payout',
    status: 'completed',
    description: 'Monthly payout - July 2023'
  },
  {
    id: '2',
    date: '2023-06-15',
    amount: 180.00,
    type: 'payout',
    status: 'completed',
    description: 'Monthly payout - June 2023'
  },
  {
    id: '3',
    date: '2023-07-10',
    amount: -25.00,
    type: 'refund',
    status: 'completed',
    description: 'Refund for critique #12345'
  },
  {
    id: '4',
    date: '2023-07-20',
    amount: 50.00,
    type: 'bonus',
    status: 'pending',
    description: 'Performance bonus - Quick turnaround'
  }
];

const AdjudicatorFinancials: React.FC<AdjudicatorFinancialsProps> = ({ adjudicator, onUpdate }) => {
  const handleSplitPercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      onUpdate({
        financial: {
          ...adjudicator.financial,
          paymentSplitPercentage: value
        }
      });
    }
  };

  const handlePayoutStatusChange = (value: string) => {
    onUpdate({
      financial: {
        ...adjudicator.financial,
        payoutStatus: value as 'active' | 'paused' | 'hold'
      }
    });
  };

  const handleManualPayout = () => {
    // In a real implementation, this would trigger an API call
    // to process a manual payout to the adjudicator
    alert('Manual payout initiated');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
          <CardDescription>
            Manage payment settings and financial information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentSplit">Payment Split Percentage (Adjudicator's Share)</Label>
              <div className="flex items-center">
                <Input
                  id="paymentSplit"
                  type="number"
                  min="0"
                  max="100"
                  value={adjudicator.financial.paymentSplitPercentage}
                  onChange={handleSplitPercentageChange}
                  className="w-20 mr-2"
                />
                <span>%</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Platform keeps {100 - adjudicator.financial.paymentSplitPercentage}%
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payoutStatus">Payout Status</Label>
              <Select 
                value={adjudicator.financial.payoutStatus} 
                onValueChange={handlePayoutStatusChange}
              >
                <SelectTrigger id="payoutStatus">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active - Process normally</SelectItem>
                  <SelectItem value="paused">Paused - Temporary hold</SelectItem>
                  <SelectItem value="hold">Hold - Requires review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Total Earnings</div>
              <div className="text-2xl font-bold">${adjudicator.financial.totalEarnings.toFixed(2)}</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Payout Schedule</div>
              <div className="text-lg font-medium">{adjudicator.financial.payoutSchedule}</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Critiques Completed</div>
              <div className="text-2xl font-bold">{adjudicator.performance.critiquesCompleted}</div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline">Update Payment Info</Button>
          <Button onClick={handleManualPayout}>Trigger Manual Payout</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPaymentHistory.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell className="capitalize">{payment.type}</TableCell>
                  <TableCell className={payment.type === 'refund' ? 'text-red-500' : ''}>
                    {payment.type === 'refund' ? '-' : ''}
                    ${Math.abs(payment.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {payment.status}
                    </span>
                  </TableCell>
                  <TableCell>{payment.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdjudicatorFinancials;
