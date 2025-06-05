import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { EmailVerification as EmailVerificationComponent } from '@/components/auth/EmailVerification';

type LocationState = {
  email: string;
};

export default function EmailVerificationPage() {
  const location = useLocation();
  const state = location.state as LocationState;
  
  // If no email in state, redirect to signup
  if (!state?.email) {
    return <Navigate to="/signup" replace />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <EmailVerificationComponent email={state.email} />
      </div>
    </div>
  );
}
