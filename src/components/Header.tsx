
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import TechScaleLogo from './techscale/TechScaleLogo';
import AuthButton from './auth/AuthButton';
import { Menu, X, Calculator, BookOpen, Users, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Switch } from '@/components/ui/switch';

const Header = () => {
  const [activePage, setActivePage] = useState('loan-matcher');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light-mode');
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
      document.documentElement.classList.add('light-mode');
    }
  }, [isDarkMode]);
  
  const handleNavClick = (page: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setActivePage(page);
    const element = document.getElementById(page);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleGetStarted = () => {
    const loanMatcherElement = document.getElementById('loan-matcher');
    if (loanMatcherElement) {
      loanMatcherElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="sticky top-0 z-50 pt-4 md:pt-8 px-4">
      <header className="w-full max-w-7xl mx-auto py-2 md:py-3 px-4 md:px-8 flex items-center justify-between">
        <div className="p-2 md:p-3">
          <TechScaleLogo />
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground touch-manipulation"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
          <div className="rounded-full px-1 py-1 backdrop-blur-md bg-background/80 border border-border shadow-lg">
            <ToggleGroup type="single" value={activePage} onValueChange={(value) => value && setActivePage(value)}>
              <ToggleGroupItem 
                value="loan-matcher"
                className={cn(
                  "px-3 lg:px-4 py-2 rounded-full transition-colors relative text-sm",
                  activePage === 'loan-matcher' ? 'text-accent-foreground bg-accent' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
                onClick={handleNavClick('loan-matcher')}
              >
                <Calculator size={16} className="inline-block mr-1.5" /> Loan Matcher
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="how-it-works" 
                className={cn(
                  "px-3 lg:px-4 py-2 rounded-full transition-colors relative text-sm",
                  activePage === 'how-it-works' ? 'text-accent-foreground bg-accent' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
                onClick={handleNavClick('how-it-works')}
              >
                <BookOpen size={16} className="inline-block mr-1.5" /> How It Works
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="success-stories" 
                className={cn(
                  "px-3 lg:px-4 py-2 rounded-full transition-colors relative text-sm",
                  activePage === 'success-stories' ? 'text-accent-foreground bg-accent' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
                onClick={handleNavClick('success-stories')}
              >
                <Users size={16} className="inline-block mr-1.5" /> Success Stories
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </nav>
        
        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-4 right-4 bg-background/95 backdrop-blur-md py-4 px-6 border border-border rounded-2xl shadow-lg z-50">
            <div className="flex flex-col gap-4">
              <button 
                className={`px-3 py-3 text-sm rounded-md transition-colors text-left touch-manipulation ${
                  activePage === 'loan-matcher' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                onClick={handleNavClick('loan-matcher')}
              >
                <Calculator size={16} className="inline-block mr-2" /> Loan Matcher
              </button>
              <button 
                className={`px-3 py-3 text-sm rounded-md transition-colors text-left touch-manipulation ${
                  activePage === 'how-it-works' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                onClick={handleNavClick('how-it-works')}
              >
                <BookOpen size={16} className="inline-block mr-2" /> How It Works
              </button>
              <button 
                className={`px-3 py-3 text-sm rounded-md transition-colors text-left touch-manipulation ${
                  activePage === 'success-stories' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                onClick={handleNavClick('success-stories')}
              >
                <Users size={16} className="inline-block mr-2" /> Success Stories
              </button>
              
              {/* Theme toggle for mobile */}
              <div className="flex items-center justify-between px-3 py-2 border-t border-border mt-2 pt-4">
                <span className="text-sm text-muted-foreground">Theme</span>
                <div className="flex items-center gap-2">
                  <Moon size={16} className={`${isDarkMode ? 'text-primary' : 'text-muted-foreground'}`} />
                  <Switch 
                    checked={!isDarkMode} 
                    onCheckedChange={toggleTheme} 
                    className="data-[state=checked]:bg-primary"
                  />
                  <Sun size={16} className={`${!isDarkMode ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
              </div>
              
              {/* Mobile Auth Button */}
              <div className="mt-2">
                <AuthButton />
              </div>
            </div>
          </div>
        )}
        
        <div className="hidden md:flex items-center gap-4">
          {/* Theme toggle for desktop */}
          <div className="flex items-center gap-2 rounded-full px-3 py-2">
            <Moon size={18} className={`${isDarkMode ? 'text-primary' : 'text-muted-foreground'}`} />
            <Switch 
              checked={!isDarkMode} 
              onCheckedChange={toggleTheme} 
              className="data-[state=checked]:bg-primary"
            />
            <Sun size={18} className={`${!isDarkMode ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <AuthButton />
        </div>
      </header>
    </div>
  );
};

export default Header;
