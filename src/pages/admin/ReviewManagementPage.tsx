import React, { useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useApp } from '@/contexts/AppContext';
import ReviewManagement from '@/components/admin/ReviewManagement';

const ReviewManagementPage: React.FC = () => {
  const { setUserRole } = useApp();

  useEffect(() => {
    setUserRole('admin');
  }, [setUserRole]);

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Review Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage and moderate adjudicator reviews from clients
          </p>
        </div>
        <ReviewManagement />
      </div>
    </AppLayout>
  );
};

export default ReviewManagementPage;