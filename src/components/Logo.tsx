
import React from 'react';
import { GraduationCap } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
        <GraduationCap className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="text-xl font-semibold text-foreground tracking-tight">TechScale</span>
    </div>
  );
};

export default Logo;
