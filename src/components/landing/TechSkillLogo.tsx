import React from 'react';

const TechSkillLogo = ({ className = "h-8" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Arrow Logo */}
      <svg viewBox="0 0 100 80" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Yellow top arrow */}
        <path d="M0 0 L50 0 L70 40 L20 40 Z" fill="hsl(45, 100%, 51%)" />
        {/* White bottom arrows */}
        <path d="M20 40 L70 40 L90 80 L40 80 Z" fill="white" />
        <path d="M40 40 L65 40 L75 60 L85 80 L50 80 L60 60 Z" fill="white" opacity="0.9" />
      </svg>
      
      {/* Text */}
      <div className="flex flex-col leading-none">
        <span className="font-bold text-xl tracking-tight">Tech Skill</span>
        <span className="text-xs font-semibold tracking-wider">UK</span>
      </div>
    </div>
  );
};

export default TechSkillLogo;
