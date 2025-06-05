import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'text' | 'image' | 'full';
  darkMode?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  variant = 'full',
  darkMode = false
}) => {
  // For image-only variant - using placeholder until clean CritVid logo is available
  if (variant === 'image') {
    return (
      <div className={cn('flex items-center', className)}>
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">CV</span>
        </div>
      </div>
    );
  }
  
  // For text-only variant
  if (variant === 'text') {
    return (
      <div className={cn('flex items-center', className)}>
        <span className={`text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text ${
          darkMode ? 'text-white' : ''
        }`}>
          CritVid
        </span>
      </div>
    );
  }
  
  // For full logo (default) - clean CritVid branding only
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
        <span className="text-white font-bold text-sm">CV</span>
      </div>
      <span className={`text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text ${
        darkMode ? 'text-white' : ''
      }`}>
        CritVid
      </span>
    </div>
  );
};

export default Logo;