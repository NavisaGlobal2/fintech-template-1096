import TechScaleNavbar from '@/components/techscale/TechScaleNavbar';
import TechScaleNewHero from '@/components/techscale/TechScaleNewHero';
import ProofPointsSection from '@/components/techscale/ProofPointsSection';
import HowItWorksSection from '@/components/techscale/HowItWorksSection';
import SocialProofSection from '@/components/techscale/SocialProofSection';
import TechScaleSimpleFooter from '@/components/techscale/TechScaleSimpleFooter';

const TechScaleLanding = () => {
  return (
    <div className="min-h-screen bg-background">
      <TechScaleNavbar />
      <TechScaleNewHero />
      <ProofPointsSection />
      <HowItWorksSection />
      <SocialProofSection />
      <TechScaleSimpleFooter />
    </div>
  );
};

export default TechScaleLanding;
