
import React, { useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import TechScaleHero from '@/components/techscale/TechScaleHero';
import TechScaleLogo from '@/components/techscale/TechScaleLogo';
import TechScaleFooter from '@/components/techscale/TechScaleFooter';
import StatsSection from '@/components/techscale/StatsSection';
import FAQSection from '@/components/techscale/FAQSection';
import LoanMatcher from '@/components/techscale/LoanMatcher';
import UnderwritingDashboard from '@/components/techscale/UnderwritingDashboard';

export default function TechScale() {
  const [currentView, setCurrentView] = useState<'home' | 'loan-matcher' | 'underwriting'>('home');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'loan-matcher':
        return <LoanMatcher onBack={() => setCurrentView('home')} />;
      case 'underwriting':
        return <UnderwritingDashboard onBack={() => setCurrentView('home')} />;
      default:
        return (
          <>
            <TechScaleHero onGetStarted={() => setCurrentView('loan-matcher')} />
            <StatsSection />
            <FAQSection />
          </>
        );
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="cosmic-bg">
          {/* Navigation */}
          <nav className="border-b border-white/20 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center gap-8">
                  <TechScaleLogo />
                  <div className="hidden md:flex items-center space-x-6">
                    <button 
                      onClick={() => setCurrentView('home')}
                      className={`text-sm font-medium transition-colors ${
                        currentView === 'home' ? 'text-primary' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Home
                    </button>
                    <button 
                      onClick={() => setCurrentView('loan-matcher')}
                      className={`text-sm font-medium transition-colors ${
                        currentView === 'loan-matcher' ? 'text-primary' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Find Loans
                    </button>
                    <button 
                      onClick={() => setCurrentView('underwriting')}
                      className={`text-sm font-medium transition-colors ${
                        currentView === 'underwriting' ? 'text-primary' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Underwriting
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {/* Auth components would go here */}
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main>
            {renderCurrentView()}
          </main>

          {/* Footer */}
          {currentView === 'home' && <TechScaleFooter />}
        </div>
      </div>
    </AuthProvider>
  );
}
