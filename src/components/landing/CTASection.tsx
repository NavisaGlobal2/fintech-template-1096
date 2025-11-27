import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="w-full py-20 md:py-28 px-6 bg-sageLight/40">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
          Ready for a<br />fresh start?
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          Join thousands of newcomers who've taken the first step toward building their future in the UK.
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
