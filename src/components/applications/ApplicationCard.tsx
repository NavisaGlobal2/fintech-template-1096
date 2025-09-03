import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Eye, 
  Edit, 
  Play,
  Calendar,
  Building,
  DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { FullLoanApplication } from '@/types/loanApplication';
import { formatDistanceToNow } from 'date-fns';

interface ApplicationCardProps {
  application: FullLoanApplication;
  onRefresh?: () => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onRefresh }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <FileText className="h-4 w-4" />;
      case 'pending':
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

  const getProgressPercentage = () => {
    const totalSteps = 6; // Based on application flow
    const completedCount = application.completedSteps?.length || 0;
    return Math.round((completedCount / totalSteps) * 100);
  };

  const canEdit = () => {
    return application.status === 'draft' || application.status === 'submitted';
  };

  const canContinue = () => {
    return application.status === 'draft' && (application.completedSteps?.length || 0) < 6;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'N/A';
    }
  };

  const getPersonalName = () => {
    const personalInfo = application.personalInfo as any;
    if (personalInfo?.firstName && personalInfo?.lastName) {
      return `${personalInfo.firstName} ${personalInfo.lastName}`;
    }
    return 'Application';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-lg">{getPersonalName()}</h3>
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
                Created {formatDate(application.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        {application.status === 'draft' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-muted-foreground">{getProgressPercentage()}%</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
        )}

        {/* Key Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Loan Option ID:</span>
            <p className="font-medium">{application.loanOptionId}</p>
          </div>
          
          {application.submittedAt && (
            <div>
              <span className="text-muted-foreground">Submitted:</span>
              <p className="font-medium">{formatDate(application.submittedAt)}</p>
            </div>
          )}
          
          {application.reviewedAt && (
            <div>
              <span className="text-muted-foreground">Last Reviewed:</span>
              <p className="font-medium">{formatDate(application.reviewedAt)}</p>
            </div>
          )}
        </div>

        {/* Reviewer Notes */}
        {application.reviewerNotes && (
          <div className="p-3 bg-muted/50 rounded-md">
            <span className="text-sm font-medium text-muted-foreground">Notes from Reviewer:</span>
            <p className="text-sm mt-1">{application.reviewerNotes}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/application/${application.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Link>
          </Button>

          {canContinue() && (
            <Button size="sm" asChild>
              <Link to={`/#loan-matcher`} state={{ continueApplication: application.id }}>
                <Play className="h-4 w-4 mr-2" />
                Continue
              </Link>
            </Button>
          )}

          {canEdit() && !canContinue() && (
            <Button variant="outline" size="sm" asChild>
              <Link to={`/application/${application.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;