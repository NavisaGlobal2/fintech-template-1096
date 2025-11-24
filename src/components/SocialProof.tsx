import React from 'react';
import { Heart } from 'lucide-react';

const SocialProof = () => {
  return (
    <section className="w-full py-20 px-6 bg-card">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-sageLight flex items-center justify-center">
          <Heart className="h-8 w-8 text-sageDark" />
        </div>
        <p className="text-2xl md:text-3xl text-foreground font-medium leading-relaxed">
          Your community matters—your connections help you unlock fairer options.
        </p>
      </div>
    </section>
  );
};

export default SocialProof;
