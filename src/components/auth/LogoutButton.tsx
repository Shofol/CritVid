import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonProps } from '@/components/ui/button';
import { signOut } from '@/lib/auth';

interface LogoutButtonProps extends ButtonProps {
  redirectTo?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  redirectTo = '/', 
  children = 'Sign Out', 
  ...props 
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      const { success } = await signOut();
      
      if (success) {
        // Clear any stored auth data
        sessionStorage.removeItem('authReturnUrl');
        localStorage.removeItem('supabase.auth.token');
        
        // Redirect to specified page
        navigate(redirectTo, { replace: true });
      } else {
        console.error('Failed to sign out');
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleLogout} 
      disabled={isLoading}
      {...props}
    >
      {isLoading ? 'Signing out...' : children}
    </Button>
  );
};

export default LogoutButton;
