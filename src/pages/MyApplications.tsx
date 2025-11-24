import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ApplicationDashboard from '@/components/applications/ApplicationDashboard';
import TechScaleLogo from '@/components/techscale/TechScaleLogo';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { useNotifications } from '@/hooks/useNotifications';

const MyApplications = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const [activeTab, setActiveTab] = useState("applications");

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
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Link to="/" className="flex items-center flex-shrink-0">
                <TechScaleLogo />
              </Link>
              <div className="hidden md:block w-px h-6 bg-border flex-shrink-0" />
              <h1 className="text-base sm:text-lg md:text-xl font-medium text-foreground hidden md:block truncate">My Applications</h1>
            </div>
            
            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="hidden sm:flex text-xs sm:text-sm"
              >
                <Link to="/apply">
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">New Application</span>
                </Link>
              </Button>
              
              {/* Notification Bell */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("notifications")}
                  className={`relative h-8 w-8 sm:h-9 sm:w-9 p-0 ${activeTab === "notifications" ? "bg-muted" : ""}`}
                >
                  <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 p-0 text-[10px] sm:text-xs flex items-center justify-center"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
              >
                <Link to="/">
                  <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Back to Home</span>
                  <span className="sm:hidden sr-only">Home</span>
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Mobile title */}
          <h1 className="text-base sm:text-lg font-medium text-foreground md:hidden mt-2 truncate">My Applications</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 h-9 sm:h-10">
            <TabsTrigger value="applications" className="text-xs sm:text-sm">Applications</TabsTrigger>
            <TabsTrigger value="notifications" className="relative text-xs sm:text-sm">
              <span className="hidden sm:inline">Notifications</span>
              <span className="sm:hidden">Alerts</span>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-1 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 p-0 text-[10px] sm:text-xs">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="applications">
            <ApplicationDashboard />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationCenter />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MyApplications;