import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-diverse-professionals.jpg';

const TechScaleNewHero = () => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center pt-20 px-6"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/90" />
      
      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight">
          A little credit.{' '}
          <span className="block mt-2">A fresh start.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
          Because moving to a new country is hard enough—getting fair financial support shouldn't be.
        </p>
        
        <div className="inline-block bg-sageLight/30 rounded-[2rem] p-6 max-w-2xl mx-auto">
          <p className="text-lg text-foreground/90 leading-relaxed">
            We don't judge you by old credit files. We see your story, your network, your ambition. 
            Use your social profiles to verify who you are—quick, safe, human.
          </p>
        </div>
        
        <div className="pt-4">
          <Link to="/apply">
            <Button size="lg" className="rounded-full text-lg h-16 px-12 hover:scale-105 transition-transform">
              Apply Now
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-sm text-foreground/60">
          <Shield className="w-4 h-4" />
          <span>Takes 2 minutes. No pressure, no impact on your credit score.</span>
        </div>
      </div>
    </section>
  );
};

export default TechScaleNewHero;
