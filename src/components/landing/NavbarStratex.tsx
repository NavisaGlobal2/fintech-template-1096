import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AuthButton from '@/components/auth/AuthButton';
import TechSkillLogo from './TechSkillLogo';

const NavbarStratex = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <TechSkillLogo className="h-8" />
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/apply">
            <Button size="default" className="rounded-full font-semibold">
              Apply Now
            </Button>
          </Link>
          <AuthButton />
        </div>
      </div>
    </nav>
  );
};

export default NavbarStratex;
