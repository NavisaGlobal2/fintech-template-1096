
import TechScaleHero from '@/components/techscale/TechScaleHero';
import LoanMatcher from '@/components/techscale/LoanMatcher';
import StatsSection from '@/components/techscale/StatsSection';
import FAQSection from '@/components/techscale/FAQSection';
import TechScaleFooter from '@/components/techscale/TechScaleFooter';
import Header from '@/components/Header';

const TechScale = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <TechScaleHero />

        {/* Why TechScale Section */}
        <section className="w-full py-20 px-6 md:px-12 bg-background">
          <div className="max-w-6xl mx-auto text-center space-y-12">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
                Break Barriers. Build Dreams.
              </h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                At <strong>TechScale</strong>, we believe talent should not be limited by borders or bank balances.
                Whether you're an African student heading overseas or a young professional abroad looking to upskill, 
                we connect you to trusted financing options, microloans, and sponsor networks — so you can focus on your future.
              </p>
            </div>
          </div>
        </section>

        <LoanMatcher />
        
        <StatsSection />
        
        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-20 px-6 md:px-12 bg-background">
          <div className="max-w-6xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
                How It Works – 3 Steps
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Get matched with the perfect financing for your education and career journey in three simple steps
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto">
                  1
                </div>
                <h3 className="text-xl font-medium">Tell Us About Your Plans</h3>
                <p className="text-muted-foreground">
                  Fill out our quick application — your destination, field of study, or career goal.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto">
                  2
                </div>
                <h3 className="text-xl font-medium">Get Matched</h3>
                <p className="text-muted-foreground">
                  Our smart match engine connects you to vetted lenders, career microloans, or sponsors.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto">
                  3
                </div>
                <h3 className="text-xl font-medium">Secure Your Funding</h3>
                <p className="text-muted-foreground">
                  Apply directly through our trusted partners or with TechScale's in-house Career Credit.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Help Section */}
        <section className="w-full py-20 px-6 md:px-12 bg-muted/30">
          <div className="max-w-6xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
                Who We Help
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Empowering African talent at every stage of their global journey
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background p-8 rounded-lg shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-2xl">🎓</span>
                </div>
                <h3 className="text-xl font-medium">African Students Abroad</h3>
                <p className="text-muted-foreground">
                  Study at top universities without worrying about upfront costs.
                </p>
              </div>
              
              <div className="bg-background p-8 rounded-lg shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-2xl">💼</span>
                </div>
                <h3 className="text-xl font-medium">Young Professionals Overseas</h3>
                <p className="text-muted-foreground">
                  Access career credit for certifications, relocations, and professional growth.
                </p>
              </div>
              
              <div className="bg-background p-8 rounded-lg shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-xl font-medium">Diaspora Sponsors & Investors</h3>
                <p className="text-muted-foreground">
                  Support the next generation of African talent while tracking impact.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Financing Options Section */}
        <section className="w-full py-20 px-6 md:px-12 bg-background">
          <div className="max-w-6xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
                Our Financing Options
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Flexible funding solutions tailored to your unique journey
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg border border-border bg-card space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">SL</span>
                </div>
                <h3 className="text-xl font-medium text-left">Study Abroad Loans</h3>
                <p className="text-muted-foreground text-left">
                  Co-signer-free options from trusted global lenders.
                </p>
              </div>
              
              <div className="p-6 rounded-lg border border-border bg-card space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">SC</span>
                </div>
                <h3 className="text-xl font-medium text-left">Career Microloans (SkillCredit)</h3>
                <p className="text-muted-foreground text-left">
                  £500–£7,500 for upskilling and certifications.
                </p>
              </div>
              
              <div className="p-6 rounded-lg border border-border bg-card space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">SM</span>
                </div>
                <h3 className="text-xl font-medium text-left">Sponsor Match</h3>
                <p className="text-muted-foreground text-left">
                  Connect with diaspora donors, alumni, and NGOs for grants or partial funding.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="w-full py-20 px-6 md:px-12 bg-muted/30">
          <div className="max-w-6xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
                Why Choose TechScale
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Built for African talent, trusted by professionals worldwide
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-primary">🔗</span>
                </div>
                <h3 className="font-medium">TechSkill UK Ecosystem</h3>
                <p className="text-sm text-muted-foreground">
                  Built into the TechSkill UK learning ecosystem.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-primary">🤝</span>
                </div>
                <h3 className="font-medium">Trusted Partners</h3>
                <p className="text-sm text-muted-foreground">
                  Partners with trusted global and local lenders.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-primary">💎</span>
                </div>
                <h3 className="font-medium">Transparent Terms</h3>
                <p className="text-sm text-muted-foreground">
                  Transparent terms — no hidden fees.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-primary">⭐</span>
                </div>
                <h3 className="font-medium">Real Stories</h3>
                <p className="text-sm text-muted-foreground">
                  Real stories from real students and professionals we've helped.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section id="success-stories" className="w-full py-20 px-6 md:px-12 bg-background">
          <div className="max-w-6xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
                Success Stories
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Real stories from African students and professionals who achieved their dreams with TechScale
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium">AO</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Adaora Okafor</h4>
                      <p className="text-sm text-muted-foreground">Nigeria → MIT, USA</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    "TechScale helped me find the perfect loan for my Computer Science PhD at MIT. The process was seamless and I got approved within weeks!"
                  </p>
                </div>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium">KM</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Kwame Mensah</h4>
                      <p className="text-sm text-muted-foreground">Ghana → Oxford, UK</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    "The loan matching was incredibly accurate. I found three great options for my MBA and chose the one with the best terms for my situation."
                  </p>
                </div>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium">LW</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Lena Wanjiku</h4>
                      <p className="text-sm text-muted-foreground">Kenya → Toronto, Canada</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    "TechScale not only found me financing but also helped improve my credit readiness. Now I'm pursuing my dream in Data Science!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FAQSection />

        {/* Final CTA Section */}
        <section className="w-full py-20 px-6 md:px-12 bg-primary">
          <div className="max-w-6xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-primary-foreground">
                Your future starts here.
              </h2>
              <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
                Don't let funding hold you back — take the first step today.
              </p>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={() => {
                  const matcherElement = document.getElementById('loan-matcher');
                  if (matcherElement) {
                    matcherElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8 py-3 rounded-lg font-medium text-lg transition-colors"
              >
                Start My Application →
              </button>
            </div>
            
            {/* Trust Section */}
            <div className="pt-12 border-t border-primary-foreground/20">
              <p className="text-primary-foreground/60 text-sm mb-4">Proudly partnered with [Partner Logos]</p>
              <div className="flex justify-center gap-8 text-primary-foreground/80 text-sm font-medium">
                <span>Secure</span>
                <span>•</span>
                <span>Transparent</span>
                <span>•</span>
                <span>Impact-Driven</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <TechScaleFooter />
    </div>
  );
};

export default TechScale;
