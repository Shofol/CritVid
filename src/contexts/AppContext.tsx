import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getAdjudicatorByUserId } from "../services/adjudicatorService";

type User = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
} | null;

type AppContextType = {
  user: User;
  isLoading: boolean;
  isAuthenticated: boolean;
  sidebarOpen: boolean;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  setSidebarOpen: (open: boolean) => void;
  privateCritiqueMode: boolean;
  setPrivateCritiqueMode: (enabled: boolean) => void;
  isAdjudicatorApproved: boolean;
  setIsAdjudicatorApproved: (approved: boolean) => void;
};

const AppContext = createContext<AppContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  sidebarOpen: false,
  userRole: "client",
  setUserRole: () => {},
  setSidebarOpen: () => {},
  privateCritiqueMode: false,
  setPrivateCritiqueMode: () => {},
  isAdjudicatorApproved: false,
  setIsAdjudicatorApproved: () => {},
});

export const useApp = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Use the auth hook instead of managing auth state here
  const { user, loading: isLoading, isAuthenticated } = useAuth();

  // Keep only app-specific state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [privateCritiqueMode, setPrivateCritiqueMode] = useState(false);
  const [isAdjudicatorApproved, setIsAdjudicatorApproved] = useState(false);

  useEffect(() => {
    const fetchAdjudicatorProfile = async () => {
      const adjudicator = await getAdjudicatorByUserId(user.id);
      if (adjudicator && adjudicator.approved !== true) {
        setIsAdjudicatorApproved(false);
      } else {
        setIsAdjudicatorApproved(true);
      }
    };

    if (userRole === "adjudicator") {
      fetchAdjudicatorProfile();
    }
  }, [user, userRole]);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    sidebarOpen,
    userRole,
    setUserRole,
    setSidebarOpen,
    privateCritiqueMode,
    setPrivateCritiqueMode,
    isAdjudicatorApproved,
    setIsAdjudicatorApproved,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
