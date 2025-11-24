import { Heart } from 'lucide-react';

const SocialProofSection = () => {
  return (
    <section className="py-20 px-6 bg-sageLight/30">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <Heart className="w-12 h-12 text-primary mx-auto" />
        <p className="text-2xl md:text-3xl text-foreground font-medium leading-relaxed">
          Your community matters—your connections help you unlock fairer options.
        </p>
      </div>
    </section>
  );
};

export default SocialProofSection;
