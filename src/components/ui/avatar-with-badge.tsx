import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRole } from '@/types';

interface AvatarWithBadgeProps {
  src?: string;
  fallback: string;
  role: UserRole;
  className?: string;
}

const AvatarWithBadge: React.FC<AvatarWithBadgeProps> = ({ 
  src, 
  fallback, 
  role,
  className = ''
}) => {
  const getBadgeColor = () => {
    switch (role) {
      case 'dancer':
        return 'bg-blue-500';
      case 'adjudicator':
        return 'bg-purple-500';
      case 'admin':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Avatar>
        {src && <AvatarImage src={src} alt={fallback} />}
        <AvatarFallback>{fallback.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${getBadgeColor()}`} />
    </div>
  );
};

export default AvatarWithBadge;
