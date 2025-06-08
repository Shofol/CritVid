import Header from "@/components/Header";
import RoleSidebar from "@/components/RoleSidebar";
import { useApp } from "@/contexts/AppContext";
import React, { useEffect } from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  noHeader = false,
}) => {
  const { sidebarOpen, userRole } = useApp();

  // Debug logging to check the current role in the layout
  useEffect(() => {
    console.log("Current user role in AppLayout:", userRole);
  }, [userRole]);

  return (
    <div className="min-h-screen bg-background">
      {!noHeader && <Header />}
      <div className="flex">
        <RoleSidebar className={sidebarOpen ? "block" : ""} />
        <main className="flex-1 p-4 pt-20 md:ml-64">{children}</main>
      </div>
    </div>
  );
};

export { AppLayout };
export default AppLayout;
