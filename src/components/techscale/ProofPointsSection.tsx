import { Coins, FileText, Users } from 'lucide-react';

const ProofPointsSection = () => {
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
    <section className="py-20 px-6 bg-sageLight/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {points.map((point, index) => (
            <div 
              key={index}
              className="text-center space-y-4 p-6 hover:scale-105 transition-transform"
            >
              <div className="w-20 h-20 rounded-full bg-sageLight flex items-center justify-center mx-auto">
                <point.icon className="w-10 h-10 text-primary" />
              </div>
              <p className="text-lg text-foreground/90 leading-relaxed">
                {point.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProofPointsSection;
