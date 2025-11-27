import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TechScaleLogo from '@/components/techscale/TechScaleLogo';
import { 
  Smartphone, 
  Download, 
  CheckCircle2, 
  Chrome,
  Apple,
  Monitor,
  Wifi,
  Bell,
  Zap,
  Home
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for the beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const features = [
    {
      icon: Wifi,
      title: 'Works Offline',
      description: 'Access your applications even without internet connection'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Instant loading with optimized performance'
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Stay updated on your application status'
    },
    {
      icon: Smartphone,
      title: 'Native Feel',
      description: 'Experience app-like navigation and interactions'
    }
  ];

  const installInstructions = [
    {
      platform: 'iOS (iPhone/iPad)',
      icon: Apple,
      steps: [
        'Open this page in Safari',
        'Tap the Share button (square with arrow)',
        'Scroll down and tap "Add to Home Screen"',
        'Tap "Add" in the top right corner'
      ]
    },
    {
      platform: 'Android (Chrome)',
      icon: Chrome,
      steps: [
        'Open this page in Chrome',
        'Tap the menu (three dots) in top right',
        'Tap "Install app" or "Add to Home screen"',
        'Follow the on-screen prompts'
      ]
    },
    {
      platform: 'Desktop (Chrome)',
      icon: Monitor,
      steps: [
        'Click the install icon in the address bar',
        'Or go to menu (three dots) → "Install TechSkill Accelerate"',
        'Click "Install" in the popup',
        'The app will open in its own window'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <div className="w-full px-6 py-6 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/">
            <TechScaleLogo />
          </Link>
          <Button variant="ghost" asChild>
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          {isInstalled ? (
            <>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                App Already Installed! 🎉
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                You're all set! TechSkill Accelerate is installed on your device.
              </p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Smartphone className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                Install TechSkill Accelerate
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                Get instant access to your loan applications right from your home screen. 
                No app store needed!
              </p>

              {isInstallable && (
                <Button 
                  size="lg" 
                  onClick={handleInstallClick}
                  className="text-lg px-8 py-6 animate-scale-in"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Install Now
                </Button>
              )}
            </>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="p-6 animate-fade-in hover:shadow-lg transition-all"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Installation Instructions */}
        {!isInstalled && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                How to Install
              </h2>
              <p className="text-muted-foreground">
                Choose your device type below for step-by-step instructions
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {installInstructions.map((instruction, index) => (
                <Card 
                  key={instruction.platform}
                  className="p-6 animate-fade-in"
                  style={{ animationDelay: `${(index + 4) * 0.1}s` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <instruction.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{instruction.platform}</h3>
                  </div>
                  <ol className="space-y-3">
                    {instruction.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex gap-3 text-sm text-muted-foreground">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium">
                          {stepIndex + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        {isInstalled && (
          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link to="/">
                Open App
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Install;
