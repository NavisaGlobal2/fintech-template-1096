import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NavbarStratex from '@/components/landing/NavbarStratex';
import HeroStratex from '@/components/landing/HeroStratex';
import StatsBar from '@/components/landing/StatsBar';
import ComparisonSection from '@/components/landing/ComparisonSection';
import SocialProfileSection from '@/components/landing/SocialProfileSection';
import ServicesGrid from '@/components/landing/ServicesGrid';
import ProcessSteps from '@/components/landing/ProcessSteps';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CTASection from '@/components/landing/CTASection';
import FooterStratex from '@/components/landing/FooterStratex';
import StickyApplyCTA from '@/components/landing/StickyApplyCTA';
import AuthModal from '@/components/auth/AuthModal';

const Home = () => {
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (location.state?.openAuth) {
      setShowAuthModal(true);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background">
      <NavbarStratex />
      <main>
        <HeroStratex />
        <StatsBar />
        <ComparisonSection />
        <SocialProfileSection />
        <ServicesGrid />
        <ProcessSteps />
        <TestimonialsSection />
        <CTASection />
      </main>
      <FooterStratex />
      <StickyApplyCTA />
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </div>
  );
};

export default Home;
