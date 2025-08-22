
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  DollarSign, 
  TrendingUp,
  User,
  FileText,
  Calendar
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { UnderwritingEngine, RiskAssessment } from '@/utils/underwritingEngine';
import { OfferGenerator, LoanOffer } from '@/utils/offerGenerator';
import { FullLoanApplication } from '@/types/loanApplication';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface UnderwritingDashboardProps {
  onBack: () => void;
}

const UnderwritingDashboard: React.FC<UnderwritingDashboardProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<FullLoanApplication[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingApplicationId, setProcessingApplicationId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load submitted applications
      const { data: appsData, error: appsError } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'submitted');

      if (appsError) throw appsError;

      // Load assessments
      const { data: assessData, error: assessError } = await supabase
        .from('underwriting_assessments')
        .select('*')
        .eq('user_id', user?.id);

      if (assessError) throw assessError;

      // Load offers
      const { data: offersData, error: offersError } = await supabase
        .from('loan_offers')
        .select('*')
        .eq('user_id', user?.id);

      if (offersError) throw offersError;

      setApplications(appsData || []);
      setAssessments(assessData || []);
      setOffers(offersData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load underwriting data');
    } finally {
      setIsLoading(false);
    }
  };

  const processApplication = async (application: FullLoanApplication) => {
    if (!application.id || !user?.id) return;

    setProcessingApplicationId(application.id);
    try {
      const engine = new UnderwritingEngine();
      const assessment = await engine.assessApplication(application);
      
      // Save assessment
      const assessmentId = await engine.saveAssessment(
        application.id, 
        user.id, 
        assessment
      );

      if (assessmentId && assessment.decision !== 'decline') {
        // Generate and save offer
        const generator = new OfferGenerator();
        const offer = generator.generateOffer(application, assessment);
        
        if (offer) {
          await generator.saveOffer(assessmentId, application.id, user.id, offer);
        }
      }

      toast.success('Application processed successfully');
      await loadData(); // Reload data
    } catch (error) {
      console.error('Error processing application:', error);
      toast.error('Failed to process application');
    } finally {
      setProcessingApplicationId(null);
    }
  };

  const acceptOffer = async (offerId: string) => {
    try {
      const { error } = await supabase
        .from('loan_offers')
        .update({ 
          status: 'accepted', 
          accepted_at: new Date().toISOString() 
        })
        .eq('id', offerId)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      toast.success('Offer accepted! Contract signing will begin shortly.');
      await loadData();
    } catch (error) {
      console.error('Error accepting offer:', error);
      toast.error('Failed to accept offer');
    }
  };

  const declineOffer = async (offerId: string) => {
    try {
      const { error } = await supabase
        .from('loan_offers')
        .update({ 
          status: 'declined', 
          declined_at: new Date().toISOString() 
        })
        .eq('id', offerId)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      toast.success('Offer declined');
      await loadData();
    } catch (error) {
      console.error('Error declining offer:', error);
      toast.error('Failed to decline offer');
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
      case 'auto-approve': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'decline': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'manual-review': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const calculateTimeRemaining = (validUntil: string) => {
    const remaining = new Date(validUntil).getTime() - new Date().getTime();
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days remaining` : 'Expired';
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Clock className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading underwriting data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={onBack}>
          ← Back to Dashboard
        </Button>
        <h1 className="text-2xl font-medium">Underwriting Dashboard</h1>
        <div />
      </div>

      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
          <TabsTrigger value="assessments">Assessments ({assessments.length})</TabsTrigger>
          <TabsTrigger value="offers">Offers ({offers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
          <div className="space-y-4">
            {applications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Submitted Applications</h3>
                  <p className="text-muted-foreground">
                    Applications will appear here once submitted for underwriting review.
                  </p>
                </CardContent>
              </Card>
            ) : (
              applications.map((app) => (
                <Card key={app.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {app.personalInfo?.firstName} {app.personalInfo?.lastName}
                      </CardTitle>
                      <Badge variant="outline">
                        {app.loanTypeRequest?.type?.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Requested Amount</p>
                        <p className="font-medium">{app.loanTypeRequest?.amount || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Lender</p>
                        <p className="font-medium">{app.lenderName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Submitted</p>
                        <p className="font-medium">
                          {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge>{app.status}</Badge>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        onClick={() => processApplication(app)}
                        disabled={processingApplicationId === app.id}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {processingApplicationId === app.id ? 'Processing...' : 'Run Underwriting'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="assessments">
          <div className="space-y-4">
            {assessments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Risk Assessments</h3>
                  <p className="text-muted-foreground">
                    Risk assessments will appear here after applications are processed.
                  </p>
                </CardContent>
              </Card>
            ) : (
              assessments.map((assessment) => (
                <Card key={assessment.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {getDecisionIcon(assessment.decision)}
                        Risk Assessment
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge className={getRiskBadgeColor(assessment.risk_tier)}>
                          {assessment.risk_tier.toUpperCase()} RISK
                        </Badge>
                        <Badge variant="outline">
                          {assessment.decision.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Overall Risk Score</p>
                          <p className="text-2xl font-bold">{assessment.risk_score}/10</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Affordability</p>
                          <Progress value={assessment.affordability_score * 10} className="mt-1" />
                          <p className="text-sm mt-1">{assessment.affordability_score}/10</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Education</p>
                          <Progress value={assessment.education_score * 10} className="mt-1" />
                          <p className="text-sm mt-1">{assessment.education_score}/10</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Employment</p>
                          <Progress value={assessment.employment_score * 10} className="mt-1" />
                          <p className="text-sm mt-1">{assessment.employment_score}/10</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Assessment Date</p>
                        <p className="font-medium">
                          {new Date(assessment.assessed_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="offers">
          <div className="space-y-4">
            {offers.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Loan Offers</h3>
                  <p className="text-muted-foreground">
                    Loan offers will appear here after successful risk assessments.
                  </p>
                </CardContent>
              </Card>
            ) : (
              offers.map((offer) => (
                <Card key={offer.id} className="border-2 border-green-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        Loan Offer
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge className="bg-green-100 text-green-800">
                          {offer.offer_type.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {offer.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Loan Amount</p>
                          <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(offer.loan_amount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {offer.offer_type === 'isa' ? 'ISA Rate' : 'APR'}
                          </p>
                          <p className="text-xl font-bold">
                            {offer.offer_type === 'isa' 
                              ? `${offer.isa_percentage}%` 
                              : `${offer.apr_rate}%`}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Term</p>
                          <p className="text-xl font-bold">
                            {Math.round(offer.repayment_term_months / 12)} years
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Grace Period</p>
                          <p className="text-xl font-bold">
                            {offer.grace_period_months} months
                          </p>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Offer Valid Until
                          </p>
                          <p className="font-medium text-orange-600">
                            {calculateTimeRemaining(offer.offer_valid_until)}
                          </p>
                        </div>
                      </div>

                      {offer.status === 'pending' && (
                        <div className="flex gap-3 pt-4">
                          <Button
                            onClick={() => acceptOffer(offer.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            Accept Offer
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => declineOffer(offer.id)}
                            className="flex-1"
                          >
                            Decline Offer
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnderwritingDashboard;
