import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
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
  CreditCard
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { FullLoanApplication } from '@/types/loanApplication';
import { formatDistanceToNow, format } from 'date-fns';
import ApplicationTimeline from './ApplicationTimeline';

interface ApplicationDetailViewProps {
  applicationId: string;
}

const ApplicationDetailView: React.FC<ApplicationDetailViewProps> = ({ applicationId }) => {
  const { user } = useAuth();
  const [application, setApplication] = useState<FullLoanApplication | null>(null);
  const [loading, setLoading] = useState(true);

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

  const renderPersonalInfo = () => {
    const personalInfo = application?.personalInfo as any;
    if (!personalInfo || Object.keys(personalInfo).length === 0) {
      return <p className="text-muted-foreground">No personal information provided yet.</p>;
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Personal Details</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Full Name:</span>
                <p>{personalInfo.firstName} {personalInfo.lastName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <p>{personalInfo.email}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Phone:</span>
                <p>{personalInfo.phone}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Date of Birth:</span>
                <p>{personalInfo.dateOfBirth}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Address</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Street:</span>
                <p>{personalInfo.address?.street}</p>
              </div>
              <div>
                <span className="text-muted-foreground">City:</span>
                <p>{personalInfo.address?.city}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Country:</span>
                <p>{personalInfo.address?.country}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDocumentSection = (title: string, documents: any) => {
    if (!documents || Object.keys(documents).length === 0) {
      return (
        <div>
          <h4 className="font-medium mb-2">{title}</h4>
          <p className="text-muted-foreground text-sm">No documents uploaded yet.</p>
        </div>
      );
    }

    return (
      <div>
        <h4 className="font-medium mb-2">{title}</h4>
        <div className="space-y-2">
          {Object.entries(documents).map(([key, doc]: [string, any]) => (
            <div key={key} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                {doc?.verified && (
                  <Badge variant="default" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Verified</Badge>
                )}
              </div>
              <div className="flex gap-1">
                {doc?.uploaded && (
                  <Button variant="ghost" size="sm">
                    <Download className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
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
              <Card key={i}>
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
          <Link to="/my-applications">Back to Applications</Link>
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-medium">{getPersonalName()}</h1>
            <Badge variant={getStatusVariant(application.status)} className="flex items-center gap-1">
              {getStatusIcon(application.status)}
              {getStatusText(application.status)}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Building className="h-4 w-4" />
              {application.lenderName}
            </div>
            
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              {getLoanTypeDisplay(application.loanTypeRequest?.type || 'study-abroad')}
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Created {formatDateRelative(application.createdAt)}
            </div>
          </div>
        </div>

        {canEdit() && (
          <Button variant="outline" asChild>
            <Link to={`/application/${application.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Application
            </Link>
          </Button>
        )}
      </div>

      {/* Key Information Card */}
      <Card>
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
              <p className="font-medium">{application.id}</p>
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
              <div>
                <span className="text-sm font-medium text-muted-foreground">Reviewer Notes:</span>
                <p className="mt-2 p-3 bg-muted/50 rounded-md text-sm">{application.reviewerNotes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Details
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

        <TabsContent value="details" className="space-y-4">
          {/* Personal Information */}
          <Card>
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

          {/* Education/Career or Professional Employment */}
          {(application.loanTypeRequest?.type === 'study-abroad' ? application.educationCareer : application.professionalEmployment) && Object.keys(application.loanTypeRequest?.type === 'study-abroad' ? application.educationCareer || {} : application.professionalEmployment || {}).length > 0 && (
            <Card>
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

          {/* Financial Information */}
          {application.financialInfo && Object.keys(application.financialInfo).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Financial Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Financial details and bank information provided in application.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>KYC Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {renderDocumentSection("Identity Documents", application.kycDocuments)}
            </CardContent>
          </Card>

          {application.loanTypeRequest?.type === 'study-abroad' && (
            <Card>
              <CardHeader>
                <CardTitle>Education Documents</CardTitle>
              </CardHeader>
              <CardContent>
                {renderDocumentSection("Academic Documents", (application.educationCareer as any)?.transcripts || {})}
              </CardContent>
            </Card>
          )}

          {application.loanTypeRequest?.type !== 'study-abroad' && (
            <Card>
              <CardHeader>
                <CardTitle>Employment Documents</CardTitle>
              </CardHeader>
              <CardContent>
                {renderDocumentSection("Employment Documents", (application.professionalEmployment as any)?.employmentLetter || {})}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <ApplicationTimeline applicationId={application.id || ''} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApplicationDetailView;