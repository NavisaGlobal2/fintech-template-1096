import React from 'react';
import { Linkedin, Network, CheckCircle } from 'lucide-react';

const SocialProfileSection = () => {
  const features = [
    {
      icon: Linkedin,
      title: 'Connect LinkedIn',
      description: 'Share your professional story.',
    },
    {
      icon: Network,
      title: 'We assess your network',
      description: 'Skills, connections, reputation.',
    },
    {
      icon: CheckCircle,
      title: 'Get approved',
      description: '24-48hrs. No credit check.',
    },
  ];

  return (
    <section className="w-full py-20 md:py-28 px-6 bg-primary/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            How Social Profile Works
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We see your skills, your network, your ambition. Not a number.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SocialProfileSection;
