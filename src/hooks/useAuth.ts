import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { handleOAuthUserCreation, signOut as authSignOut } from '@/lib/auth';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;

    // Fallback timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (mounted) {
        console.warn('Auth loading timeout reached, forcing loading to false');
        setAuthState(prev => ({
          ...prev,
          loading: false,
        }));
      }
    }, 10000); // 10 second timeout

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
        }

        console.log('Initial session result:', session ? 'Session found' : 'No session');

        if (mounted) {
          setAuthState({
            user: session?.user ?? null,
            session,
            loading: false,
          });
          clearTimeout(loadingTimeout);
        }
      } catch (error) {
        console.error('Unexpected error getting initial session:', error);
        if (mounted) {
          setAuthState({
            user: null,
            session: null,
            loading: false,
          });
          clearTimeout(loadingTimeout);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          console.log('Auth state change:', event, session ? 'Session exists' : 'No session');
          
          // Handle OAuth user creation for new sign-ins
          if (event === 'SIGNED_IN' && session?.user) {
            // Check if this is an OAuth user (has provider in app_metadata)
            const isOAuthUser = session.user.app_metadata?.provider && session.user.app_metadata.provider !== 'email';
            
            if (isOAuthUser) {
              await handleOAuthUserCreation(session.user);
            }
          }

          if (mounted) {
            setAuthState({
              user: session?.user ?? null,
              session,
              loading: false,
            });
            clearTimeout(loadingTimeout);
          }
        } catch (error) {
          console.error('Error in auth state change handler:', error);
          if (mounted) {
            setAuthState({
              user: session?.user ?? null,
              session,
              loading: false,
            });
            clearTimeout(loadingTimeout);
          }
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []);

  // Sign out function
  const signOut = async () => {
    try {
      const result = await authSignOut();
      
      // Clear auth state immediately
      setAuthState({
        user: null,
        session: null,
        loading: false,
      });
      
      return result;
    } catch (error) {
      console.error('Sign out error in useAuth:', error);
      return { success: false, error };
    }
  };

  return {
    ...authState,
    signOut,
    isAuthenticated: !!authState.user,
  };
}; 