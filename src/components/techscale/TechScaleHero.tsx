import React from 'react';
import { Button } from '@/components/ui/button';

const TechScaleHero = () => {
  const scrollToMatcher = () => {
    const matcherElement = document.getElementById('loan-matcher');
    if (matcherElement) {
      matcherElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full py-16 md:py-24 px-6 md:px-12 bg-background">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left: Content */}
          <div className="space-y-8 text-left">
            {/* Main headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-balance text-foreground leading-tight">
              A little credit.{' '}
              <span className="block mt-2">A fresh start.</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              Because moving to a new country is hard enough—getting fair financial support shouldn't be.
            </p>

            {/* Human trust line */}
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed max-w-xl">
              We don't judge you by old credit files. We see your story, your network, your ambition.
              Use your social profiles to verify who you are—quick, safe, human.
            </p>

            {/* CTA */}
            <div className="space-y-3 pt-4">
              <Button 
                onClick={scrollToMatcher}
                size="lg"
                className="text-base h-14 px-8"
              >
                Check my eligibility
              </Button>
              
              {/* Reassurance under CTA */}
              <p className="text-sm text-muted-foreground">
                Takes 2 minutes. No pressure, no impact on your credit score.
              </p>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            <div className="aspect-[4/5] bg-gradient-to-br from-accent/30 via-accent/20 to-background rounded-2xl overflow-hidden border border-border shadow-lg">
              {/* Placeholder for professional image */}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-warmBrown/10 to-softPeach/20">
                <div className="text-center space-y-4 p-8">
                  <div className="w-24 h-24 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-4xl">✨</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Professional portrait placeholder
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechScaleHero;
