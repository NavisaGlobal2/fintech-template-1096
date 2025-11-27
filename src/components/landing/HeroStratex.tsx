import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, Zap, Clock } from 'lucide-react';

const HeroStratex = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-6 bg-background overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-sageLight/20 via-background to-background pointer-events-none" />
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Main headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 tracking-tighter leading-[0.9]">
          A little credit.<br />
          A fresh start.
        </h1>
        
        {/* Subheadline */}
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
          Fair financial support for newcomers to the UK. £300–£2,500 to help with skills, 
          settling in, or getting ahead—without a UK credit history.
        </p>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link to="/apply">
            <Button size="lg" className="rounded-full px-8 h-14 text-lg font-semibold min-w-[200px]">
              Apply Now
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => scrollToSection('how-it-works')}
            className="rounded-full px-8 h-14 text-lg font-semibold min-w-[200px]"
          >
            Learn More
          </Button>
        </div>
        
        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span>Secure & Regulated</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <span>24-48hr Decisions</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span>No Credit History Needed</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroStratex;
