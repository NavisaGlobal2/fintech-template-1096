import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="w-full py-20 md:py-28 px-6 bg-brand-yellow-light">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
          Let your network<br />speak for you
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          Connect LinkedIn. Get funded in 24-48hrs.
        </p>
        
        <Link to="/apply">
          <Button size="lg" className="rounded-full px-12 h-16 text-xl font-semibold mb-8 shadow-lg hover:shadow-xl transition-shadow">
            Start Your Application
          </Button>
        </Link>
        
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Your information is secure • No impact on credit score • Free to apply</span>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
