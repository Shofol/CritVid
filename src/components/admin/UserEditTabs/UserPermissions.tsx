import React, { useState } from 'react';
import { User } from '@/types/user';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { LoadingButton } from '@/components/ui/loading-button';
import { useToast } from '@/hooks/use-toast';

interface UserPermissionsProps {
  user: User;
  onUpdate: (updatedUser: Partial<User>) => void;
}

interface Permissions {
  canUploadVideos: boolean;
  canRequestCritiques: boolean;
  canAccessDashboard: boolean;
  canManageTeam: boolean;
}

const UserPermissions: React.FC<UserPermissionsProps> = ({ user, onUpdate }) => {
  // In a real app, these would come from the user object
  const [permissions, setPermissions] = useState<Permissions>({
    canUploadVideos: true,
    canRequestCritiques: true,
    canAccessDashboard: true,
    canManageTeam: user.role === 'admin',
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handlePermissionChange = (permission: keyof Permissions, value: boolean) => {
    setPermissions(prev => ({ ...prev, [permission]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update user with new permissions
      onUpdate({ permissions: permissions });
      
      toast({
        title: "Permissions updated",
        description: "User permissions have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update permissions.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">User Permissions</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="upload-videos" className="font-medium">Upload Videos</Label>
                  <p className="text-sm text-muted-foreground">Allow user to upload videos to the platform</p>
                </div>
                <Switch
                  id="upload-videos"
                  checked={permissions.canUploadVideos}
                  onCheckedChange={(checked) => handlePermissionChange('canUploadVideos', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="request-critiques" className="font-medium">Request Critiques</Label>
                  <p className="text-sm text-muted-foreground">Allow user to request video critiques</p>
                </div>
                <Switch
                  id="request-critiques"
                  checked={permissions.canRequestCritiques}
                  onCheckedChange={(checked) => handlePermissionChange('canRequestCritiques', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="access-dashboard" className="font-medium">Access Dashboard</Label>
                  <p className="text-sm text-muted-foreground">Allow user to access their dashboard</p>
                </div>
                <Switch
                  id="access-dashboard"
                  checked={permissions.canAccessDashboard}
                  onCheckedChange={(checked) => handlePermissionChange('canAccessDashboard', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="manage-team" className="font-medium">Manage Team</Label>
                  <p className="text-sm text-muted-foreground">Allow user to manage team members</p>
                </div>
                <Switch
                  id="manage-team"
                  checked={permissions.canManageTeam}
                  onCheckedChange={(checked) => handlePermissionChange('canManageTeam', checked)}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <LoadingButton 
                type="submit" 
                isLoading={isSaving} 
                loadingText="Saving..."
              >
                Save Permissions
              </LoadingButton>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default UserPermissions;
