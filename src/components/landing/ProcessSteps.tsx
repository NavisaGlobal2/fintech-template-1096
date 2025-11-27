import React from 'react';
import { FileText, Search, Banknote } from 'lucide-react';

const ProcessSteps = () => {
  const steps = [
    {
      icon: FileText,
      number: '01',
      title: 'Apply in 2 minutes',
      description: 'No paperwork. No credit check.',
    },
    {
      icon: Search,
      number: '02',
      title: 'Get matched',
      description: 'We find your best match.',
    },
    {
      icon: Banknote,
      number: '03',
      title: 'Receive funds',
      description: '24-48hrs. Funds in your account.',
    },
  ];

  return (
    <section id="how-it-works" className="w-full py-20 md:py-28 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Simple process.<br />Fast results.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection line - hidden on mobile */}
          <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-border" style={{ width: 'calc(100% - 200px)', left: '100px' }} />
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative text-center">
                {/* Step circle */}
                <div className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <Icon className="h-9 w-9 text-primary-foreground" />
                </div>
                
                {/* Step number */}
                <div className="text-6xl font-bold text-muted-foreground/20 mb-4">
                  {step.number}
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
