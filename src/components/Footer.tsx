
import React from 'react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="w-full py-12 md:py-16 px-4 md:px-6 lg:px-12 border-t border-border bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10">
          <div className="md:col-span-2 space-y-4 md:space-y-6">
            <Logo />
            <p className="text-muted-foreground max-w-xs text-sm md:text-base">
              Connecting African students and professionals with credible education financing options worldwide.
            </p>
            <div className="flex items-center gap-3 md:gap-4">
              <a href="#" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors touch-manipulation">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 3.01s-2.018 1.192-3.14 1.53a4.48 4.48 0 00-7.86 3v1a10.66 10.66 0 01-9-4.53s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5 0-.278-.028-.556-.08-.83C21.94 5.674 23 3.01 23 3.01z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors touch-manipulation">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 9h4v12H2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors touch-manipulation">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors touch-manipulation">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2c.313-1.732.467-3.482.46-5.33a29.005 29.005 0 00-.46-5.33z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.75 15.02l5.75-3.27-5.75-3.27v6.54z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="space-y-3 md:space-y-4">
            <h4 className="font-medium text-base md:text-lg text-foreground">Platform</h4>
            <ul className="space-y-2 md:space-y-3">
              <li><a href="#loan-matcher" className="text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors touch-manipulation">Loan Matcher</a></li>
              <li><a href="#" className="text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors touch-manipulation">Lender Partners</a></li>
              <li><a href="#" className="text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors touch-manipulation">Credit Guidance</a></li>
              <li><a href="#" className="text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors touch-manipulation">Application Tracking</a></li>
              <li><a href="#" className="text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors touch-manipulation">Mobile App</a></li>
            </ul>
          </div>
          
          <div className="space-y-3 md:space-y-4">
            <h4 className="font-medium text-base md:text-lg text-foreground">Education</h4>
            <ul className="space-y-2 md:space-y-3">
              <li><a href="#" className="text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors touch-manipulation">Study Abroad Guide</a></li>
              <li><a href="#" className="text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors touch-manipulation">Scholarship Database</a></li>
              <li><a href="#" className="text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors touch-manipulation">University Rankings</a></li>
              <li><a href="#" className="text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors touch-manipulation">Visa Information</a></li>
              <li><a href="#" className="text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors touch-manipulation">Career Guidance</a></li>
            </ul>
          </div>
          
          <div className="space-y-3 md:space-y-4">
            <h4 className="font-medium text-base md:text-lg text-foreground">Support</h4>
            <ul className="space-y-2 md:space-y-3">
              <li><a href="#" className="text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors touch-manipulation">Help Center</a></li>
              <li><a href="#" className="text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors touch-manipulation">Financial Advisors</a></li>
              <li><a href="#" className="text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors touch-manipulation">Application Support</a></li>
              <li><a href="#" className="text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors touch-manipulation">Community Forum</a></li>
              <li><a href="#" className="text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors touch-manipulation">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-muted-foreground text-sm">
          <div className="text-center md:text-left">© 2025 TechScale. All rights reserved.</div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-foreground transition-colors touch-manipulation">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors touch-manipulation">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors touch-manipulation">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
