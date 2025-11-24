import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroLanding = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
      {/* Background Image with Opacity */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10 z-0"
        style={{ backgroundImage: "url('/hero-diverse-professionals.jpg')" }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Main Headline */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.1]">
          A little credit.{' '}
          <span className="block mt-2">A fresh start.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
          Because moving to a new country is hard enough—getting fair financial support shouldn't be.
        </p>

        {/* Trust Message Box */}
        <div className="bg-sageLight/30 rounded-[2rem] p-8 max-w-2xl mx-auto border border-sage/20">
          <p className="text-lg text-foreground leading-relaxed">
            We don't judge you by old credit files. We see your story, your network, your ambition. 
            Use your social profiles to verify who you are—quick, safe, human.
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <Link to="/apply">
            <Button size="lg" className="rounded-full px-12 h-16 text-lg font-semibold">
              Apply Now
            </Button>
          </Link>
        </div>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Shield className="h-5 w-5" />
          <p className="text-sm">
            Takes 2 minutes. No pressure, no impact on your credit score.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroLanding;
