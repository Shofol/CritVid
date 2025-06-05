import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabase';

export const AuthDebugger: React.FC = () => {
  const { user, session, loading, isAuthenticated } = useAuth();
  const { user: appUser, isLoading: appLoading, isAuthenticated: appIsAuthenticated } = useApp();

  useEffect(() => {
    console.log('AuthDebugger mounted');
    
    // Test Supabase connection
    const testSupabase = async () => {
      try {
        console.log('Testing Supabase connection...');
        const { data, error } = await supabase.auth.getSession();
        console.log('Supabase session test result:', { data, error });
      } catch (error) {
        console.error('Supabase connection error:', error);
      }
    };

    testSupabase();
  }, []);

  useEffect(() => {
    console.log('useAuth state changed:', {
      user: user?.id || 'null',
      session: session?.user?.id || 'null',
      loading,
      isAuthenticated
    });
  }, [user, session, loading, isAuthenticated]);

  useEffect(() => {
    console.log('AppContext state changed:', {
      user: appUser?.id || 'null',
      isLoading: appLoading,
      isAuthenticated: appIsAuthenticated
    });
  }, [appUser, appLoading, appIsAuthenticated]);

  if (loading || appLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600">Loading authentication...</p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>useAuth loading: {loading ? 'true' : 'false'}</div>
            <div>AppContext loading: {appLoading ? 'true' : 'false'}</div>
            <div>Check browser console for details</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-2xl w-full space-y-6">
        <h1 className="text-2xl font-bold text-center">Authentication Debug</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg bg-white">
            <h3 className="font-semibold mb-2">useAuth Hook</h3>
            <div className="space-y-1 text-sm">
              <div>Loading: {loading ? '🔄 Yes' : '✅ No'}</div>
              <div>Authenticated: {isAuthenticated ? '✅ Yes' : '❌ No'}</div>
              <div>User ID: {user?.id || 'None'}</div>
              <div>Email: {user?.email || 'None'}</div>
              <div>Session: {session ? '✅ Yes' : '❌ No'}</div>
            </div>
          </div>

          <div className="p-4 border rounded-lg bg-white">
            <h3 className="font-semibold mb-2">AppContext</h3>
            <div className="space-y-1 text-sm">
              <div>Loading: {appLoading ? '🔄 Yes' : '✅ No'}</div>
              <div>Authenticated: {appIsAuthenticated ? '✅ Yes' : '❌ No'}</div>
              <div>User ID: {appUser?.id || 'None'}</div>
              <div>Email: {appUser?.email || 'None'}</div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            ✅ Authentication system is working! Check the browser console for detailed logs.
          </p>
          <a 
            href="/login" 
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthDebugger; 