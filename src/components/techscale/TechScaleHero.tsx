
import React from 'react';
import { Button } from '@/components/ui/button';
import { GraduationCap, TrendingUp, MapPin } from 'lucide-react';

const TechScaleHero = () => {
  const scrollToMatcher = () => {
    const matcherElement = document.getElementById('loan-matcher');
    if (matcherElement) {
      matcherElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToHowItWorks = () => {
    const howItWorksElement = document.getElementById('how-it-works');
    if (howItWorksElement) {
      howItWorksElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full py-20 px-6 md:px-12 bg-background">
      {/* Background effects */}
      <div className="absolute inset-0 cosmic-grid opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full">
        <div className="w-full h-full opacity-10 bg-primary blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8">
        {/* Status badge */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-muted text-primary border border-primary/20">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            Now Available for African Students & Professionals
          </span>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tighter text-balance text-foreground">
          Finance Your <span className="text-primary">Global Future</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
          From Africa to the world — secure study abroad and career growth financing designed for your journey.
        </p>

        {/* Feature highlights */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8">
          <div className="flex flex-col items-center space-y-3 p-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium text-foreground">Study Abroad Loans</h3>
            <p className="text-sm text-muted-foreground text-center">Co-signer-free options from trusted global lenders</p>
          </div>
          <div className="flex flex-col items-center space-y-3 p-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium text-foreground">Career Microloans</h3>
            <p className="text-sm text-muted-foreground text-center">£500–£7,500 for upskilling and certifications</p>
          </div>
          <div className="flex flex-col items-center space-y-3 p-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium text-foreground">Sponsor Match</h3>
            <p className="text-sm text-muted-foreground text-center">Connect with diaspora donors, alumni, and NGOs</p>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button 
            onClick={scrollToMatcher}
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-base h-12 px-8"
          >
            Check Your Eligibility →
          </Button>
          <Button 
            variant="outline" 
            className="border-border text-foreground hover:bg-muted text-base h-12 px-8"
            onClick={scrollToHowItWorks}
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TechScaleHero;
