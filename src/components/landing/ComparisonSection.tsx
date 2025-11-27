import React from 'react';
import { X, Check } from 'lucide-react';

const ComparisonSection = () => {
  const otherLenders = [
    'Credit score only',
    'No UK history? Rejected',
    "Banks don't see you",
    'Weeks to decide',
  ];

  const techscale = [
    'Your LinkedIn is your application',
    'Professional network matters',
    'Community vouches for you',
    '24-48hr decisions',
  ];

  return (
    <section className="w-full py-20 md:py-28 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground text-center mb-16 tracking-tight">
          Why choose Tech Skill UK?
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Other Lenders */}
          <div className="bg-card border-2 border-border rounded-3xl p-8 md:p-10">
            <h3 className="text-2xl font-bold text-muted-foreground mb-8">
              Other Lenders
            </h3>
            <div className="space-y-6">
              {otherLenders.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center mt-0.5">
                    <X className="h-4 w-4 text-destructive" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Skill UK */}
          <div className="bg-primary/5 border-2 border-primary rounded-3xl p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
              Our Approach
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-8">
              Tech Skill UK
            </h3>
            <div className="space-y-6">
              {techscale.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center mt-0.5">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <p className="text-foreground leading-relaxed font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
