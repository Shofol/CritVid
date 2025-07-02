import { StripeConnectModal } from "@/components/adjudicator/StripeConnectModal";
import { AppLayout } from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  StripeAccount,
  stripeConnectService,
} from "@/lib/stripeConnectService";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Loader2,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";

// Mock payment data
const mockPayments = [
  {
    id: "1",
    critiqueId: "CR-001",
    studentName: "Emma Johnson",
    amount: 75.0,
    status: "pending",
    submittedDate: "2024-01-15",
    paidDate: null,
    videoTitle: "Contemporary Solo Performance",
  },
  {
    id: "2",
    critiqueId: "CR-002",
    studentName: "Michael Chen",
    amount: 85.0,
    status: "paid",
    submittedDate: "2024-01-10",
    paidDate: "2024-01-12",
    videoTitle: "Jazz Technique Routine",
  },
  {
    id: "3",
    critiqueId: "CR-003",
    studentName: "Sarah Williams",
    amount: 90.0,
    status: "approved",
    submittedDate: "2024-01-08",
    paidDate: null,
    videoTitle: "Ballet Variation",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="text-yellow-600">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    case "approved":
      return (
        <Badge variant="outline" className="text-blue-600">
          <AlertCircle className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    case "paid":
      return (
        <Badge variant="outline" className="text-green-600">
          <CheckCircle className="w-3 h-3 mr-1" />
          Paid
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function AdjudicatorPayments() {
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [stripeStatus, setStripeStatus] = useState<{
    hasAccount: boolean;
    isComplete: boolean;
    accountId?: string;
  }>({ hasAccount: false, isComplete: false });
  const [stripeAccount, setStripeAccount] = useState<StripeAccount | null>(
    null
  );
  const [isLoadingAccount, setIsLoadingAccount] = useState(false);

  useEffect(() => {
    checkStripeStatus();
  }, []);

  const checkStripeStatus = async () => {
    try {
      const status = await stripeConnectService.checkAccountStatus();
      setStripeStatus(status);

      // If account exists, fetch the full account details
      if (status.hasAccount) {
        setIsLoadingAccount(true);
        try {
          const response = await stripeConnectService.getAccount();
          if (response.account) {
            setStripeAccount(response.account);
          }
        } catch (error) {
          console.error("Error fetching account details:", error);
        } finally {
          setIsLoadingAccount(false);
        }
      }
    } catch (error) {
      console.error("Error checking Stripe status:", error);
    }
  };

  const handleConnectStripe = () => {
    setIsStripeModalOpen(true);
  };

  const handleStripeModalClose = () => {
    setIsStripeModalOpen(false);
    checkStripeStatus(); // Refresh status when modal closes
  };

  const getStripeStatusBadge = () => {
    if (!stripeStatus.hasAccount) {
      return (
        <Badge variant="outline" className="text-gray-600">
          Not Connected
        </Badge>
      );
    }
    if (stripeStatus.isComplete) {
      return (
        <Badge variant="outline" className="text-green-600">
          <CheckCircle className="w-3 h-3 mr-1" />
          Connected
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-yellow-600">
        <AlertCircle className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    );
  };

  const totalPending = mockPayments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalEarned = mockPayments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalApproved = mockPayments
    .filter((p) => p.status === "approved")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <AppLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Payments</h1>
          {!stripeStatus.hasAccount ? (
            <Button
              onClick={handleConnectStripe}
              className="flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Connect Stripe
            </Button>
          ) : (
            <Button
              onClick={handleConnectStripe}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Settings className="w-4 h-4" />
              Manage Stripe
            </Button>
          )}
        </div>

        {/* Stripe Account Status Card - Show when connected */}
        {stripeStatus.hasAccount && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Stripe Account Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">
                  Connection Status:
                </span>
                {getStripeStatusBadge()}
              </div>

              {isLoadingAccount ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">
                    Loading account details...
                  </span>
                </div>
              ) : (
                stripeAccount && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Account ID:</span>
                      <p className="font-mono text-xs">{stripeAccount.id}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Country:</span>
                      <p>{stripeAccount.country.toUpperCase()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Charges Enabled:
                      </span>
                      <p>{stripeAccount.charges_enabled ? "Yes" : "No"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Payouts Enabled:
                      </span>
                      <p>{stripeAccount.payouts_enabled ? "Yes" : "No"}</p>
                    </div>
                  </div>
                )
              )}

              {/* Requirements Section */}
              {stripeAccount && stripeAccount.requirements && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Account Requirements</h4>
                  <div className="space-y-2">
                    {stripeAccount.requirements.currently_due.length > 0 && (
                      <div>
                        <h5 className="font-medium text-red-600 text-sm">
                          Currently Due:
                        </h5>
                        <ul className="list-disc list-inside text-sm text-red-600">
                          {stripeAccount.requirements.currently_due.map(
                            (req, index) => (
                              <li key={index}>{req}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                    {stripeAccount.requirements.eventually_due.length > 0 && (
                      <div>
                        <h5 className="font-medium text-yellow-600 text-sm">
                          Eventually Due:
                        </h5>
                        <ul className="list-disc list-inside text-sm text-yellow-600">
                          {stripeAccount.requirements.eventually_due.map(
                            (req, index) => (
                              <li key={index}>{req}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Earned
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalEarned.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                From completed critiques
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Payment
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalPending.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalApproved.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Ready for payment</p>
            </CardContent>
          </Card>
        </div>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>
              Track your critique payments and earnings
            </CardDescription>
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
                    <TableCell className="font-medium">
                      {payment.critiqueId}
                    </TableCell>
                    <TableCell>{payment.studentName}</TableCell>
                    <TableCell>{payment.videoTitle}</TableCell>
                    <TableCell>${payment.amount.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>{payment.submittedDate}</TableCell>
                    <TableCell>{payment.paidDate || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Stripe Connect Modal */}
        <StripeConnectModal
          isOpen={isStripeModalOpen}
          onClose={handleStripeModalClose}
        />
      </div>
    </AppLayout>
  );
}
