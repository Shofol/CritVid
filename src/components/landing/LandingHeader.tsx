import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { MenuIcon, MoonIcon, SunIcon } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo";
import HeaderAuthButton from "../auth/HeaderAuthButton";
import ProfileButton from "../auth/ProfileButton";

const LandingHeader: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useApp();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60 text-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Logo variant="full" darkMode={true} />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/signup?role=adjudicator"
            className="text-sm font-medium hover:underline underline-offset-4 text-gray-300 hover:text-white"
          >
            Join as an Adjudicator
          </Link>
          <Link
            to="/guidelines"
            className="text-sm font-medium hover:underline underline-offset-4 text-gray-300 hover:text-white"
          >
            Guidelines
          </Link>
          <Link
            to="/help"
            className="text-sm font-medium hover:underline underline-offset-4 text-gray-300 hover:text-white"
          >
            Help
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium hover:underline underline-offset-4 text-gray-300 hover:text-white"
          >
            Contact
          </Link>

          {isAuthenticated ? <ProfileButton /> : <HeaderAuthButton />}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-white"
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          {isAuthenticated ? <ProfileButton /> : <HeaderAuthButton />}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-white"
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white"
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t py-4 px-6 bg-black">
          <nav className="flex flex-col space-y-4">
            <Link
              to="/find-adjudicator"
              className="text-sm font-medium hover:underline underline-offset-4 text-gray-300 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Adjudicators
            </Link>
            <Link
              to="/guidelines"
              className="text-sm font-medium hover:underline underline-offset-4 text-gray-300 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Guidelines
            </Link>
            <Link
              to="/help"
              className="text-sm font-medium hover:underline underline-offset-4 text-gray-300 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Help
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium hover:underline underline-offset-4 text-gray-300 hover:text-white"
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

export default LandingHeader;
