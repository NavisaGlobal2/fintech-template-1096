import React from 'react';
import Navbar from '@/components/Navbar';
import HeroLanding from '@/components/HeroLanding';
import ProofPoints from '@/components/ProofPoints';
import HowItWorks from '@/components/HowItWorks';
import SocialProof from '@/components/SocialProof';
import FooterLanding from '@/components/FooterLanding';

const Home = () => {
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
    </div>
  );
};

export default Home;
