import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  DollarSign,
  Calendar,
  User,
  FileText
} from 'lucide-react';
import { useUnderwriting } from '@/hooks/useUnderwriting';
import { toast } from 'sonner';

const UnderwritingDashboard: React.FC = () => {
  const { data, processApplication, updateOfferStatus } = useUnderwriting();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleProcessApplication = async (application: any) => {
    setProcessingId(application.id);
    try {
      const result = await processApplication(application);
      if (result) {
        toast.success('Application processed successfully');
      }
    } finally {
      setProcessingId(null);
    }
  };

  const getRiskBadgeColor = (tier: string) => {
    switch (tier) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'auto-approve': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'decline': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'manual-review': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading underwriting data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Applications</p>
                <p className="text-2xl font-medium">{data.applications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Assessments</p>
                <p className="text-2xl font-medium">{data.assessments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Offers</p>
                <p className="text-2xl font-medium">
                  {data.offers.filter(o => o.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Accepted Offers</p>
                <p className="text-2xl font-medium">
                  {data.offers.filter(o => o.status === 'accepted').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Pending Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.applications.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No pending applications to review
            </p>
          ) : (
            <div className="space-y-4">
              {data.applications.map((app) => (
                <div key={app.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <User className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">
                          {app.personal_info?.firstName} {app.personal_info?.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {app.lender_name} • Applied {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleProcessApplication(app)}
                      disabled={processingId === app.id}
                      size="sm"
                    >
                      {processingId === app.id ? 'Processing...' : 'Process Application'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Assessments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Risk Assessments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.assessments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No assessments completed yet
            </p>
          ) : (
            <div className="space-y-4">
              {data.assessments.slice(0, 5).map((assessment) => (
                <div key={assessment.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getDecisionIcon(assessment.decision)}
                      <div>
                        <p className="font-medium">Risk Score: {assessment.risk_score}</p>
                        <p className="text-sm text-muted-foreground">
                          Assessed {new Date(assessment.assessed_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={getRiskBadgeColor(assessment.risk_tier)}>
                      {assessment.risk_tier.toUpperCase()} RISK
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Affordability</p>
                      <Progress value={assessment.affordability_score} className="mt-1" />
                    </div>
                    <div>
                      <p className="text-muted-foreground">Education</p>
                      <Progress value={assessment.education_score} className="mt-1" />
                    </div>
                    <div>
                      <p className="text-muted-foreground">Employment</p>
                      <Progress value={assessment.employment_score} className="mt-1" />
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sponsor</p>
                      <Progress value={assessment.sponsor_score} className="mt-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Offers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Recent Loan Offers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.offers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No offers generated yet
            </p>
          ) : (
            <div className="space-y-4">
              {data.offers.slice(0, 5).map((offer) => (
                <div key={offer.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium">
                        {formatCurrency(offer.loan_amount)} {offer.offer_type.toUpperCase()}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {offer.apr_rate && `APR: ${offer.apr_rate}%`}
                        {offer.isa_percentage && `ISA: ${offer.isa_percentage}%`}
                        {' • '}
                        {offer.repayment_term_months} months
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        offer.status === 'pending' ? 'default' :
                        offer.status === 'accepted' ? 'secondary' : 'destructive'
                      }>
                        {offer.status.toUpperCase()}
                      </Badge>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Expires: {new Date(offer.offer_valid_until).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UnderwritingDashboard;