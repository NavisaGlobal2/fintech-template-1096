import React, { useState, useEffect } from 'react';
import TechScaleLogo from './techscale/TechScaleLogo';
import AuthButton from './auth/AuthButton';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <header className="w-full bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <div>
          <TechScaleLogo />
        </div>

        {/* Center: Desktop Navigation - FINTURE style */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-foreground hover:text-foreground/70 transition-colors text-sm font-medium">
            Products
          </a>
          <a href="#" className="text-foreground hover:text-foreground/70 transition-colors text-sm font-medium">
            Pricing
          </a>
          <a href="#" className="text-foreground hover:text-foreground/70 transition-colors text-sm font-medium">
            About
          </a>
          <a href="#" className="text-foreground hover:text-foreground/70 transition-colors text-sm font-medium">
            More pages
          </a>
          <a href="#" className="text-foreground hover:text-foreground/70 transition-colors text-sm font-medium">
            Contact
          </a>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Cart icon - FINTURE style */}
          <button className="hidden md:flex items-center gap-2 text-foreground hover:text-foreground/70 transition-colors">
            <ShoppingCart className="h-5 w-5" />
            <span className="text-sm">0</span>
          </button>

          {/* CTA Button - FINTURE style */}
          <Button 
            variant="outline"
            className="hidden md:flex border-2 border-foreground text-foreground hover:bg-foreground hover:text-background font-medium"
          >
            Sign In →
          </Button>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-lg text-foreground"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg z-50">
            <div className="flex flex-col p-6 gap-4">
              <a href="#" className="text-foreground hover:text-foreground/70 transition-colors font-medium">
                Products
              </a>
              <a href="#" className="text-foreground hover:text-foreground/70 transition-colors font-medium">
                Pricing
              </a>
              <a href="#" className="text-foreground hover:text-foreground/70 transition-colors font-medium">
                About
              </a>
              <a href="#" className="text-foreground hover:text-foreground/70 transition-colors font-medium">
                Contact
              </a>
              <AuthButton />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
