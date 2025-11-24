import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TechScaleHero = () => {
  const scrollToMatcher = () => {
    const matcherElement = document.getElementById('loan-matcher');
    if (matcherElement) {
      matcherElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full py-0 px-0 bg-background">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-0 items-stretch min-h-[600px]">
          {/* Left: Professional Image */}
          <div className="relative order-2 md:order-1">
            <div className="w-full h-full bg-gradient-to-br from-warmTan via-warmTan to-warmTan/80 flex items-center justify-center">
              {/* Placeholder for professional portrait */}
              <div className="text-center space-y-4 p-8">
                <div className="w-32 h-32 mx-auto rounded-full bg-foreground/10 flex items-center justify-center">
                  <span className="text-5xl">👤</span>
                </div>
                <p className="text-foreground/60 text-sm">
                  Professional portrait
                </p>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex items-center px-8 md:px-16 py-16 order-1 md:order-2 bg-background">
            <div className="space-y-8 w-full max-w-xl">
              {/* Main headline - FINTURE style bold typography */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance text-foreground leading-[1.1]">
                A little credit.{' '}
                <span className="block mt-2">A fresh start.</span>
              </h1>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Because moving to a new country is hard enough—getting fair financial support shouldn't be.
              </p>

              {/* Human trust line */}
              <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
                We don't judge you by old credit files. We see your story, your network, your ambition.
                Use your social profiles to verify who you are—quick, safe, human.
              </p>

              {/* Email form - FINTURE style */}
              <div className="space-y-3 pt-4">
                <div className="flex gap-0 border border-border overflow-hidden">
                  <Input 
                    type="email"
                    placeholder="Enter your email..."
                    className="flex-1 border-0 rounded-none h-14 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button 
                    onClick={scrollToMatcher}
                    className="rounded-none h-14 px-8 text-base font-medium"
                  >
                    Submit
                  </Button>
                </div>
                
                {/* Reassurance under form */}
                <p className="text-sm text-muted-foreground">
                  Takes 2 minutes. No pressure, no impact on your credit score.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechScaleHero;
