import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AdjudicatorAdminProfile } from '@/types/adjudicatorAdmin';

interface AdjudicatorPermissionsProps {
  adjudicator: AdjudicatorAdminProfile;
  onUpdate: (updatedFields: Partial<AdjudicatorAdminProfile>) => void;
}

const AdjudicatorPermissions: React.FC<AdjudicatorPermissionsProps> = ({ adjudicator, onUpdate }) => {
  const handlePermissionChange = (permissionKey: keyof AdjudicatorAdminProfile['permissions'], value: boolean) => {
    onUpdate({
      permissions: {
        ...adjudicator.permissions,
        [permissionKey]: value
      }
    });
  };

  const handleNotificationsChange = (value: boolean) => {
    onUpdate({ notificationsEnabled: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissions</CardTitle>
        <CardDescription>
          Control what this adjudicator can do on the platform
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="availableForCritiques" className="text-base">Available for Critiques</Label>
              <p className="text-sm text-muted-foreground">
                Allow this adjudicator to receive new critique assignments
              </p>
            </div>
            <Switch
              id="availableForCritiques"
              checked={adjudicator.permissions.availableForCritiques}
              onCheckedChange={(checked) => handlePermissionChange('availableForCritiques', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="publiclyVisible" className="text-base">Publicly Visible</Label>
              <p className="text-sm text-muted-foreground">
                Show this adjudicator in the public adjudicator list
              </p>
            </div>
            <Switch
              id="publiclyVisible"
              checked={adjudicator.permissions.publiclyVisible}
              onCheckedChange={(checked) => handlePermissionChange('publiclyVisible', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="canUseAdvancedTools" className="text-base">Advanced Critique Tools</Label>
              <p className="text-sm text-muted-foreground">
                Allow use of drawing tools and advanced critique features
              </p>
            </div>
            <Switch
              id="canUseAdvancedTools"
              checked={adjudicator.permissions.canUseAdvancedTools}
              onCheckedChange={(checked) => handlePermissionChange('canUseAdvancedTools', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notificationsEnabled" className="text-base">Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send email notifications for new assignments and platform updates
              </p>
            </div>
            <Switch
              id="notificationsEnabled"
              checked={adjudicator.notificationsEnabled}
              onCheckedChange={handleNotificationsChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdjudicatorPermissions;
