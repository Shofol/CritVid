import React, { useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import Header from '@/components/Header';
import RoleSidebar from '@/components/RoleSidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { sidebarOpen, userRole } = useApp();

  // Debug logging to check the current role in the layout
  useEffect(() => {
    console.log('Current user role in AppLayout:', userRole);
  }, [userRole]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <RoleSidebar className={sidebarOpen ? 'block' : ''} />
        <main className="flex-1 p-4 pt-20 md:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
};

export { AppLayout };
export default AppLayout;
