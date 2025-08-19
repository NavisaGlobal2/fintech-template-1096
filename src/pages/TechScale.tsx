
import { Toaster } from "@/components/ui/toaster";
import TechScaleHero from "@/components/techscale/TechScaleHero";
import StatsSection from "@/components/techscale/StatsSection";
import LoanMatcher from "@/components/techscale/LoanMatcher";
import LoanProcessFlow from "@/components/techscale/LoanProcessFlow";
import FAQSection from "@/components/techscale/FAQSection";
import TechScaleFooter from "@/components/techscale/TechScaleFooter";

const TechScale = () => {
  return (
    <div className="min-h-screen bg-background">
      <TechScaleHero />
      <StatsSection />
      <LoanProcessFlow />
      <LoanMatcher />
      <FAQSection />
      <TechScaleFooter />
      <Toaster />
    </div>
  );
};

export default TechScale;
