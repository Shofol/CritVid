import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

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
});

export const useApp = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Use the auth hook instead of managing auth state here
  const { user, loading: isLoading, isAuthenticated } = useAuth();

  // Keep only app-specific state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>("client");
  const [privateCritiqueMode, setPrivateCritiqueMode] = useState(false);

  // Load saved role from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    if (savedRole) {
      try {
        // Validate that the saved role is a valid UserRole type
        const validRoles: UserRole[] = [
          "client",
          "admin",
          "adjudicator",
          "studio-owner",
          "studio_critique",
        ];
        if (validRoles.includes(savedRole as UserRole)) {
          setUserRole(savedRole as UserRole);
          console.log("Loaded role from localStorage:", savedRole);
        } else {
          console.warn("Invalid role found in localStorage:", savedRole);
          localStorage.setItem("userRole", "client");
        }
      } catch (e) {
        console.error("Error parsing saved role:", e);
        localStorage.setItem("userRole", "client");
      }
    } else {
      // If no role is saved, set default and save it
      localStorage.setItem("userRole", "client");
      console.log("No role found in localStorage, setting default: client");
    }
  }, []);

  // Save userRole to localStorage when it changes
  useEffect(() => {
    console.log("AppContext: userRole changed to", userRole);
    localStorage.setItem("userRole", userRole);
  }, [userRole]);

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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
