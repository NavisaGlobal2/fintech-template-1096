import React from 'react';

const FooterLanding = () => {
  return (
    <footer className="w-full py-12 px-6 border-t border-border bg-card">
      <div className="max-w-6xl mx-auto text-center space-y-4">
        <p className="text-foreground font-medium">
          TechScale Accelerate • Credit subject to status • UK only
        </p>
        <div className="flex justify-center gap-6">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
};

export default FooterLanding;
