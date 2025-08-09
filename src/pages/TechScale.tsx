
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
        <LoanMatcher />
        
        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-20 px-6 md:px-12 bg-background">
          <div className="max-w-6xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
                How TechScale Works
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Get matched with the perfect loan for your education journey in three simple steps
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto">
                  1
                </div>
                <h3 className="text-xl font-medium">Tell Us Your Goals</h3>
                <p className="text-muted-foreground">
                  Share your education destination, field of study, and financial situation through our simple intake form.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto">
                  2
                </div>
                <h3 className="text-xl font-medium">Get Matched</h3>
                <p className="text-muted-foreground">
                  Our smart algorithm analyzes your profile and matches you with the best loan options from trusted lenders.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto">
                  3
                </div>
                <h3 className="text-xl font-medium">Apply & Study</h3>
                <p className="text-muted-foreground">
                  Apply directly to your chosen lenders and get one step closer to achieving your education dreams.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section id="success-stories" className="w-full py-20 px-6 md:px-12 bg-muted/30">
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
                    "TechScale helped me find the perfect loan for my Computer Science PhD at MIT. The process was seamless and I got approved within weeks!"
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
                    "TechScale not only found me financing but also helped improve my credit readiness. Now I'm pursuing my dream in Data Science!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TechScale;
