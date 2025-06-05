import React from 'react';
import { User } from '@/types/user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Mail, RefreshCw, UserX, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserAccountControlsProps {
  user: User;
  onUpdate: (updatedUser: Partial<User>) => void;
}

const UserAccountControls: React.FC<UserAccountControlsProps> = ({ user, onUpdate }) => {
  const { toast } = useToast();

  const handleResetPassword = () => {
    // In a real implementation, this would call an API endpoint
    toast({
      title: "Password reset email sent",
      description: `A password reset link has been sent to ${user.email}`,
    });
  };

  const handleResendWelcome = () => {
    // In a real implementation, this would call an API endpoint
    toast({
      title: "Welcome email sent",
      description: `A welcome email has been sent to ${user.email}`,
    });
  };

  const handleToggleStatus = () => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    onUpdate({ status: newStatus });
    
    toast({
      title: `User ${newStatus === 'active' ? 'activated' : 'suspended'}`,
      description: `${user.name}'s account has been ${newStatus === 'active' ? 'activated' : 'suspended'}`,
    });
  };

  const handleDeactivateAccount = () => {
    onUpdate({ status: 'deleted' });
    
    toast({
      title: "Account deactivated",
      description: `${user.name}'s account has been deactivated`,
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
          <CardDescription>
            Manage user's account access and authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="justify-start" 
              onClick={handleResetPassword}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Password
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start" 
              onClick={handleResendWelcome}
            >
              <Mail className="mr-2 h-4 w-4" />
              Resend Welcome Email
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="text-amber-800">Account Status Controls</CardTitle>
          <CardDescription className="text-amber-700">
            These actions affect the user's ability to access the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant={user.status === 'active' ? 'destructive' : 'default'}
            className="w-full justify-start"
            onClick={handleToggleStatus}
          >
            {user.status === 'active' ? (
              <>
                <UserX className="mr-2 h-4 w-4" />
                Suspend Account
              </>
            ) : (
              <>
                <UserCheck className="mr-2 h-4 w-4" />
                Reinstate Account
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800">Danger Zone</CardTitle>
          <CardDescription className="text-red-700">
            These actions cannot be undone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            className="w-full justify-start"
            onClick={handleDeactivateAccount}
          >
            <AlertCircle className="mr-2 h-4 w-4" />
            Deactivate Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAccountControls;
