import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import LogoutButton from './LogoutButton';

/**
 * Test component to verify sign out functionality
 * This can be used for debugging authentication issues
 */
export const SignOutTest: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const { user: appUser, isAuthenticated: appIsAuthenticated } = useApp();

  if (loading) {
    return <div>Loading auth state...</div>;
  }

  return (
    <div className="p-4 border rounded-lg space-y-4 bg-gray-50">
      <h3 className="font-semibold">Authentication Status</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>useAuth Hook:</strong>
          <ul className="ml-4">
            <li>Authenticated: {isAuthenticated ? '✅ Yes' : '❌ No'}</li>
            <li>User ID: {user?.id || 'None'}</li>
            <li>Email: {user?.email || 'None'}</li>
          </ul>
        </div>
        
        <div>
          <strong>AppContext:</strong>
          <ul className="ml-4">
            <li>Authenticated: {appIsAuthenticated ? '✅ Yes' : '❌ No'}</li>
            <li>User ID: {appUser?.id || 'None'}</li>
            <li>Email: {appUser?.email || 'None'}</li>
          </ul>
        </div>
      </div>

      {isAuthenticated && (
        <div className="space-y-2">
          <LogoutButton 
            variant="destructive" 
            size="sm"
            redirectTo="/login"
          >
            Sign Out (to Login)
          </LogoutButton>
          
          <LogoutButton 
            variant="outline" 
            size="sm"
            redirectTo="/"
          >
            Sign Out (to Home)
          </LogoutButton>
        </div>
      )}

      {!isAuthenticated && (
        <div className="text-green-600 font-medium">
          ✅ User is signed out successfully
        </div>
      )}
    </div>
  );
};

export default SignOutTest; 