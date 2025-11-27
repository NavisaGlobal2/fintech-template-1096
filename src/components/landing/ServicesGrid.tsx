import React from 'react';
import { GraduationCap, Home, Briefcase, Heart } from 'lucide-react';

const ServicesGrid = () => {
  const services = [
    {
      icon: GraduationCap,
      title: 'Skills & Training',
      amount: '£300–£2,500',
      description: 'Certifications & courses',
    },
    {
      icon: Home,
      title: 'Settlement Support',
      amount: '£300–£2,000',
      description: 'Deposits & essentials',
    },
    {
      icon: Briefcase,
      title: 'Career Development',
      amount: '£500–£2,500',
      description: 'Tools & equipment',
    },
    {
      icon: Heart,
      title: 'Emergency Funds',
      amount: '£300–£1,500',
      description: 'Unexpected expenses',
    },
  ];

  return (
    <section className="w-full py-20 md:py-28 px-6 bg-brand-yellow-light">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            How we help<br />newcomers thrive
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Your professional profile unlocks opportunities.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={index}
                className="bg-card rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border group"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-primary font-semibold mb-4">
                  {service.amount}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
