
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, GraduationCap, DollarSign, Globe } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      value: '2,500+',
      label: 'Students Funded',
      description: 'African students pursuing their dreams globally'
    },
    {
      icon: DollarSign,
      value: '$12M+',
      label: 'Loans Facilitated',
      description: 'In education and career development funding'
    },
    {
      icon: GraduationCap,
      value: '150+',
      label: 'Partner Universities',
      description: 'Top institutions across US, UK, Canada & EU'
    },
    {
      icon: Globe,
      value: '25+',
      label: 'Countries Served',
      description: 'Supporting talent from across Africa'
    }
  ];

  return (
    <section className="w-full py-16 sm:py-20 px-4 sm:px-6 md:px-12 bg-primary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tighter text-primary-foreground">
            Our Impact in Numbers
          </h2>
          <p className="text-primary-foreground/80 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Real results from empowering African talent worldwide
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-primary-foreground/10 border-primary-foreground/20 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-base sm:text-lg font-medium text-primary-foreground mb-2">
                  {stat.label}
                </div>
                <div className="text-xs sm:text-sm text-primary-foreground/70">
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
