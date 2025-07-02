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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  StripeAccount,
  stripeConnectService,
} from "@/lib/stripeConnectService";
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";

interface StripeConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StripeConnectModal({
  isOpen,
  onClose,
}: StripeConnectModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [accountStatus, setAccountStatus] = useState<{
    hasAccount: boolean;
    isComplete: boolean;
    accountId?: string;
  }>({ hasAccount: false, isComplete: false });
  const [account, setAccount] = useState<StripeAccount | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      checkAccountStatus();
    }
  }, [isOpen]);

  const checkAccountStatus = async () => {
    try {
      const status = await stripeConnectService.checkAccountStatus();
      setAccountStatus(status);

      if (status.hasAccount) {
        const response = await stripeConnectService.getAccount();
        if (response.account) {
          setAccount(response.account);
        }
      }
    } catch (error) {
      console.error("Error checking account status:", error);
    }
  };

  const handleCreateAccount = async () => {
    setIsLoading(true);
    try {
      const response = await stripeConnectService.createAccount();
      if (response.account_id) {
        setAccountStatus({
          hasAccount: true,
          isComplete: false,
          accountId: response.account_id,
        });
        toast({
          title: "Account Created",
          description: "Your Stripe account has been created successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOnboarding = async () => {
    setIsLoading(true);
    try {
      const returnUrl = `${window.location.origin}/adjudicator/payments`;
      const response = await stripeConnectService.createOnboardingLink(
        returnUrl
      );
      if (response.url) {
        window.open(response.url, "_blank");
        toast({
          title: "Onboarding Started",
          description:
            "Please complete the onboarding process in the new window.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to start onboarding",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    await checkAccountStatus();
    if (accountStatus.isComplete) {
      onClose();
    }
  };

  const getStatusBadge = () => {
    if (!accountStatus.hasAccount) {
      return (
        <Badge variant="outline" className="text-gray-600">
          Not Connected
        </Badge>
      );
    }
    if (accountStatus.isComplete) {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Stripe Connect Setup
          </DialogTitle>
          <DialogDescription>
            Connect your Stripe account to receive payments for your critiques
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Connection Status:
                </span>
                {getStatusBadge()}
              </div>
            </CardContent>
          </Card>

          {/* Account Details */}
          {account && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Account ID:</span>
                    <p className="font-mono text-xs">{account.id}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Country:</span>
                    <p>{account.country.toUpperCase()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Charges Enabled:
                    </span>
                    <p>{account.charges_enabled ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Payouts Enabled:
                    </span>
                    <p>{account.payouts_enabled ? "Yes" : "No"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Requirements */}
          {account && account.requirements && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Requirements</CardTitle>
                <CardDescription>
                  Complete these requirements to enable payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {account.requirements.currently_due.length > 0 && (
                    <div>
                      <h4 className="font-medium text-red-600">
                        Currently Due:
                      </h4>
                      <ul className="list-disc list-inside text-sm text-red-600">
                        {account.requirements.currently_due.map(
                          (req, index) => (
                            <li key={index}>{req}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                  {account.requirements.eventually_due.length > 0 && (
                    <div>
                      <h4 className="font-medium text-yellow-600">
                        Eventually Due:
                      </h4>
                      <ul className="list-disc list-inside text-sm text-yellow-600">
                        {account.requirements.eventually_due.map(
                          (req, index) => (
                            <li key={index}>{req}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            {!accountStatus.hasAccount ? (
              <Button
                onClick={handleCreateAccount}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CreditCard className="w-4 h-4" />
                )}
                Create Stripe Account
              </Button>
            ) : !accountStatus.isComplete ? (
              <Button
                onClick={handleStartOnboarding}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4" />
                )}
                Complete Onboarding
              </Button>
            ) : (
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            )}

            {accountStatus.hasAccount && !accountStatus.isComplete && (
              <Button onClick={handleRefresh} variant="outline">
                Refresh Status
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
