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
    <section className="w-full py-20 px-6 bg-sageLight/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {points.map((point, index) => {
            const Icon = point.icon;
            return (
              <div key={index} className="bg-card rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-full bg-sageLight flex items-center justify-center mb-6">
                  <Icon className="h-8 w-8 text-sageDark" />
                </div>
                <p className="text-lg text-foreground leading-relaxed">
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
