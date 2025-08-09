import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import TaskBoard from './TaskBoard';
import { Loader } from 'lucide-react';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full py-8 sm:py-12 md:py-20 px-4 sm:px-6 md:px-12 flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Cosmic particle effect (background dots) */}
      <div className="absolute inset-0 cosmic-grid opacity-30"></div>
      
      {/* Gradient glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] rounded-full">
        <div className="w-full h-full opacity-10 bg-primary blur-[80px] sm:blur-[100px] md:blur-[120px]"></div>
      </div>
      
      <div className={`relative z-10 max-w-4xl text-center space-y-4 sm:space-y-6 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full bg-muted text-primary">
            <span className="flex h-2 w-2 rounded-full bg-primary"></span>
            <span className="hidden sm:inline">Launching new payment features</span>
            <span className="sm:hidden">New features</span>
            <Loader className="h-3 w-3 animate-spin text-primary" />
          </span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-medium tracking-tighter text-balance text-foreground leading-tight">
          Financial operations for <span className="text-foreground">growth</span> businesses
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance px-4">
          Streamline your financial workflows with our comprehensive fintech platform. Built for modern businesses who value efficiency, compliance, and scalable growth.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-6 items-center px-4">
          <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground text-base h-12 px-6 sm:px-8 transition-all duration-200 min-h-[48px]">
            Start for free
          </Button>
          <Button variant="outline" className="w-full sm:w-auto border-border text-foreground hover:bg-accent hover:text-accent-foreground text-base h-12 px-6 sm:px-8 transition-all duration-200 min-h-[48px]">
            Book a demo
          </Button>
        </div>
        
        <div className="pt-4 sm:pt-6 text-sm text-muted-foreground">
          No credit card required • Free 14-day trial
        </div>
      </div>
      
      {/* Task Manager UI integrated in hero section with glassmorphic effect */}
      <div className={`w-full max-w-7xl mt-8 sm:mt-12 z-10 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
        <div className="cosmic-glow relative rounded-xl overflow-hidden border border-border backdrop-blur-sm bg-card shadow-lg">
          {/* Dashboard Header */}
          <div className="bg-card backdrop-blur-md w-full">
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                  <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-sm bg-foreground"></div>
                </div>
                <span className="text-foreground font-medium text-sm sm:text-base truncate">Payment Processing Pipeline</span>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <div className="hidden sm:flex -space-x-2">
                  <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-muted border-2 border-card"></div>
                  <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-muted/80 border-2 border-card"></div>
                  <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-muted/60 border-2 border-card"></div>
                  <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-muted/40 border-2 border-card flex items-center justify-center text-xs text-foreground">+3</div>
                </div>
                
                <div className="h-6 sm:h-8 px-2 sm:px-3 rounded-md bg-muted flex items-center justify-center text-foreground text-xs sm:text-sm">
                  Share
                </div>
              </div>
            </div>
            
            {/* Dashboard Content */}
            <div className="flex h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden">
              {/* Sidebar */}
              <div className="hidden md:block w-48 lg:w-64 border-r border-border p-4 space-y-4 bg-card">
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground uppercase">Navigation</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-muted text-foreground">
                      <div className="h-3 w-3 rounded-sm bg-foreground"></div>
                      <span>Payments</span>
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/50">
                      <div className="h-3 w-3 rounded-sm bg-muted-foreground/30"></div>
                      <span>Analytics</span>
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/50">
                      <div className="h-3 w-3 rounded-sm bg-muted-foreground/30"></div>
                      <span>Compliance</span>
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/50">
                      <div className="h-3 w-3 rounded-sm bg-muted-foreground/30"></div>
                      <span>Reports</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 pt-4">
                  <div className="text-xs text-muted-foreground uppercase">Departments</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/50">
                      <div className="h-3 w-3 rounded-full bg-muted-foreground/60"></div>
                      <span>Treasury</span>
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/50">
                      <div className="h-3 w-3 rounded-full bg-muted-foreground/50"></div>
                      <span>Risk</span>
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/50">
                      <div className="h-3 w-3 rounded-full bg-muted-foreground/40"></div>
                      <span>Operations</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="flex-1 p-3 sm:p-4 bg-background overflow-hidden">
                {/* Board Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6 min-w-0">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <h3 className="font-medium text-foreground text-sm sm:text-base">Transactions</h3>
                    <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">23</span>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                      <svg width="14" height="14" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M12 9L12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="hidden sm:flex h-8 w-8 rounded-md bg-muted items-center justify-center text-muted-foreground">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 9L17 17H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M17 17L7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="h-6 sm:h-8 px-2 sm:px-3 rounded-md bg-foreground text-background flex items-center justify-center text-xs sm:text-sm font-medium whitespace-nowrap">
                      <span className="hidden sm:inline">New Transaction</span>
                      <span className="sm:hidden">New</span>
                    </div>
                  </div>
                </div>
                
                {/* Kanban Board */}
                <div className="overflow-hidden h-full">
                  <TaskBoard />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
