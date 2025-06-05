import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AdjudicatorAdminProfile, AdjudicatorCritique } from '@/types/adjudicatorAdmin';

interface AdjudicatorActivityAndControlsProps {
  adjudicator: AdjudicatorAdminProfile;
  onUpdate?: (updatedFields: Partial<AdjudicatorAdminProfile>) => void;
}

// Mock critique data
const mockCritiques: AdjudicatorCritique[] = [
  {
    id: '1',
    videoTitle: 'Ballet Solo Performance',
    clientName: 'Emma Johnson',
    dateAssigned: '2023-07-10',
    dateCompleted: '2023-07-12',
    status: 'completed',
    earnings: 45.00
  },
  {
    id: '2',
    videoTitle: 'Contemporary Group Routine',
    clientName: 'Dance Studio A',
    dateAssigned: '2023-07-15',
    status: 'in_progress',
    earnings: 60.00
  },
  {
    id: '3',
    videoTitle: 'Jazz Competition Solo',
    clientName: 'Michael Smith',
    dateAssigned: '2023-07-18',
    status: 'pending',
    earnings: 40.00
  }
];

// Combined component for both Activity and Account Controls tabs
const AdjudicatorActivityAndControls: React.FC<AdjudicatorActivityAndControlsProps> = ({ 
  adjudicator, 
  onUpdate 
}) => {
  // Activity section
  const renderActivitySection = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Activity & Performance</CardTitle>
        <CardDescription>
          Review adjudicator's activity and performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Critiques Completed</div>
            <div className="text-2xl font-bold">{adjudicator.performance.critiquesCompleted}</div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Average Rating</div>
            <div className="text-2xl font-bold">{adjudicator.performance.averageRating} ⭐</div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Last Active</div>
            <div className="text-lg font-medium">{adjudicator.performance.lastActive}</div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Pending Critiques</div>
            <div className="text-2xl font-bold">{adjudicator.performance.pendingCritiques}</div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="internalNotes">Internal Notes</Label>
          <Textarea
            id="internalNotes"
            value={adjudicator.performance.internalNotes}
            onChange={(e) => onUpdate?.({ 
              performance: { ...adjudicator.performance, internalNotes: e.target.value } 
            })}
            rows={3}
            placeholder="Add internal notes about this adjudicator..."
          />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Recent Critiques</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Video Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date Assigned</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Earnings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCritiques.map((critique) => (
                <TableRow key={critique.id}>
                  <TableCell>{critique.videoTitle}</TableCell>
                  <TableCell>{critique.clientName}</TableCell>
                  <TableCell>{critique.dateAssigned}</TableCell>
                  <TableCell>
                    <Badge variant={critique.status === 'completed' ? 'default' : 
                      critique.status === 'in_progress' ? 'secondary' : 'outline'}>
                      {critique.status}
                    </Badge>
                  </TableCell>
                  <TableCell>${critique.earnings.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Assign New Critique</Button>
      </CardFooter>
    </Card>
  );

  // Account Controls section
  const renderAccountControlsSection = () => (
    <Card>
      <CardHeader>
        <CardTitle>Account Controls</CardTitle>
        <CardDescription>
          Manage adjudicator account settings and access
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-base font-medium">Account Tags</h3>
              <div className="flex flex-wrap gap-2">
                {adjudicator.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))}
                <Button variant="outline" size="sm">+ Add Tag</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-base font-medium">Account Status</h3>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={adjudicator.accountStatus === 'active' ? 'default' : 
                    adjudicator.accountStatus === 'suspended' ? 'destructive' : 'outline'}
                >
                  {adjudicator.accountStatus}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-base font-medium mb-2">Account Actions</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline">Reset Password</Button>
              <Button variant="outline">Send Login Link</Button>
              <Button variant="outline">Send Welcome Email</Button>
              <Button 
                variant={adjudicator.accountStatus === 'suspended' ? 'default' : 'destructive'}
              >
                {adjudicator.accountStatus === 'suspended' ? 'Reinstate Account' : 'Suspend Account'}
              </Button>
              <Button variant="destructive">Deactivate Account</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {renderActivitySection()}
      {renderAccountControlsSection()}
    </div>
  );
};

// Export separate components that use the combined implementation
export const AdjudicatorActivity: React.FC<AdjudicatorActivityAndControlsProps> = (props) => {
  return <AdjudicatorActivityAndControls {...props} />;
};

export const AdjudicatorAccountControls: React.FC<AdjudicatorActivityAndControlsProps> = (props) => {
  return <AdjudicatorActivityAndControls {...props} />;
};

export default AdjudicatorActivityAndControls;
