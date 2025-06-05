import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserIcon, UserCogIcon, HeadphonesIcon, ChevronDownIcon, PencilIcon, BuildingIcon } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { UserRole } from '@/types/navigation';

const RoleSwitcher = () => {
  const navigate = useNavigate();
  const { userRole, setUserRole, privateCritiqueMode, setPrivateCritiqueMode } = useApp();

  // Debug logging to check the current role
  useEffect(() => {
    console.log('Current user role in RoleSwitcher:', userRole);
  }, [userRole]);

  const handleRoleChange = (role: UserRole) => {
    console.log('Switching role to:', role);
    setUserRole(role);
    
    // Navigate to the appropriate dashboard based on role
    switch (role) {
      case 'client':
        navigate('/dashboard');
        break;
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'adjudicator':
        navigate('/adjudicator/dashboard');
        break;
      case 'studio-owner':
        navigate('/studio/dashboard');
        break;
      case 'studio_critique':
        navigate('/studio/dashboard');
        break;
    }
  };

  const handlePrivateCritiqueMode = () => {
    // Toggle private critique mode and navigate to the page
    setPrivateCritiqueMode(!privateCritiqueMode);
    navigate('/private-critique');
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'client':
        return <UserIcon className="h-4 w-4 mr-2" />;
      case 'admin':
        return <UserCogIcon className="h-4 w-4 mr-2" />;
      case 'adjudicator':
        return <HeadphonesIcon className="h-4 w-4 mr-2" />;
      case 'studio-owner':
      case 'studio_critique':
        return <BuildingIcon className="h-4 w-4 mr-2" />;
      default:
        return <UserIcon className="h-4 w-4 mr-2" />;
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'client':
        return 'Client';
      case 'admin':
        return 'Admin';
      case 'adjudicator':
        return 'Adjudicator';
      case 'studio-owner':
        return 'Studio Owner';
      case 'studio_critique':
        return 'Studio Critique';
      default:
        return 'User';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <span className="bg-red-500 text-white text-xs px-1 rounded mr-1">DEV</span>
          {getRoleIcon(userRole)}
          <span className="mr-1">{getRoleLabel(userRole)}</span>
          <ChevronDownIcon className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleRoleChange('client')}>
          <UserIcon className="h-4 w-4 mr-2" />
          <span>👤 Client Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRoleChange('admin')}>
          <UserCogIcon className="h-4 w-4 mr-2" />
          <span>🧑‍🏫 Admin Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRoleChange('adjudicator')}>
          <HeadphonesIcon className="h-4 w-4 mr-2" />
          <span>🎧 Adjudicator Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRoleChange('studio_critique')}>
          <PencilIcon className="h-4 w-4 mr-2" />
          <span>✏️ Studio Critique</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRoleChange('studio-owner')}>
          <BuildingIcon className="h-4 w-4 mr-2" />
          <span>🏢 Studio Owner</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoleSwitcher;
