import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { User } from '@/types/user';
import UserBasicInfo from './UserEditTabs/UserBasicInfo';
import UserPermissions from './UserEditTabs/UserPermissions';
import UserPayment from './UserEditTabs/UserPayment';
import UserActivity from './UserEditTabs/UserActivity';
import UserAccountControls from './UserEditTabs/UserAccountControls';

interface UserEditTabsProps {
  user: User;
  onUserUpdate: (updatedUser: Partial<User>) => void;
}

const UserEditTabs: React.FC<UserEditTabsProps> = ({ user, onUserUpdate }) => {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
        <TabsTrigger value="payment">Payment</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="account">Account Controls</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic">
        <UserBasicInfo user={user} onUpdate={onUserUpdate} />
      </TabsContent>
      
      <TabsContent value="permissions">
        <UserPermissions user={user} onUpdate={onUserUpdate} />
      </TabsContent>
      
      <TabsContent value="payment">
        <UserPayment user={user} onUpdate={onUserUpdate} />
      </TabsContent>
      
      <TabsContent value="activity">
        <UserActivity user={user} />
      </TabsContent>
      
      <TabsContent value="account">
        <UserAccountControls user={user} onUpdate={onUserUpdate} />
      </TabsContent>
    </Tabs>
  );
};

export default UserEditTabs;
