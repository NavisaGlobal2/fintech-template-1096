import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Edit,
  Download,
  Upload,
  Calendar,
  Building,
  DollarSign,
  User,
  GraduationCap,
  Briefcase,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Save,
  ArrowLeft,
  Trash2,
  Copy,
  Archive,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { FullLoanApplication } from '@/types/loanApplication';
import { formatDistanceToNow, format } from 'date-fns';
import ApplicationTimeline from './ApplicationTimeline';
import PersonalInfoEditor from './editors/PersonalInfoEditor';
import FinancialInfoEditor from './editors/FinancialInfoEditor';
import DocumentManager from './DocumentManager';
import StatusManager from './StatusManager';
import LoanRequestSummary from './LoanRequestSummary';
import RelatedOffers from './RelatedOffers';

interface ApplicationDetailViewProps {
  applicationId: string;
}

const ApplicationDetailView: React.FC<ApplicationDetailViewProps> = ({ applicationId }) => {
  const { user } = useAuth();
  const [application, setApplication] = useState<FullLoanApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user && applicationId) {
      fetchApplication();
    }
  }, [user, applicationId]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('id', applicationId)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      const typedApplication: FullLoanApplication = {
        ...data,
        isDraft: data.is_draft || false,
        completedSteps: Array.isArray(data.completed_steps) ? data.completed_steps as string[] : [],
        loanTypeRequest: data.loan_type_requested ? {
          type: data.loan_type_requested as any,
          amount: '',
          purpose: '',
          repaymentPreference: ''
        } : {
          type: 'study-abroad' as any,
          amount: '',
          purpose: '',
          repaymentPreference: ''
        },
        personalInfo: (typeof data.personal_info === 'object' && data.personal_info !== null) ? data.personal_info as any : {},
        kycDocuments: (typeof data.kyc_documents === 'object' && data.kyc_documents !== null) ? data.kyc_documents as any : {},
        educationCareer: (typeof data.education_career === 'object' && data.education_career !== null) ? data.education_career as any : {},
        professionalEmployment: (typeof data.professional_employment === 'object' && data.professional_employment !== null) ? data.professional_employment as any : {},
        programInfo: (typeof data.program_info === 'object' && data.program_info !== null) ? data.program_info as any : {},
        financialInfo: (typeof data.financial_info === 'object' && data.financial_info !== null) ? data.financial_info as any : {},
        declarations: (typeof data.declarations === 'object' && data.declarations !== null) ? data.declarations as any : {},
        loanOptionId: data.loan_option_id || '',
        lenderName: data.lender_name || '',
        status: data.status as any
      };

      setApplication(typedApplication);
    } catch (error) {
      console.error('Error fetching application:', error);
      toast.error('Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <FileText className="h-5 w-5" />;
      case 'submitted':
        return <Clock className="h-5 w-5" />;
      case 'under-review':
        return <AlertCircle className="h-5 w-5" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5" />;
      case 'rejected':
        return <XCircle className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getStatusVariant = (status: string) => {
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Draft';
      case 'submitted':
        return 'Submitted';
      case 'under-review':
        return 'Under Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  const getLoanTypeDisplay = (type: string) => {
    switch (type) {
      case 'study-abroad':
        return 'Study Abroad Loan';
      case 'career-microloan':
        return 'Career Microloan';
      case 'sponsor-match':
        return 'Sponsor Match';
      default:
        return type;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'PPP');
    } catch {
      return 'N/A';
    }
  };

  const formatDateRelative = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'N/A';
    }
  };

  const canEdit = () => {
    return application?.status === 'draft' || application?.status === 'submitted';
  };

  const getCompletionPercentage = () => {
    if (!application) return 0;
    const sections = ['personalInfo', 'kycDocuments', 'financialInfo', 'declarations'];
    const completed = sections.filter(section => {
      const data = application[section as keyof FullLoanApplication] as any;
      return data && Object.keys(data).length > 0;
    }).length;
    return Math.round((completed / sections.length) * 100);
  };

  const updateApplication = async (updates: Partial<FullLoanApplication>) => {
    if (!application) return;

    try {
      const { error } = await supabase
        .from('loan_applications')
        .update({
          personal_info: updates.personalInfo || application.personalInfo as any,
          financial_info: updates.financialInfo || application.financialInfo as any,
          kyc_documents: updates.kycDocuments || application.kycDocuments as any,
          declarations: updates.declarations || application.declarations as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', application.id);

      if (error) throw error;

      setApplication({ ...application, ...updates });
      setHasChanges(false);
      toast.success('Application updated successfully');
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application');
    }
  };

  const duplicateApplication = async () => {
    if (!application) return;

    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .insert({
          user_id: user?.id!,
          lender_name: application.lenderName,
          loan_option_id: `${application.loanOptionId}-copy`,
          personal_info: application.personalInfo as any,
          kyc_documents: {} as any,
          financial_info: application.financialInfo as any,
          status: 'draft',
          is_draft: true
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Application duplicated successfully');
      window.location.href = `/application/${data.id}`;
    } catch (error) {
      console.error('Error duplicating application:', error);
      toast.error('Failed to duplicate application');
    }
  };

  const archiveApplication = async () => {
    if (!application) return;

    try {
      const { error } = await supabase
        .from('loan_applications')
        .update({ status: 'archived' })
        .eq('id', application.id);

      if (error) throw error;

      setApplication({ ...application, status: 'archived' as any });
      toast.success('Application archived successfully');
    } catch (error) {
      console.error('Error archiving application:', error);
      toast.error('Failed to archive application');
    }
  };

  const renderPersonalInfo = () => {
    const personalInfo = application?.personalInfo as any;
    
    if (editingSection === 'personal') {
      return (
        <PersonalInfoEditor
          data={personalInfo}
          onSave={(data) => {
            updateApplication({ personalInfo: data });
            setEditingSection(null);
          }}
          onCancel={() => setEditingSection(null)}
        />
      );
    }

    if (!personalInfo || Object.keys(personalInfo).length === 0) {
      return (
        <div className="flex flex-col items-center py-8 text-center">
          <User className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No personal information provided yet.</p>
          {canEdit() && (
            <Button variant="outline" onClick={() => setEditingSection('personal')}>
              <Edit className="h-4 w-4 mr-2" />
              Add Personal Info
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold">Personal Details</h4>
          {canEdit() && (
            <Button variant="ghost" size="sm" onClick={() => setEditingSection('personal')}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{personalInfo.firstName} {personalInfo.lastName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{personalInfo.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{personalInfo.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <MapPin className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <div className="font-medium">
                  {personalInfo.address?.street && <p>{personalInfo.address.street}</p>}
                  {personalInfo.address?.city && <p>{personalInfo.address.city}</p>}
                  {personalInfo.address?.country && <p>{personalInfo.address.country}</p>}
                  {!personalInfo.address?.street && !personalInfo.address?.city && (
                    <p>Not provided</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{personalInfo.dateOfBirth || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFinancialInfo = () => {
    const financialInfo = application?.financialInfo as any;
    
    if (editingSection === 'financial') {
      return (
        <FinancialInfoEditor
          data={financialInfo}
          onSave={(data) => {
            updateApplication({ financialInfo: data });
            setEditingSection(null);
          }}
          onCancel={() => setEditingSection(null)}
        />
      );
    }

    if (!financialInfo || Object.keys(financialInfo).length === 0) {
      return (
        <div className="flex flex-col items-center py-8 text-center">
          <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No financial information provided yet.</p>
          {canEdit() && (
            <Button variant="outline" onClick={() => setEditingSection('financial')}>
              <Edit className="h-4 w-4 mr-2" />
              Add Financial Info
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold">Financial Information</h4>
          {canEdit() && (
            <Button variant="ghost" size="sm" onClick={() => setEditingSection('financial')}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-2">Household Income</p>
              <p className="text-xl font-semibold text-primary">
                {financialInfo.householdIncome ? `$${financialInfo.householdIncome}` : 'Not provided'}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-2">Dependents</p>
              <p className="text-lg font-medium">
                {financialInfo.dependents !== undefined ? financialInfo.dependents : 'Not provided'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-2">Bank Account</p>
              <div className="font-medium">
                {financialInfo.bankAccount?.bankName && (
                  <p>{financialInfo.bankAccount.bankName}</p>
                )}
                {financialInfo.bankAccount?.accountType && (
                  <p className="text-sm text-muted-foreground">
                    {financialInfo.bankAccount.accountType}
                  </p>
                )}
                {!financialInfo.bankAccount?.bankName && <p>Not provided</p>}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-2">Existing Loans</p>
              <p className="font-medium">
                {financialInfo.existingLoans || 'Not provided'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="cosmic-card">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
          <XCircle className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-medium mb-2">Application Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The application you're looking for doesn't exist or you don't have access to it.
        </p>
        <Button asChild>
          <Link to="/my-applications">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Link>
        </Button>
      </div>
    );
  }

  const getPersonalName = () => {
    const personalInfo = application.personalInfo as any;
    if (personalInfo?.firstName && personalInfo?.lastName) {
      return `${personalInfo.firstName} ${personalInfo.lastName}`;
    }
    return 'Loan Application';
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="cosmic-card p-6 rounded-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-semibold">{getPersonalName()}</h1>
                <Badge variant={getStatusVariant(application.status)} className="flex items-center gap-2 px-3 py-1">
                  {getStatusIcon(application.status)}
                  {getStatusText(application.status)}
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building className="h-4 w-4" />
                <span>{application.lenderName}</span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>{getLoanTypeDisplay(application.loanTypeRequest?.type || 'study-abroad')}</span>
              </div>

              {application.loanTypeRequest?.amount && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-medium text-primary">
                    {new Intl.NumberFormat('en-GB', {
                      style: 'currency',
                      currency: 'GBP'
                    }).format(parseFloat(application.loanTypeRequest.amount))}
                  </span>
                  <span>requested</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Created {formatDateRelative(application.createdAt)}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Application Completion</span>
                <span className="font-medium">{getCompletionPercentage()}%</span>
              </div>
              <Progress value={getCompletionPercentage()} className="h-2" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <StatusManager
              application={application}
              onStatusChange={(newStatus) => {
                setApplication({ ...application, status: newStatus as any });
              }}
              canEdit={canEdit()}
            />
            
            <Button variant="outline" onClick={duplicateApplication}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
            
            {canEdit() && (
              <Button variant="outline" onClick={archiveApplication}>
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Loan Request Summary */}
      <LoanRequestSummary application={application} />

      {/* Application Summary Card */}
      <Card className="cosmic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Application Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <span className="text-sm text-muted-foreground">Application ID</span>
              <p className="font-medium font-mono text-sm">{application.id}</p>
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">Loan Option ID</span>
              <p className="font-medium">{application.loanOptionId}</p>
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">Created</span>
              <p className="font-medium">{formatDate(application.createdAt)}</p>
            </div>
            
            {application.submittedAt && (
              <div>
                <span className="text-sm text-muted-foreground">Submitted</span>
                <p className="font-medium">{formatDate(application.submittedAt)}</p>
              </div>
            )}
            
            {application.reviewedAt && (
              <div>
                <span className="text-sm text-muted-foreground">Last Reviewed</span>
                <p className="font-medium">{formatDate(application.reviewedAt)}</p>
              </div>
            )}
          </div>

          {application.reviewerNotes && (
            <>
              <Separator className="my-4" />
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-sm font-medium">Reviewer Notes</span>
                </div>
                <p className="text-sm">{application.reviewerNotes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Tabs with Offers */}
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-fit">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="offers" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Offers
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Timeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          {/* Personal Information */}
          <Card className="cosmic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderPersonalInfo()}
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card className="cosmic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Financial Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderFinancialInfo()}
            </CardContent>
          </Card>

          {/* Employment/Education */}
          {(application.educationCareer || application.professionalEmployment) && (
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {application.loanTypeRequest?.type === 'study-abroad' ? (
                    <>
                      <GraduationCap className="h-5 w-5" />
                      Education & Career
                    </>
                  ) : (
                    <>
                      <Briefcase className="h-5 w-5" />
                      Professional Employment
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Employment and education details provided in application.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="offers" className="space-y-6">
          <RelatedOffers
            applicationId={application.id!}
            userId={user?.id!}
            canEdit={canEdit()}
          />
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <DocumentManager
            applicationId={application.id!}
            loanType={application.loanTypeRequest?.type || 'study-abroad'}
            canEdit={canEdit()}
          />
        </TabsContent>

        <TabsContent value="timeline">
          <ApplicationTimeline applicationId={application.id!} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApplicationDetailView;