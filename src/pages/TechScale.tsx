
import TechScaleHero from '@/components/techscale/TechScaleHero';
import LoanMatcher from '@/components/techscale/LoanMatcher';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TechScale = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <TechScaleHero />
        
        {/* Why TechScale Section */}
        <section className="w-full py-20 px-6 md:px-12 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-medium tracking-tighter text-foreground">
                Break Barriers. Build Dreams.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At <strong>TechScale</strong>, we believe talent should not be limited by borders or bank balances.
                Whether you're an African student heading overseas or a young professional abroad looking to upskill, 
                we connect you to trusted financing options, microloans, and sponsor networks — so you can focus on your future.
              </p>
            </div>
          </div>
        </section>

        <LoanMatcher />
        
        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-20 px-6 md:px-12 bg-background">
          <div className="max-w-6xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
                How TechScale Works
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Get matched with the perfect financing for your future in three simple steps
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

        {/* Our Financing Options Section */}
        <section className="w-full py-20 px-6 md:px-12 bg-muted/30">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
                Our Financing Options
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Multiple pathways to fund your education and career growth
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">Study Abroad Loans</h3>
                  <p className="text-muted-foreground">
                    Co-signer-free options from trusted global lenders for international education.
                  </p>
                </div>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">Career Microloans (SkillCredit)</h3>
                  <p className="text-muted-foreground">
                    £500–£7,500 for upskilling, certifications, and professional development.
                  </p>
                </div>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">Sponsor Match</h3>
                  <p className="text-muted-foreground">
                    Connect with diaspora donors, alumni, and NGOs for grants or partial funding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="w-full py-20 px-6 md:px-12 bg-background">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
              Why Choose TechScale
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">✓</span>
                </div>
                <h3 className="text-lg font-medium">Built into the TechSkill UK learning ecosystem</h3>
              </div>
              
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">✓</span>
                </div>
                <h3 className="text-lg font-medium">Partners with trusted global and local lenders</h3>
              </div>
              
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">✓</span>
                </div>
                <h3 className="text-lg font-medium">Transparent terms — no hidden fees</h3>
              </div>
              
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">✓</span>
                </div>
                <h3 className="text-lg font-medium">Real stories from real students and professionals we've helped</h3>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section id="success-stories" className="w-full py-20 px-6 md:px-12 bg-muted/30">
          <div className="max-w-6xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
                Real Stories, Real Impact
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                From Africa to the world — see how TechScale is helping dreams become reality
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-lg shadow-sm">
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
                    "TechScale helped me secure £45,000 for my Computer Science PhD at MIT without a co-signer. The process was seamless and I got approved within weeks!"
                  </p>
                </div>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-sm">
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
              
              <div className="bg-background p-6 rounded-lg shadow-sm">
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
                    "TechScale's SkillCredit helped me get £3,500 for AWS certifications. Now I'm earning 40% more as a cloud architect!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="w-full py-20 px-6 md:px-12 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-medium tracking-tighter">
              Your future starts here.
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Don't let funding hold you back — take the first step today.
            </p>
            <button 
              onClick={() => {
                const matcherElement = document.getElementById('loan-matcher');
                if (matcherElement) {
                  matcherElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-background text-foreground hover:bg-background/90 text-base h-12 px-8 rounded-md font-medium transition-colors"
            >
              Start My Application →
            </button>
            
            <div className="pt-8 text-center">
              <p className="text-primary-foreground/60 text-sm font-medium">
                Secure • Transparent • Impact-Driven
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TechScale;
