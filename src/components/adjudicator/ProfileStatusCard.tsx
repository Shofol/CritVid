import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import AccountStatusToggle from "./AccountStatusToggle";

interface ProfileStatusCardProps {
  isActive: boolean;
  adjudicatorId: string;
  onStatusChange?: (newStatus: boolean) => void;
}

const ProfileStatusCard: React.FC<ProfileStatusCardProps> = ({
  isActive,
  adjudicatorId,
  onStatusChange,
}) => {
  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex flex-col">
              <h3 className="font-semibold text-sm text-gray-900">
                Account Status
              </h3>
              <p className="text-xs text-gray-600">
                {isActive
                  ? "Active - Receiving critique requests"
                  : "Suspended - Hidden from dancers"}
              </p>
            </div>
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {isActive ? "Active" : "Suspended"}
            </div>
          </div>
          <AccountStatusToggle
            isActive={isActive}
            adjudicatorId={adjudicatorId}
            onStatusChange={onStatusChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileStatusCard;
