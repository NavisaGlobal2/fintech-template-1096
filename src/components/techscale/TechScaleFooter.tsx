
import React from 'react';
import TechScaleLogo from './TechScaleLogo';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react';

const TechScaleFooter = ({ onShowGuide }: { onShowGuide?: () => void }) => {
  return (
    <footer className="bg-background border-t border-border py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <TechScaleLogo />
            <p className="text-muted-foreground text-sm">
              Empowering African talent worldwide through accessible education financing and career development opportunities.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Study Abroad Loans</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Career Microloans</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Sponsor Matching</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Credit Building</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li>
                <button 
                  onClick={onShowGuide}
                  className="hover:text-primary transition-colors text-left"
                >
                  📖 How to Use
                </button>
              </li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>hello@techscale.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>+44 20 1234 5678</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>London, UK</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
          </div>
          <p>&copy; 2024 TechScale. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default TechScaleFooter;
