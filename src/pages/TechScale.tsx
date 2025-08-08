
import React from 'react';
import Header from '@/components/Header';
import TechScaleHero from '@/components/techscale/TechScaleHero';
import LoanMatcher from '@/components/techscale/LoanMatcher';
import Footer from '@/components/Footer';

const TechScale = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <TechScaleHero />
        <LoanMatcher />
      </main>
      <Footer />
    </div>
  );
};

export default TechScale;
