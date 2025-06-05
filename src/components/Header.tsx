import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon, MenuIcon } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import Logo from './Logo';
import { useApp } from '@/contexts/AppContext';
import ProfileButton from './auth/ProfileButton';
import AuthButtons from './auth/AuthButtons';
import RoleSwitcher from './RoleSwitcher';
import HeaderAuthButton from './auth/HeaderAuthButton';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useApp();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Auth buttons at very top */}
      <div className="container flex h-10 items-center justify-between border-b border-border/40">
        <div className="flex items-center gap-2">
          {/* Development Role Switcher */}
          <div className="mr-2 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded text-xs">
            DEV
          </div>
          <RoleSwitcher />
        </div>
        {!isAuthenticated && <AuthButtons />}
      </div>
      
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Logo variant="full" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/find-adjudicator" className="text-sm font-medium hover:underline underline-offset-4">
            Find Adjudicators
          </Link>
          <Link to="/guidelines" className="text-sm font-medium hover:underline underline-offset-4">
            Guidelines
          </Link>
          <Link to="/help" className="text-sm font-medium hover:underline underline-offset-4">
            Help
          </Link>
          <Link to="/contact" className="text-sm font-medium hover:underline underline-offset-4">
            Contact
          </Link>
          
          {isAuthenticated ? (
            <>
              <ProfileButton />
            </>
          ) : (
            <HeaderAuthButton />
          )}
          
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          {isAuthenticated ? (
            <ProfileButton />
          ) : (
            <HeaderAuthButton />
          )}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <MenuIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t py-4 px-6 bg-background">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/find-adjudicator" 
              className="text-sm font-medium hover:underline underline-offset-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Adjudicators
            </Link>
            <Link 
              to="/guidelines" 
              className="text-sm font-medium hover:underline underline-offset-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Guidelines
            </Link>
            <Link 
              to="/help" 
              className="text-sm font-medium hover:underline underline-offset-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Help
            </Link>
            <Link 
              to="/contact" 
              className="text-sm font-medium hover:underline underline-offset-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;