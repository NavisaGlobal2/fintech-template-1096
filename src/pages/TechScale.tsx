import TechScaleHero from '@/components/techscale/TechScaleHero';
import LoanMatcher from '@/components/techscale/LoanMatcher';
import TechScaleFooter from '@/components/techscale/TechScaleFooter';
import Header from '@/components/Header';
import UserGuide from '@/components/techscale/UserGuide';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Coins, Shield, Users } from 'lucide-react';

const TechScale = () => {
  const [showGuide, setShowGuide] = useState(false);

  if (showGuide) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowGuide(false)}
            >
              ← Back to Main Site
            </Button>
          </div>
          <UserGuide />
        </div>
        <TechScaleFooter onShowGuide={() => setShowGuide(true)} />
      </div>
    );
  }

  const scrollToMatcher = () => {
    const matcherElement = document.getElementById('loan-matcher');
    if (matcherElement) {
      matcherElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <TechScaleHero />

        {/* Three Proof Points Section */}
        <section className="w-full py-16 md:py-20 px-6 md:px-12 bg-background">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Proof Point 1 */}
              <div className="clean-card p-8 space-y-4 hover-lift">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Coins className="h-7 w-7 text-primary" />
                </div>
                <p className="text-lg text-foreground leading-relaxed">
                  £300–£2,500 to help with skills, tools, or settling in
                </p>
              </div>

              {/* Proof Point 2 */}
              <div className="clean-card p-8 space-y-4 hover-lift">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <p className="text-lg text-foreground leading-relaxed">
                  Clear repayments, no hidden fees
                </p>
              </div>

              {/* Proof Point 3 */}
              <div className="clean-card p-8 space-y-4 hover-lift">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <p className="text-lg text-foreground leading-relaxed">
                  Real human support if life gets complicated
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Line */}
        <section className="w-full py-12 px-6 md:px-12 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xl md:text-2xl text-foreground/80 font-medium leading-relaxed">
              Your community matters—your connections help you unlock fairer options.
            </p>
          </div>
        </section>

        <LoanMatcher />

        {/* Final CTA Section */}
        <section className="w-full py-20 px-6 md:px-12 bg-primary">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-medium text-primary-foreground">
              Ready to take the next step?
            </h2>
            <Button
              onClick={scrollToMatcher}
              variant="secondary"
              size="lg"
              className="text-base h-14 px-8"
            >
              Check my eligibility
            </Button>
          </div>
        </section>
      </main>
      <TechScaleFooter onShowGuide={() => setShowGuide(true)} />
    </div>
  );
};

export default TechScale;
