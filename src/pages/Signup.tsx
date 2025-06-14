import { AuthCard } from "@/components/auth/AuthCard";
import { SignupForm } from "@/components/auth/SignupForm";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  // Get the return URL from location state
  const from = location.state?.from?.pathname || "/dashboard";
  const [search] = useSearchParams();
  const role = search.get("role") || "client";

  useEffect(() => {
    // If user is already authenticated, redirect them
    if (!loading && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, from]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render signup form if user is authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <AuthCard
        isSignUp={true}
        role={role}
        title="Create an Account"
        description="Sign up for CritVid to get started with personalized dance critiques."
      >
        <SignupForm />
      </AuthCard>
    </div>
  );
}
