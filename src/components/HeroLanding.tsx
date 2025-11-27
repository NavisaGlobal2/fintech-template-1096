import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroLanding = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-24 sm:pt-20 pb-12">
      {/* Background Image with Opacity */}
      <div className="absolute inset-0 opacity-10 z-0">
        <img 
          src="/hero-diverse-professionals.jpg" 
          alt="Diverse professionals"
          loading="eager"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-foreground leading-[1.1] px-2">
          A little credit.{' '}
          <span className="block mt-2">A fresh start.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto px-2">
          Because moving to a new country is hard enough—getting fair financial support shouldn't be.
        </p>

        {/* Trust Message Box */}
        <div className="bg-sageLight/30 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 md:p-8 max-w-2xl mx-auto border border-sage/20">
          <p className="text-sm sm:text-base md:text-lg text-foreground leading-relaxed">
            We don't judge you by old credit files. We see your story, your network, your ambition. 
            Use your social profiles to verify who you are—quick, safe, human.
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-2 sm:pt-4">
          <Link to="/apply">
            <Button size="lg" className="rounded-full px-8 sm:px-12 h-12 sm:h-14 md:h-16 text-base sm:text-lg font-semibold w-full sm:w-auto">
              Apply Now
            </Button>
          </Link>
        </div>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground px-2">
          <Shield className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <p className="text-xs sm:text-sm">
            Takes 2 minutes. No pressure, no impact on your credit score.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroLanding;
