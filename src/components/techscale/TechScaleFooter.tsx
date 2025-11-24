import React from 'react';
import TechScaleLogo from './TechScaleLogo';
import { Separator } from '@/components/ui/separator';

const TechScaleFooter = ({ onShowGuide }: { onShowGuide?: () => void }) => {
  return (
    <footer className="bg-background border-t border-border py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4 max-w-md">
            <TechScaleLogo />
            <p className="text-muted-foreground text-sm leading-relaxed">
              Fair financial support for newcomers to the UK. We see your story, not just your credit file.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col md:flex-row gap-6 text-sm">
            <button 
              onClick={onShowGuide}
              className="text-muted-foreground hover:text-primary transition-colors text-left"
            >
              How to Use
            </button>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Terms
            </a>
          </div>
        </div>

        <Separator className="mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>TechScale Accelerate • Credit subject to status • UK only</p>
          <p>&copy; 2024 TechScale. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default TechScaleFooter;
