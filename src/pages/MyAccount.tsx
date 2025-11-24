import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Bell, Settings, FileText, Mail, Phone, User as UserIcon, Calendar, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import TechScaleLogo from '@/components/techscale/TechScaleLogo';
import { useNotifications } from '@/hooks/useNotifications';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Application {
  id: string;
  lender_name: string;
  status: string;
  created_at: string;
  loan_type_requested: string;
}

interface Profile {
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string | null;
}

const MyAccount = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setProfile(profileData);

        // Fetch recent 3 applications
        const { data: applicationsData } = await supabase
          .from('loan_applications')
          .select('id, lender_name, status, created_at, loan_type_requested')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);

        setRecentApplications(applicationsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [user]);

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

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'submitted': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      'under-review': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      'approved': 'bg-green-500/10 text-green-500 border-green-500/20',
      'rejected': 'bg-red-500/10 text-red-500 border-red-500/20',
      'pending': 'bg-muted text-muted-foreground border-border',
    };
    return statusMap[status] || statusMap['pending'];
  };

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
              <h1 className="text-xl font-medium text-foreground hidden md:block">My Account</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Back to Home</span>
                  <span className="sm:hidden">Home</span>
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Mobile title */}
          <h1 className="text-lg font-medium text-foreground md:hidden mt-2">My Account</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile & Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {profile?.first_name && profile?.last_name
                        ? `${profile.first_name} ${profile.last_name}`
                        : 'Your Profile'}
                    </CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile?.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <Separator className="my-3" />
                <Button variant="outline" size="sm" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link to="/#loan-matcher">
                    <Plus className="h-4 w-4 mr-2" />
                    New Application
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="ml-auto h-5 w-5 p-0 text-xs flex items-center justify-center">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link to="/">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Browse Lenders
                  </Link>
                </Button>
                <Separator className="my-3" />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={signOut}
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Settings</CardTitle>
                <CardDescription>Manage your preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Email Notifications</span>
                  <Badge variant="outline" className="text-xs">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">SMS Alerts</span>
                  <Badge variant="outline" className="text-xs">Disabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Marketing Emails</span>
                  <Badge variant="outline" className="text-xs">Enabled</Badge>
                </div>
                <Separator className="my-3" />
                <Button variant="outline" size="sm" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Preferences
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Recent Applications */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Applications</CardTitle>
                    <CardDescription>Your last 3 loan applications</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/#loan-matcher">
                      <Plus className="h-4 w-4 mr-2" />
                      New
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loadingData ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : recentApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No applications yet</p>
                    <Button asChild>
                      <Link to="/#loan-matcher">
                        <Plus className="h-4 w-4 mr-2" />
                        Start Your First Application
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentApplications.map((app) => (
                      <Card key={app.id} className="border-2">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-foreground">{app.lender_name}</h3>
                                <Badge variant="outline" className={getStatusColor(app.status)}>
                                  {app.status.replace('-', ' ')}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {app.loan_type_requested || 'Loan Application'}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>Applied {format(new Date(app.created_at), 'MMM dd, yyyy')}</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/application/${app.id}`}>
                                View Details
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Activity Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {recentApplications.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Applications</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-500 mb-1">
                    {recentApplications.filter(app => app.status === 'approved').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Approved</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-amber-500 mb-1">
                    {recentApplications.filter(app => app.status === 'under-review').length}
                  </div>
                  <div className="text-sm text-muted-foreground">In Review</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyAccount;
