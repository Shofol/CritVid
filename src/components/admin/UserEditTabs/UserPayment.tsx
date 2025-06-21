import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaymentRecord, User } from "@/types/user";
import React, { useState } from "react";

interface UserPaymentProps {
  user: User;
  onUpdate: (updatedUser: Partial<User>) => void;
}

const UserPayment: React.FC<UserPaymentProps> = ({ user, onUpdate }) => {
  // Initialize payment object if it doesn't exist
  const payment = user.payment || {
    history: [],
    accountCredit: 0,
    payoutSplit: user.role === "adjudicator" ? 60 : undefined,
    payoutStatus: user.role === "adjudicator" ? "active" : undefined,
  };

  const [creditAmount, setCreditAmount] = useState<string>("20");
  const [payoutSplit, setPayoutSplit] = useState<number[]>([
    payment.payoutSplit || 60,
  ]);

  const handleAddCredit = () => {
    const amount = parseFloat(creditAmount);
    if (isNaN(amount) || amount <= 0) return;

    const newPayment = {
      ...payment,
      accountCredit: (payment.accountCredit || 0) + amount,
      history: [
        ...payment.history,
        {
          id: Date.now().toString(),
          date: new Date().toISOString().split("T")[0],
          amount: amount,
          type: "credit",
          status: "completed",
          description: "Manual credit by admin",
        },
        ...payment.history,
      ],
    };

    onUpdate({ payment: newPayment });
    setCreditAmount("20");
  };

  const handleRefund = (paymentId: string) => {
    const paymentToRefund = payment.history.find((p) => p.id === paymentId);
    if (!paymentToRefund || paymentToRefund.type === "refund") return;

    const newPayment = {
      ...payment,
      history: [
        {
          id: Date.now().toString(),
          date: new Date().toISOString().split("T")[0],
          amount: paymentToRefund.amount,
          type: "refund",
          status: "completed",
          description: `Refund for payment ${paymentId}`,
        },
        ...payment.history,
      ],
    };

    onUpdate({ payment: newPayment });
  };

  const handlePayoutSplitChange = (values: number[]) => {
    setPayoutSplit(values);
    onUpdate({
      payment: {
        ...payment,
        payoutSplit: values[0],
      },
    });
  };

  const togglePayoutStatus = () => {
    const newStatus = payment.payoutStatus === "active" ? "paused" : "active";
    onUpdate({
      payment: {
        ...payment,
        payoutStatus: newStatus,
      },
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Credit</CardTitle>
          <CardDescription>
            Current Balance: ${payment.accountCredit?.toFixed(2) || "0.00"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="creditAmount">Add Credit Amount ($)</Label>
              <Input
                id="creditAmount"
                type="number"
                min="0"
                step="5"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
              />
            </div>
            <Button onClick={handleAddCredit}>Add Credit</Button>
          </div>
        </CardContent>
      </Card>

      {user.role === "adjudicator" && (
        <Card>
          <CardHeader>
            <CardTitle>Payout Settings</CardTitle>
            <CardDescription>
              Configure how payments are handled for this adjudicator
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Payment Split</Label>
                  <span className="text-sm">
                    Platform: {100 - payoutSplit[0]}% / Adjudicator:{" "}
                    {payoutSplit[0]}%
                  </span>
                </div>
                <Slider
                  defaultValue={[payment.payoutSplit || 60]}
                  max={90}
                  min={10}
                  step={5}
                  value={payoutSplit}
                  onValueChange={handlePayoutSplitChange}
                />
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Payout Status</h4>
                  <p className="text-sm text-muted-foreground">
                    {payment.payoutStatus === "active"
                      ? "Payouts are currently enabled"
                      : "Payouts are currently paused"}
                  </p>
                </div>
                <Button
                  variant={
                    payment.payoutStatus === "active"
                      ? "destructive"
                      : "default"
                  }
                  onClick={togglePayoutStatus}
                >
                  {payment.payoutStatus === "active"
                    ? "Pause Payouts"
                    : "Enable Payouts"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {payment.history && payment.history.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payment.history.map((record: PaymentRecord) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.description}</TableCell>
                    <TableCell>${record.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <PaymentTypeBadge type={record.type} />
                    </TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={record.status} />
                    </TableCell>
                    <TableCell>
                      {record.type === "purchase" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRefund(record.id)}
                        >
                          Refund
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              No payment history available
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface PaymentTypeBadgeProps {
  type: string;
}

const PaymentTypeBadge: React.FC<PaymentTypeBadgeProps> = ({ type }) => {
  switch (type) {
    case "purchase":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          Purchase
        </Badge>
      );
    case "refund":
      return (
        <Badge
          variant="outline"
          className="bg-amber-50 text-amber-700 border-amber-200"
        >
          Refund
        </Badge>
      );
    case "payout":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          Payout
        </Badge>
      );
    case "credit":
      return (
        <Badge
          variant="outline"
          className="bg-purple-50 text-purple-700 border-purple-200"
        >
          Credit
        </Badge>
      );
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
};

interface PaymentStatusBadgeProps {
  status: string;
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case "completed":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          Completed
        </Badge>
      );
    case "pending":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200"
        >
          Pending
        </Badge>
      );
    case "failed":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          Failed
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default UserPayment;
