import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';

// Mock payment data
const mockPayments = [
  {
    id: '1',
    critiqueId: 'CR-001',
    studentName: 'Emma Johnson',
    amount: 75.00,
    status: 'pending',
    submittedDate: '2024-01-15',
    paidDate: null,
    videoTitle: 'Contemporary Solo Performance'
  },
  {
    id: '2',
    critiqueId: 'CR-002',
    studentName: 'Michael Chen',
    amount: 85.00,
    status: 'paid',
    submittedDate: '2024-01-10',
    paidDate: '2024-01-12',
    videoTitle: 'Jazz Technique Routine'
  },
  {
    id: '3',
    critiqueId: 'CR-003',
    studentName: 'Sarah Williams',
    amount: 90.00,
    status: 'approved',
    submittedDate: '2024-01-08',
    paidDate: null,
    videoTitle: 'Ballet Variation'
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="text-yellow-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    case 'approved':
      return <Badge variant="outline" className="text-blue-600"><AlertCircle className="w-3 h-3 mr-1" />Approved</Badge>;
    case 'paid':
      return <Badge variant="outline" className="text-green-600"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function AdjudicatorPayments() {
  const totalPending = mockPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalEarned = mockPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalApproved = mockPayments.filter(p => p.status === 'approved').reduce((sum, p) => sum + p.amount, 0);

  return (
    <AppLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Payments</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalEarned.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">From completed critiques</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalPending.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalApproved.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Ready for payment</p>
            </CardContent>
          </Card>
        </div>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Track your critique payments and earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Critique ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Video Title</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Paid Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.critiqueId}</TableCell>
                    <TableCell>{payment.studentName}</TableCell>
                    <TableCell>{payment.videoTitle}</TableCell>
                    <TableCell>${payment.amount.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>{payment.submittedDate}</TableCell>
                    <TableCell>{payment.paidDate || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}