import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const StickyApplyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling past 80vh (roughly past the hero)
      const scrollPosition = window.scrollY;
      const heroHeight = window.innerHeight * 0.8;
      
      setIsVisible(scrollPosition > heroHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-20 pointer-events-none'
      }`}
    >
      <Link to="/apply">
        <Button 
          size="lg" 
          className="rounded-full px-8 h-14 text-lg font-semibold shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-200 flex items-center gap-2"
        >
          Apply Now
          <ArrowRight className="h-5 w-5" />
        </Button>
      </Link>
    </div>
  );
};

export default StickyApplyCTA;
