import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { UserIcon } from 'lucide-react';

const HeaderAuthButton: React.FC = () => {
  const { isAuthenticated, userRole } = useApp();

  const getDashboardPath = () => {
    switch(userRole) {
      case 'admin':
        return '/admin/dashboard';
      case 'adjudicator':
        return '/adjudicator/dashboard';
      case 'studio-owner':
      case 'studio_critique':
        return '/studio/dashboard';
      case 'client':
      default:
        return '/dashboard';
    }
  };

  if (isAuthenticated) {
    return (
      <Button 
        asChild 
        variant="outline" 
        size="sm"
        className="text-white border-white hover:bg-white/10"
      >
        <Link to={getDashboardPath()} className="flex items-center gap-2">
          <UserIcon className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>
      </Button>
    );
  }

  return (
    <Button 
      asChild 
      variant="default" 
      size="sm"
      className="bg-primary hover:bg-primary/90"
    >
      <Link to="/login">Sign In</Link>
    </Button>
  );
};

export default HeaderAuthButton;
