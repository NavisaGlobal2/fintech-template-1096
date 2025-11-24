import React from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Zap className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl text-foreground">TechScale Accelerate</span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => scrollToSection('how')}
            className="hidden md:block text-foreground hover:text-muted-foreground transition-colors font-medium"
          >
            How it works
          </button>
          <Link to="/apply">
            <Button className="rounded-full px-6">
              Apply Now
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
