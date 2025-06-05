import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const StudioSidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navigationItems = [
    {
      name: 'Upload Video',
      path: '/upload-video',
      icon: 'upload',
      description: 'Upload a new video for critique'
    },
    {
      name: 'Edit Video',
      path: '/video-editor',
      icon: 'video',
      description: 'Edit and critique videos'
    },
    {
      name: 'My Profile',
      path: '/profile',
      icon: 'user',
      description: 'Manage your account details'
    }
  ];

  const renderIcon = (iconName: string) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        {iconName === 'upload' && (
          <>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </>
        )}
        {iconName === 'video' && (
          <>
            <path d="m22 8-6 4 6 4V8Z" />
            <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
          </>
        )}
        {iconName === 'user' && (
          <>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </>
        )}
      </svg>
    );
  };

  return (
    <div className="fixed h-full z-30 left-0 top-16 hidden md:block w-64 border-r bg-background">
      <div className="space-y-4 py-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Studio Critique Tools
          </h2>
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                )}
                title={item.description}
              >
                <span className="mr-2">
                  {renderIcon(item.icon)}
                </span>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioSidebar;
