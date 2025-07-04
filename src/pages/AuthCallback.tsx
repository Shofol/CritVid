import { supabase } from "@/lib/supabase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { handleOAuthUserCreation } from "../lib/auth";
import { UserRole } from "../types/navigation";

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setUserRole } = useApp();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (data.session?.user) {
          // OAuth user creation is now handled by the useAuth hook automatically

          const { success, error: creationError } =
            await handleOAuthUserCreation(data.session.user);

          if (!success) {
            throw new Error(creationError?.message);
          }

          setUserRole(localStorage.getItem("pendingRole") as UserRole);

          setTimeout(() => {
            localStorage.removeItem("pendingRole");
            // Get the return URL from sessionStorage or default to dashboard
            const returnUrl =
              sessionStorage.getItem("authReturnUrl") || "/dashboard";
            sessionStorage.removeItem("authReturnUrl"); // Clean up

            // Redirect to intended destination
            navigate(returnUrl, { replace: true });
          }, 1000);
        } else {
          // No session found, redirect to login
          navigate("/login", { replace: true });
        }
      } catch (err: unknown) {
        console.error("Auth callback error:", err);
        setError(err instanceof Error ? err.message : "Authentication failed");

        // Redirect to login after error
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };

    handleAuthCallback();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-red-600 mb-2">
            Authentication Error
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
