import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TechScaleLogo from '@/components/techscale/TechScaleLogo';
import { 
  Home, 
  FileText, 
  User, 
  Search, 
  ArrowLeft, 
  HelpCircle,
  Mail
} from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      '404 Error: User attempted to access non-existent route:',
      location.pathname
    );
  }, [location.pathname]);

  const quickLinks = [
    {
      title: 'Home',
      description: 'Back to our homepage',
      icon: Home,
      href: '/',
      variant: 'default' as const,
    },
    {
      title: 'Apply Now',
      description: 'Start your application',
      icon: FileText,
      href: '/apply',
      variant: 'outline' as const,
    },
    {
      title: 'My Account',
      description: 'View your dashboard',
      icon: User,
      href: '/my-account',
      variant: 'outline' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col">
      {/* Header with Logo */}
      <div className="w-full px-6 py-6 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <Link to="/">
            <TechScaleLogo />
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            {/* 404 Number */}
            <div className="mb-6">
              <h1 className="text-[120px] md:text-[180px] font-bold leading-none bg-gradient-to-br from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                404
              </h1>
            </div>

            {/* Error Message */}
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
              Page Not Found
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-md mx-auto mb-2">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-mono bg-muted px-2 py-1 rounded">
                {location.pathname}
              </span>
            </p>
          </div>

          {/* Quick Links Grid */}
          <div className="grid md:grid-cols-3 gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {quickLinks.map((link) => (
              <Link key={link.href} to={link.href}>
                <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/50 group h-full">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <link.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {link.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Additional Help Section */}
          <Card className="p-6 bg-muted/50 border-border animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Need Help?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Can't find what you're looking for? Our support team is here to help.
                  </p>
                </div>
              </div>
              <Button variant="outline" className="flex items-center gap-2 flex-shrink-0" asChild>
                <a href="mailto:support@techskilluk.com">
                  <Mail className="h-4 w-4" />
                  Contact Support
                </a>
              </Button>
            </div>
          </Card>

          {/* Back Button */}
          <div className="flex justify-center mt-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full px-6 py-6 border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 Tech Skill UK. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
