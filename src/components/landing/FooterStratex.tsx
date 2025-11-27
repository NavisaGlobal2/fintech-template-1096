import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import TechSkillLogo from './TechSkillLogo';

const FooterStratex = () => {
  return (
    <footer className="w-full py-12 md:py-16 px-6 bg-foreground text-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Logo & Tagline */}
          <div>
            <div className="mb-4">
              <TechSkillLogo className="h-10" />
            </div>
            <p className="text-background/70 leading-relaxed">
              Accelerate Your Career Today. Fair financial support for newcomers to the UK. 
              We see your story, not just your credit file.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <div className="space-y-3">
              <a href="#how-it-works" className="block text-background/70 hover:text-background transition-colors">
                How It Works
              </a>
              <Link to="/apply" className="block text-background/70 hover:text-background transition-colors">
                Apply Now
              </Link>
              <Link to="/install" className="block text-background/70 hover:text-background transition-colors">
                Install App
              </Link>
              <a href="#" className="block text-background/70 hover:text-background transition-colors">
                About Us
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <div className="space-y-3">
              <a href="#" className="block text-background/70 hover:text-background transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="block text-background/70 hover:text-background transition-colors">
                Terms of Service
              </a>
              <a href="#" className="block text-background/70 hover:text-background transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>

        <Separator className="mb-8 bg-background/20" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/60">
          <p>© 2024 Tech Skill UK. All rights reserved.</p>
          <p>Credit subject to status • UK only • FCA Regulated</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterStratex;
