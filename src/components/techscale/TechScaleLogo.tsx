
import React from 'react';

const TechScaleLogo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
        <span className="text-primary-foreground font-bold text-lg">T</span>
      </div>
      <span className="font-bold text-xl tracking-tight">Tech Skill Accelerate</span>
    </div>
  );
};

export default TechScaleLogo;
