import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LogoutButton from './LogoutButton';

const ProfileButton: React.FC = () => {
  const { user, userRole } = useApp();
  
  if (!user) return null;
  
  const userInitials = user.email ? user.email.substring(0, 2).toUpperCase() : 'U';
  const userName = user.user_metadata?.full_name || user.email || 'User';
  const userAvatar = user.user_metadata?.avatar_url;

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 outline-none">
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src={userAvatar || ''} alt={userName} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{userName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={getDashboardPath()}>Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/upload-video">Upload Video</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogoutButton variant="ghost" className="w-full justify-start p-0 h-auto font-normal">
            Sign out
          </LogoutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileButton;