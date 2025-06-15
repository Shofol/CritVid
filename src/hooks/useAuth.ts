import { signOut as authSignOut } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

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
    let authUpdateTimeout: NodeJS.Timeout | null = null;

    // Fallback timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (mounted) {
        console.warn("Auth loading timeout reached, forcing loading to false");
        setAuthState((prev) => ({
          ...prev,
          loading: false,
        }));
      }
    }, 10000); // 10 second timeout

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log("Getting initial session...");
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting initial session:", error);
        }

        console.log(
          "Initial session result:",
          session ? "Session found" : "No session"
        );

        if (mounted) {
          setAuthState({
            user: session?.user ?? null,
            session,
            loading: false,
          });
          clearTimeout(loadingTimeout);
        }
      } catch (error) {
        console.error("Unexpected error getting initial session:", error);
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
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Clear any pending auth updates to prevent rapid firing
      if (authUpdateTimeout) {
        clearTimeout(authUpdateTimeout);
      }

      // Debounce auth state updates to prevent hanging
      authUpdateTimeout = setTimeout(async () => {
        if (!mounted) return;

        try {
          console.log(
            "Auth state change:",
            event,
            session ? "Session exists" : "No session"
          );

          // Update state immediately, don't wait for OAuth user creation
          setAuthState({
            user: session?.user ?? null,
            session,
            loading: false,
          });
          clearTimeout(loadingTimeout);

          // Handle OAuth user creation asynchronously without blocking
          // if (event === "SIGNED_IN" && session?.user) {
          //   const isOAuthUser =
          //     session.user.app_metadata?.provider &&
          //     session.user.app_metadata.provider !== "email";

          //   if (isOAuthUser) {
          //     // Don't await this - let it run in background
          //     handleOAuthUserCreation(session.user).catch((error) => {
          //       console.error(
          //         "OAuth user creation failed (non-blocking):",
          //         error
          //       );
          //     });
          //   }
          // }
        } catch (error) {
          console.error("Error in auth state change handler:", error);
          if (mounted) {
            setAuthState({
              user: session?.user ?? null,
              session,
              loading: false,
            });
            clearTimeout(loadingTimeout);
          }
        }
      }, 100); // 100ms debounce
    });

    return () => {
      mounted = false;
      clearTimeout(loadingTimeout);
      if (authUpdateTimeout) {
        clearTimeout(authUpdateTimeout);
      }
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
      console.error("Sign out error in useAuth:", error);
      return { success: false, error };
    }
  };

  return {
    ...authState,
    signOut,
    isAuthenticated: !!authState.user,
  };
};
