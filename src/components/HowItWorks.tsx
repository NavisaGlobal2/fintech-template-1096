import React from 'react';
import { CheckCircle, FileCheck, Zap } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: "Verify your profile",
      description: "Use your social profiles and documents to show who you are",
      icon: CheckCircle,
      image: "/step-verify-profile.jpg",
      imagePosition: "left"
    },
    {
      number: 2,
      title: "Get matched to options",
      description: "We match you to fair loan options based on your situation",
      icon: FileCheck,
      image: "/step-matched-options.jpg",
      imagePosition: "right"
    },
    {
      number: 3,
      title: "Access funds fast",
      description: "Once approved, funds arrive quickly so you can move forward",
      icon: Zap,
      image: "/step-access-funds.jpg",
      imagePosition: "left"
    }
  ];

  return (
    <section id="how" className="w-full py-12 sm:py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8 sm:mb-12 md:mb-16 text-foreground px-2">
          How it works
        </h2>
        
        <div className="space-y-12 sm:space-y-16 md:space-y-24">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLeft = step.imagePosition === "left";
            
            return (
              <div 
                key={index}
                className={`flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 sm:gap-8 md:gap-12 items-center`}
                style={{
                  animation: `fadeIn 0.6s ease-out ${index * 200}ms backwards`
                }}
              >
                {/* Image Side */}
                <div className="w-full md:w-1/2 relative">
                  <div className="relative aspect-[4/3] rounded-2xl sm:rounded-[2rem] overflow-hidden group">
                    {/* Step Number Badge */}
                    <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-sage to-sageDark flex items-center justify-center text-xl sm:text-2xl font-bold text-white shadow-lg z-10">
                      {step.number}
                    </div>
                    
                    {/* Image */}
                    <OptimizedImage
                      src={step.image} 
                      alt={step.title}
                      priority={index === 0}
                      className="transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-sageDark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>

                {/* Content Side */}
                <div className="w-full md:w-1/2 space-y-4 sm:space-y-6 px-2">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-sageLight flex items-center justify-center group hover:scale-110 hover:rotate-6 transition-all duration-300">
                    <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-sageDark" />
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                    {step.title}
                  </h3>
                  
                  <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
