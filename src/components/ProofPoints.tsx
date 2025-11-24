import React from 'react';
import { Coins, FileText, Users } from 'lucide-react';

const ProofPoints = () => {
  const points = [
    {
      icon: Coins,
      text: "£300–£2,500 to help with skills, tools, or settling in"
    },
    {
      icon: FileText,
      text: "Clear repayments, no hidden fees"
    },
    {
      icon: Users,
      text: "Real human support if life gets complicated"
    }
  ];

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-sageLight/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {points.map((point, index) => {
            const Icon = point.icon;
            return (
              <div key={index} className="bg-card rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-sageLight flex items-center justify-center mb-4 sm:mb-6">
                  <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-sageDark" />
                </div>
                <p className="text-base sm:text-lg text-foreground leading-relaxed">
                  {point.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProofPoints;
