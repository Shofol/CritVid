import { useAuth } from "@/hooks/useAuth";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  adjudicatorOnly?: boolean;
  studioOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  adminOnly = false,
  adjudicatorOnly = false,
  studioOnly = false,
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  const { userRole } = useApp();

  // Show loading spinner while checking authentication
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

  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Get user role from user metadata or default to 'client'
  // const userRole = user.user_metadata?.role || 'client';

  // Check role-based access
  if (adminOnly && userRole !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  if (adjudicatorOnly && userRole !== "adjudicator") {
    return <Navigate to="/dashboard" replace />;
  }

  if (studioOnly && !["studio-owner", "studio_critique"].includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
