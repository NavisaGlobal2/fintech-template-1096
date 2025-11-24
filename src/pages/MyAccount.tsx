import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Mail, Phone, User as UserIcon, Calendar, TrendingUp, Clock, CheckCircle2, XCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import TechScaleLogo from '@/components/techscale/TechScaleLogo';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import ProfileCompletionChecklist from '@/components/ProfileCompletionChecklist';
import ProfileEditDialog from '@/components/ProfileEditDialog';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AccountSidebar } from '@/components/AccountSidebar';
import { Progress } from '@/components/ui/progress';

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
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editProfileFocusField, setEditProfileFocusField] = useState<'first_name' | 'last_name' | 'phone' | undefined>(undefined);
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setProfile(profileData);

        const { data: applicationsData } = await supabase
          .from('loan_applications')
          .select('id, lender_name, status, created_at, loan_type_requested')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(6);

        setRecentApplications(applicationsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [user]);

  const handleOpenEditProfile = (focusField?: 'first_name' | 'last_name' | 'phone') => {
    setEditProfileFocusField(focusField);
    setShowEditProfile(true);
  };

  const handleProfileUpdated = async () => {
    if (!user) return;
    
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      setProfile(profileData);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

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

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      'submitted': <Clock className="h-4 w-4" />,
      'under-review': <AlertCircle className="h-4 w-4" />,
      'approved': <CheckCircle2 className="h-4 w-4" />,
      'rejected': <XCircle className="h-4 w-4" />,
    };
    return icons[status] || <Clock className="h-4 w-4" />;
  };

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

  const profileCompletion = () => {
    let completed = 0;
    let total = 4;
    
    if (profile?.first_name && profile?.last_name) completed++;
    if (profile?.phone) completed++;
    if (user.email) completed++;
    if (recentApplications.length > 0) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const renderDashboard = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Card with Gradient */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <CardContent className="relative p-8">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">
                  Welcome back, {profile?.first_name || 'there'}!
                </h2>
              </div>
              <p className="text-muted-foreground">Here's your application overview and account status</p>
            </div>
            <Button asChild className="shadow-lg">
              <Link to="/apply">
                <Plus className="h-4 w-4 mr-2" />
                New Application
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Applications - Featured Card */}
        <Card className="relative overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg hover:-translate-y-1 duration-300 bg-gradient-to-br from-primary/5 to-background">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Applications</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                    {recentApplications.length}
                  </p>
                  <span className="text-xs text-muted-foreground">all time</span>
                </div>
              </div>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
            </div>
            
            {/* Mini breakdown */}
            <div className="flex gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-muted-foreground">
                  {recentApplications.filter(app => app.status === 'approved').length} approved
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-muted-foreground">
                  {recentApplications.filter(app => app.status === 'under-review').length} pending
                </span>
              </div>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-primary" />
        </Card>

        {/* Approved Applications */}
        <Card className="relative overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border border-green-500/20 bg-gradient-to-br from-green-500/5 to-background">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Approved</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-green-500">
                    {recentApplications.filter(app => app.status === 'approved').length}
                  </p>
                  {recentApplications.filter(app => app.status === 'approved').length > 0 && (
                    <span className="text-xs text-green-500/70 font-medium">active</span>
                  )}
                </div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-green-600">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="font-medium">Ready to proceed</span>
            </div>
          </CardContent>
        </Card>

        {/* Under Review Applications */}
        <Card className="relative overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-background">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Under Review</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-amber-500">
                    {recentApplications.filter(app => app.status === 'under-review').length}
                  </p>
                  {recentApplications.filter(app => app.status === 'under-review').length > 0 && (
                    <span className="text-xs text-amber-500/70 font-medium">in progress</span>
                  )}
                </div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-amber-600">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="font-medium">Processing application</span>
            </div>
          </CardContent>
        </Card>

        {/* Profile Completion */}
        <Card className="relative overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Profile</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-primary">{profileCompletion()}%</p>
                  <span className="text-xs text-muted-foreground">complete</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-primary" />
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-1.5">
              <Progress value={profileCompletion()} className="h-1.5" />
              <p className="text-xs text-muted-foreground">
                {profileCompletion() === 100 ? 'All set!' : 'Complete your profile'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Completion */}
      <ProfileCompletionChecklist
        profile={profile}
        hasApplications={recentApplications.length > 0}
        onEditProfile={handleOpenEditProfile}
        onCreateApplication={() => navigate('/apply')}
      />
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Applications</h2>
          <p className="text-muted-foreground">Track and manage your loan applications</p>
        </div>
              <Button asChild>
                <Link to="/apply">
                  <Plus className="h-4 w-4 mr-2" />
                  New Application
                </Link>
              </Button>
      </div>

      {loadingData ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : recentApplications.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <TrendingUp className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No applications yet</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-sm">
              Start your journey by creating your first loan application
            </p>
            <Button asChild size="lg">
              <Link to="/apply">
                <Plus className="h-4 w-4 mr-2" />
                Start Your First Application
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentApplications.map((app, index) => (
            <Card 
              key={app.id} 
              className="hover-scale border-2 hover:shadow-lg transition-all group relative overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                        {app.lender_name}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {app.loan_type_requested || 'Loan Application'}
                    </p>
                  </div>
                  <Badge variant="outline" className={`${getStatusColor(app.status)} flex items-center gap-1`}>
                    {getStatusIcon(app.status)}
                    {app.status.replace('-', ' ')}
                  </Badge>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Applied {format(new Date(app.created_at), 'MMM dd, yyyy')}</span>
                  </div>
                  <Button variant="ghost" size="sm" asChild className="group-hover:bg-primary/10">
                    <Link to={`/application/${app.id}`}>
                      View Details →
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Profile Settings</h2>
        <p className="text-muted-foreground">Manage your personal information</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-2xl font-bold">
              {profile?.first_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">
                {profile?.first_name && profile?.last_name
                  ? `${profile.first_name} ${profile.last_name}`
                  : 'Complete your profile'}
              </CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <Progress value={profileCompletion()} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-1">{profileCompletion()}% complete</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator />
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <UserIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Full Name</p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.first_name && profile?.last_name
                      ? `${profile.first_name} ${profile.last_name}`
                      : 'Not set'}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleOpenEditProfile('first_name')}>
                Edit
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email Address</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-500">Verified</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone Number</p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.phone || 'Not set'}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleOpenEditProfile('phone')}>
                {profile?.phone ? 'Edit' : 'Add'}
              </Button>
            </div>
          </div>

          <Separator />

          <Button variant="outline" className="w-full" onClick={() => handleOpenEditProfile()}>
            Edit Full Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AccountSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <Link to="/" className="flex items-center">
                  <TechScaleLogo />
                </Link>
                <div className="hidden md:block w-px h-6 bg-border ml-2" />
                <h1 className="text-xl font-semibold text-foreground hidden md:block">My Account</h1>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 container mx-auto px-6 py-8">
            {activeSection === 'dashboard' && renderDashboard()}
            {activeSection === 'applications' && renderApplications()}
            {activeSection === 'profile' && renderProfile()}
            {activeSection === 'notifications' && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Notifications section coming soon</p>
              </div>
            )}
            {activeSection === 'settings' && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Settings section coming soon</p>
              </div>
            )}
          </main>
        </div>
      </div>

      <ProfileEditDialog
        open={showEditProfile}
        onOpenChange={setShowEditProfile}
        profile={profile}
        userId={user.id}
        onProfileUpdated={handleProfileUpdated}
        focusField={editProfileFocusField}
      />
    </SidebarProvider>
  );
};

export default MyAccount;
