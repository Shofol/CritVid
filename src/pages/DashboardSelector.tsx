import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import DashboardSwitcher from '@/components/DashboardSwitcher';

const DashboardSelector: React.FC = () => {
  return (
    <AppLayout>
      <DashboardSwitcher />
    </AppLayout>
  );
};

export default DashboardSelector;