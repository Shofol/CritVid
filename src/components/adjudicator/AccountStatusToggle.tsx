import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import React, { useState } from "react";

interface AccountStatusToggleProps {
  isActive: boolean;
  adjudicatorId: string;
  onStatusChange?: (newStatus: boolean) => void;
}

const AccountStatusToggle: React.FC<AccountStatusToggleProps> = ({
  isActive,
  adjudicatorId,
  onStatusChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(isActive);
  const { toast } = useToast();

  const toggleAccountStatus = async () => {
    try {
      setLoading(true);

      const newStatus = !currentStatus;

      // First try to use the Supabase function
      try {
        const response = await fetch(
          "https://tasowytszirhdvdiwuia.supabase.co/functions/v1/20c7a8e8-33f2-4aa8-9946-b78afcdaabc7",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              adjudicatorId,
              isActive: newStatus,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Function call failed");
        }
      } catch (functionError) {
        console.error(
          "Function error, falling back to direct update:",
          functionError
        );
        // Fallback to direct database update
        const { error } = await supabase
          .from("adjudicator_profiles")
          .update({ is_active: newStatus })
          .eq("id", adjudicatorId);

        if (error) throw error;
      }

      setCurrentStatus(newStatus);
      if (onStatusChange) onStatusChange(newStatus);

      toast({
        title: newStatus ? "Account Reactivated" : "Account Suspended",
        description: newStatus
          ? "Your account is now active and visible to dancers."
          : "Your account is now suspended and hidden from dancers.",
        variant: newStatus ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error updating account status:", error);
      toast({
        title: "Error",
        description: "Failed to update your account status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={toggleAccountStatus}
      disabled={loading}
      size="sm"
      variant={currentStatus ? "outline" : "default"}
      className={`min-w-[140px] ${
        currentStatus
          ? "border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
          : "bg-blue-600 hover:bg-blue-700 text-white"
      }`}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
          <span>Processing</span>
        </div>
      ) : (
        <span>{currentStatus ? "Suspend Account" : "Activate Account"}</span>
      )}
    </Button>
  );
};

export default AccountStatusToggle;
