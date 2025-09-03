import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, FileText, Clock, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { FullLoanApplication } from '@/types/loanApplication';
import ApplicationCard from './ApplicationCard';

interface ApplicationStats {
  total: number;
  pending: number;
  underReview: number;
  approved: number;
  rejected: number;
  draft: number;
}

const ApplicationDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<FullLoanApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<FullLoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');

  const [stats, setStats] = useState<ApplicationStats>({
    total: 0,
    pending: 0,
    underReview: 0,
    approved: 0,
    rejected: 0,
    draft: 0
  });

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  useEffect(() => {
    filterApplications();
  }, [applications, searchQuery, statusFilter, activeTab]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const typedApplications: FullLoanApplication[] = (data || []).map(app => ({
        ...app,
        isDraft: app.is_draft || false,
        completedSteps: Array.isArray(app.completed_steps) ? app.completed_steps as string[] : [],
        loanTypeRequest: app.loan_type_requested ? {
          type: app.loan_type_requested as any,
          amount: '',
          purpose: '',
          repaymentPreference: ''
        } : {
          type: 'study-abroad' as any,
          amount: '',
          purpose: '',
          repaymentPreference: ''
        },
        personalInfo: (typeof app.personal_info === 'object' && app.personal_info !== null) ? app.personal_info as any : {},
        kycDocuments: (typeof app.kyc_documents === 'object' && app.kyc_documents !== null) ? app.kyc_documents as any : {},
        educationCareer: (typeof app.education_career === 'object' && app.education_career !== null) ? app.education_career as any : {},
        professionalEmployment: (typeof app.professional_employment === 'object' && app.professional_employment !== null) ? app.professional_employment as any : {},
        programInfo: (typeof app.program_info === 'object' && app.program_info !== null) ? app.program_info as any : {},
        financialInfo: (typeof app.financial_info === 'object' && app.financial_info !== null) ? app.financial_info as any : {},
        declarations: (typeof app.declarations === 'object' && app.declarations !== null) ? app.declarations as any : {},
        loanOptionId: app.loan_option_id || '',
        lenderName: app.lender_name || '',
        status: app.status as any
      }));

      setApplications(typedApplications);

      // Calculate stats
      const newStats: ApplicationStats = {
        total: typedApplications.length,
        pending: typedApplications.filter(app => app.status === 'submitted').length,
        underReview: typedApplications.filter(app => app.status === 'under-review').length,
        approved: typedApplications.filter(app => app.status === 'approved').length,
        rejected: typedApplications.filter(app => app.status === 'rejected').length,
        draft: typedApplications.filter(app => app.status === 'draft').length
      };
      setStats(newStats);

    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(app => 
        app.lenderName.toLowerCase().includes(query) ||
        app.loanOptionId.toLowerCase().includes(query) ||
        (app.personalInfo as any)?.firstName?.toLowerCase().includes(query) ||
        (app.personalInfo as any)?.lastName?.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Filter by active tab
    if (activeTab !== 'all') {
      if (activeTab === 'active') {
        filtered = filtered.filter(app => ['submitted', 'under-review'].includes(app.status));
      } else if (activeTab === 'completed') {
        filtered = filtered.filter(app => ['approved', 'rejected'].includes(app.status));
      } else if (activeTab === 'drafts') {
        filtered = filtered.filter(app => app.status === 'draft');
      }
    }

    setFilteredApplications(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <FileText className="h-4 w-4" />;
      case 'submitted':
        return <Clock className="h-4 w-4" />;
      case 'under-review':
        return <AlertCircle className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'secondary';
      case 'submitted':
        return 'default';
      case 'under-review':
        return 'outline';
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded w-1/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
          <FileText className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-medium mb-2">No Applications Yet</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          You haven't started any loan applications yet. Get started by using our loan matcher to find the best options for you.
        </p>
        <Button asChild>
          <Link to="/#loan-matcher">
            <Plus className="h-4 w-4 mr-2" />
            Start Your First Application
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="text-2xl font-bold">{stats.underReview + stats.pending}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold">{stats.approved}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">{stats.draft}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="under-review">Under Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Application Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="active">Active ({stats.pending + stats.underReview})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({stats.approved + stats.rejected})</TabsTrigger>
          <TabsTrigger value="drafts">Drafts ({stats.draft})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No applications found matching your filters.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
              {filteredApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onRefresh={fetchApplications}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApplicationDashboard;