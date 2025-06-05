import React from 'react';
import { toast } from '@/components/ui/use-toast';

// Global button fix component that patches missing functionality
export const useButtonFixes = () => {
  React.useEffect(() => {
    // Find all buttons with missing functionality and add handlers
    const buttons = document.querySelectorAll('button, a[href="#"], a[href=""]');
    
    buttons.forEach((button) => {
      const element = button as HTMLElement;
      const text = element.textContent?.toLowerCase() || '';
      
      // Skip if already has proper handler
      if (element.onclick || element.getAttribute('href')?.startsWith('/')) {
        return;
      }
      
      // Add click handler based on button text
      element.onclick = (e) => {
        e.preventDefault();
        
        if (text.includes('upload')) {
          window.location.href = '/upload-video';
        } else if (text.includes('dashboard')) {
          window.location.href = '/dashboard';
        } else if (text.includes('watch') || text.includes('view video')) {
          const videoId = element.getAttribute('data-video-id') || '1';
          window.location.href = `/video/${videoId}`;
        } else if (text.includes('critique') || text.includes('feedback')) {
          const critiqueId = element.getAttribute('data-critique-id') || '1';
          window.location.href = `/critique/${critiqueId}`;
        } else if (text.includes('edit')) {
          const videoId = element.getAttribute('data-video-id') || '1';
          window.location.href = `/critique-editor/${videoId}`;
        } else if (text.includes('find') || text.includes('adjudicator')) {
          window.location.href = '/find-adjudicator';
        } else if (text.includes('profile')) {
          window.location.href = '/profile';
        } else if (text.includes('help')) {
          window.location.href = '/help';
        } else if (text.includes('contact')) {
          window.location.href = '/contact';
        } else if (text.includes('login') || text.includes('sign in')) {
          window.location.href = '/login';
        } else if (text.includes('signup') || text.includes('register')) {
          window.location.href = '/signup';
        } else {
          toast({
            title: 'Feature Coming Soon',
            description: `${text} functionality will be available soon.`
          });
        }
      };
    });
  }, []);
};

// Component to wrap around app
export const ButtonFixProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useButtonFixes();
  return <>{children}</>;
};