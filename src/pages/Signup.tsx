import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SignupForm } from '@/components/auth/SignupForm';
import { AuthCard } from '@/components/auth/AuthCard';
import { useAuth } from '@/hooks/useAuth';

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  // Get the return URL from location state
  const from = location.state?.from?.pathname || '/dashboard';

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
        title="Create an Account" 
        description="Sign up for CritVid to get started with personalized dance critiques."
      >
        <SignupForm />
      </AuthCard>
    </div>
  );
}
