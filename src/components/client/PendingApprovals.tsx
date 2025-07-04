import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import React, { useEffect, useState } from "react";
import { useApp } from "../../contexts/AppContext";
import { getCritiques } from "../../lib/critiqueService";
import { Critique } from "../../types/critiqueTypes";

const PendingApprovals: React.FC = () => {
  const [approvals, setApprovals] = useState<Critique[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useApp();

  useEffect(() => {
    const fetchPendingApprovals = async () => {
      try {
        const response = await getCritiques({
          adjudicatorId: null,
          userId: user.id,
          status: "approving",
        });
        setApprovals(response);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch pending approvals:", error);
        setLoading(false);
      }
    };
    fetchPendingApprovals();
  }, [user]);

  // const handleApproveCritique = async (critiqueId: string) => {
  //   setApproving(critiqueId);
  //   try {
  //     await paymentService.approvePayment(critiqueId);

  //     // Update local state
  //     setApprovals((prev) =>
  //       prev.map((approval) =>
  //         approval.id === critiqueId
  //           ? { ...approval, paymentStatus: "approved" as const }
  //           : approval
  //       )
  //     );

  //     toast({
  //       title: "Critique Approved",
  //       description:
  //         "The critique has been approved and payment will be released to the adjudicator.",
  //     });
  //   } catch (error) {
  //     console.error("Failed to approve critique:", error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to approve critique. Please try again.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setApproving(null);
  //   }
  // };

  // const getStatusBadge = (status: string, daysRemaining: number) => {
  //   switch (status) {
  //     case "pending_approval":
  //       return (
  //         <Badge
  //           variant={daysRemaining <= 2 ? "destructive" : "outline"}
  //           className="flex items-center gap-1"
  //         >
  //           {daysRemaining <= 2 ? (
  //             <AlertTriangle className="h-3 w-3" />
  //           ) : (
  //             <Clock className="h-3 w-3" />
  //           )}
  //           {daysRemaining} days left
  //         </Badge>
  //       );
  //     case "approved":
  //       return (
  //         <Badge variant="default" className="flex items-center gap-1">
  //           <CheckCircle className="h-3 w-3" />
  //           Approved
  //         </Badge>
  //       );
  //     case "auto_approved":
  //       return (
  //         <Badge variant="secondary" className="flex items-center gap-1">
  //           <CheckCircle className="h-3 w-3" />
  //           Auto-Approved
  //         </Badge>
  //       );
  //     default:
  //       return <Badge variant="outline">Unknown</Badge>;
  //   }
  // };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Critique Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // const pendingApprovals = approvals.filter(
  //   (a) => a.paymentStatus === "pending_approval"
  // );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Critique Approvals</CardTitle>
        {approvals.length > 0 && (
          <p className="text-sm text-muted-foreground">
            You have {approvals.length} critique(s) awaiting your approval.
          </p>
        )}
      </CardHeader>
      <CardContent>
        {approvals.length > 0 ? (
          <div className="space-y-4">
            {approvals.map((approval) => (
              <div key={approval.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">{approval.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Adjudicator: {approval.adjudicator.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">${approval.price}</p>
                    {/* {getStatusBadge(
                      approval.paymentStatus,
                      approval.daysRemaining
                    )} */}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Completed: {approval.completedDate}
                  </span>

                  {approval.paymentStatus === "pending_approval" && (
                    <div className="flex items-center gap-2">
                      {approval.daysRemaining <= 2 && (
                        <span className="text-sm text-amber-600">
                          Auto-approves in {approval.daysRemaining} days
                        </span>
                      )}
                      <Button
                        size="sm"
                        onClick={() => handleApproveCritique(approval.id)}
                        disabled={approving === approval.id}
                      >
                        {approving === approval.id
                          ? "Approving..."
                          : "Approve Critique"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No pending critique approvals at this time.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingApprovals;
