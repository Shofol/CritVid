import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AdjudicatorAdminProfile } from '@/types/adjudicatorAdmin';
import AdjudicatorBasicInfo from './AdjudicatorEditTabs/AdjudicatorBasicInfo';
import AdjudicatorPermissions from './AdjudicatorEditTabs/AdjudicatorPermissions';
import AdjudicatorFinancials from './AdjudicatorEditTabs/AdjudicatorFinancials';
import { AdjudicatorActivity, AdjudicatorAccountControls } from './AdjudicatorEditTabs/AdjudicatorActivityAndControls';

interface AdjudicatorEditTabsProps {
  adjudicator: AdjudicatorAdminProfile;
  onAdjudicatorUpdate: (updatedAdjudicator: Partial<AdjudicatorAdminProfile>) => void;
}

const AdjudicatorEditTabs: React.FC<AdjudicatorEditTabsProps> = ({ 
  adjudicator, 
  onAdjudicatorUpdate 
}) => {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
        <TabsTrigger value="financials">Financials</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="account">Account Controls</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic">
        <AdjudicatorBasicInfo adjudicator={adjudicator} onUpdate={onAdjudicatorUpdate} />
      </TabsContent>
      
      <TabsContent value="permissions">
        <AdjudicatorPermissions adjudicator={adjudicator} onUpdate={onAdjudicatorUpdate} />
      </TabsContent>
      
      <TabsContent value="financials">
        <AdjudicatorFinancials adjudicator={adjudicator} onUpdate={onAdjudicatorUpdate} />
      </TabsContent>
      
      <TabsContent value="activity">
        <AdjudicatorActivity adjudicator={adjudicator} />
      </TabsContent>
      
      <TabsContent value="account">
        <AdjudicatorAccountControls adjudicator={adjudicator} onUpdate={onAdjudicatorUpdate} />
      </TabsContent>
    </Tabs>
  );
};

export default AdjudicatorEditTabs;
