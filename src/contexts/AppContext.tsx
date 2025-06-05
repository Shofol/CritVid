import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/types/navigation';
import { handleOAuthUserCreation } from '@/lib/auth';

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
  setSidebarOpen: (open: boolean) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  privateCritiqueMode: boolean;
  setPrivateCritiqueMode: (enabled: boolean) => void;
};

const AppContext = createContext<AppContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  sidebarOpen: false,
  setSidebarOpen: () => {},
  userRole: 'client',
  setUserRole: () => {},
  privateCritiqueMode: false,
  setPrivateCritiqueMode: () => {}
});

export const useApp = () => useContext(AppContext);

// Add the useAppContext alias for backward compatibility
export const useAppContext = useApp;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('client');
  const [privateCritiqueMode, setPrivateCritiqueMode] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session in AppContext:', error);
        }

        if (mounted) {
          setUser(data.session?.user || null);
        }
      } catch (error) {
        console.error('Unexpected error getting initial session in AppContext:', error);
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          // Handle OAuth user creation for new sign-ins
          if (event === 'SIGNED_IN' && session?.user) {
            // Check if this is an OAuth user (has provider in app_metadata)
            const isOAuthUser = session.user.app_metadata?.provider && session.user.app_metadata.provider !== 'email';
            
            if (isOAuthUser) {
              await handleOAuthUserCreation(session.user);
            }
          }

          if (mounted) {
            setUser(session?.user || null);
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error in AppContext auth state change handler:', error);
          if (mounted) {
            setUser(session?.user || null);
            setIsLoading(false);
          }
        }
      }
    );

    // Load saved role from localStorage
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      try {
        // Validate that the saved role is a valid UserRole type
        const validRoles: UserRole[] = ['client', 'admin', 'adjudicator', 'studio-owner', 'studio_critique'];
        if (validRoles.includes(savedRole as UserRole)) {
          setUserRole(savedRole as UserRole);
          console.log('Loaded role from localStorage:', savedRole);
        } else {
          console.warn('Invalid role found in localStorage:', savedRole);
          localStorage.setItem('userRole', 'client');
        }
      } catch (e) {
        console.error('Error parsing saved role:', e);
        localStorage.setItem('userRole', 'client');
      }
    } else {
      // If no role is saved, set default and save it
      localStorage.setItem('userRole', 'client');
      console.log('No role found in localStorage, setting default: client');
    }

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Save userRole to localStorage when it changes
  useEffect(() => {
    console.log('AppContext: userRole changed to', userRole);
    localStorage.setItem('userRole', userRole);
  }, [userRole]);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    sidebarOpen,
    setSidebarOpen,
    userRole,
    setUserRole,
    privateCritiqueMode,
    setPrivateCritiqueMode
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
