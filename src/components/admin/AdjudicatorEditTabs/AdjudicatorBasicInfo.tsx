import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AdjudicatorAdminProfile } from '@/types/adjudicatorAdmin';

interface AdjudicatorBasicInfoProps {
  adjudicator: AdjudicatorAdminProfile;
  onUpdate: (updatedFields: Partial<AdjudicatorAdminProfile>) => void;
}

const AdjudicatorBasicInfo: React.FC<AdjudicatorBasicInfoProps> = ({ adjudicator, onUpdate }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onUpdate({ [e.target.name]: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    onUpdate({ accountStatus: value as 'active' | 'suspended' | 'archived' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={adjudicator.fullName}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={adjudicator.email}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio / Credentials</Label>
          <Textarea
            id="bio"
            name="bio"
            value={adjudicator.bio}
            onChange={handleInputChange}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="accountStatus">Account Status</Label>
            <Select 
              value={adjudicator.accountStatus} 
              onValueChange={handleStatusChange}
            >
              <SelectTrigger id="accountStatus">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Dance Styles</Label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-md">
              {adjudicator.danceStyles.map((style, index) => (
                <Badge key={index} variant="secondary">{style}</Badge>
              ))}
              <Button variant="ghost" size="sm" className="h-6">+ Add</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdjudicatorBasicInfo;
