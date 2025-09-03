import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import TechScaleLogo from '@/components/techscale/TechScaleLogo';
import ApplicationDetailView from '@/components/applications/ApplicationDetailView';

const ApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

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

  if (!id) {
    navigate('/my-applications', { replace: true });
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
              <h1 className="text-xl font-medium text-foreground hidden md:block">Application Details</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <Link to="/my-applications">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Back to Applications</span>
                  <span className="sm:hidden">Back</span>
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Mobile title */}
          <h1 className="text-lg font-medium text-foreground md:hidden mt-2">Application Details</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <ApplicationDetailView applicationId={id} />
      </main>
    </div>
  );
};

export default ApplicationDetail;