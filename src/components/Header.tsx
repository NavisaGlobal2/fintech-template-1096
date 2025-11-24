import React, { useState, useEffect } from 'react';
import TechScaleLogo from './techscale/TechScaleLogo';
import AuthButton from './auth/AuthButton';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <header className="w-full max-w-7xl mx-auto py-4 px-6 md:px-12 flex items-center justify-between">
        <div>
          <TechScaleLogo />
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md py-4 px-6 border-b border-border">
            <div className="flex flex-col gap-2">
              <AuthButton />
            </div>
          </div>
        )}
        
        <div className="hidden md:flex items-center">
          <AuthButton />
        </div>
      </header>
    </div>
  );
};

export default Header;
