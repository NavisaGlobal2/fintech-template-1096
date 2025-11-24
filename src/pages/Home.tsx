import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HeroLanding from '@/components/HeroLanding';
import ProofPoints from '@/components/ProofPoints';
import HowItWorks from '@/components/HowItWorks';
import SocialProof from '@/components/SocialProof';
import FooterLanding from '@/components/FooterLanding';
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
      <Navbar />
      <main>
        <HeroLanding />
        <ProofPoints />
        <HowItWorks />
        <SocialProof />
      </main>
      <FooterLanding />
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </div>
  );
};

export default Home;
