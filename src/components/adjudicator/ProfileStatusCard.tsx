import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AccountStatusToggle from './AccountStatusToggle';

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
    <Card>
      <CardHeader>
        <CardTitle>Account Status</CardTitle>
        <CardDescription>
          {isActive 
            ? 'Your profile is currently visible to dancers seeking critiques.' 
            : 'Your profile is currently hidden from dancers seeking critiques.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Current Status:</span>
            <span className={`px-2 py-1 rounded-full text-sm ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isActive ? 'Active' : 'Suspended'}
            </span>
          </div>
          
          <div className="pt-2">
            <p className="text-sm text-muted-foreground mb-4">
              {isActive 
                ? 'Need a break? Suspend your account temporarily to stop receiving new critique requests.'
                : 'Ready to return? Reactivate your account to start receiving critique requests again.'}
            </p>
            
            <AccountStatusToggle 
              isActive={isActive} 
              adjudicatorId={adjudicatorId} 
              onStatusChange={onStatusChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileStatusCard;