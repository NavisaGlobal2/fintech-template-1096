import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import ApplicationDashboard from '@/components/applications/ApplicationDashboard';
import TechScaleLogo from '@/components/techscale/TechScaleLogo';
import { useUserRoles } from '@/hooks/useUserRoles';

const MyApplications = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { isAuthorizedForUnderwriting } = useUserRoles();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    navigate('/', { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center">
                <TechScaleLogo />
              </Link>
              <div className="hidden md:block w-px h-6 bg-border" />
              <h1 className="text-xl font-medium text-foreground hidden md:block">My Applications</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="hidden sm:flex"
              >
                <Link to="/#loan-matcher">
                  <Plus className="h-4 w-4 mr-2" />
                  New Application
                </Link>
              </Button>
              
              {isAuthorizedForUnderwriting && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/?view=underwriting')}
                  className="text-muted-foreground"
                >
                  Admin Dashboard
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Back to Home</span>
                  <span className="sm:hidden">Home</span>
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Mobile title */}
          <h1 className="text-lg font-medium text-foreground md:hidden mt-2">My Applications</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <ApplicationDashboard />
      </main>
    </div>
  );
};

export default MyApplications;