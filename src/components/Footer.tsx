
import React from 'react';
import { Heart, Mail, MapPin, Phone } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Logo />
            <p className="text-muted-foreground text-sm leading-relaxed">
              Empowering African talent to achieve global dreams through accessible education financing and career growth opportunities.
            </p>
            <div className="flex space-x-4">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                <span className="text-xs font-medium">f</span>
              </div>
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                <span className="text-xs font-medium">t</span>
              </div>
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                <span className="text-xs font-medium">in</span>
              </div>
            </div>
          </div>

          {/* Financing Options */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Financing Options</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Study Abroad Loans</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Career Microloans</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Sponsor Matching</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">SkillCredit Program</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Alumni Network</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Success Stories</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Study Abroad Guide</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Career Development</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Financial Literacy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Partner Universities</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>hello@techscale.co.uk</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+44 20 7946 0958</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>London, United Kingdom</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-muted-foreground text-sm">
            © 2024 TechScale. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 text-muted-foreground text-sm">
            <span>Made with</span>
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            <span>for African talent worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
