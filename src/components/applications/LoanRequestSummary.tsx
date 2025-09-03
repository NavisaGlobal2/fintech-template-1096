import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Building, 
  Target, 
  Calendar, 
  CreditCard,
  GraduationCap,
  Briefcase,
  Users
} from 'lucide-react';
import { FullLoanApplication } from '@/types/loanApplication';

interface LoanRequestSummaryProps {
  application: FullLoanApplication;
}

const LoanRequestSummary: React.FC<LoanRequestSummaryProps> = ({ application }) => {
  const getLoanTypeIcon = (type: string) => {
    switch (type) {
      case 'study-abroad':
        return <GraduationCap className="h-5 w-5" />;
      case 'career-microloan':
        return <Briefcase className="h-5 w-5" />;
      case 'sponsor-match':
        return <Users className="h-5 w-5" />;
      default:
        return <DollarSign className="h-5 w-5" />;
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

  const formatCurrency = (amount: string | number) => {
    if (!amount) return 'Not specified';
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(numAmount);
  };

  return (
    <Card className="cosmic-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getLoanTypeIcon(application.loanTypeRequest?.type || 'study-abroad')}
          Loan Request Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Loan Type */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
            {getLoanTypeIcon(application.loanTypeRequest?.type || 'study-abroad')}
            <div>
              <p className="text-sm text-muted-foreground">Loan Type</p>
              <Badge variant="secondary" className="mt-1">
                {getLoanTypeDisplay(application.loanTypeRequest?.type || 'study-abroad')}
              </Badge>
            </div>
          </div>

          {/* Requested Amount */}
          {application.loanTypeRequest?.amount && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Requested Amount</p>
                <p className="font-semibold text-lg text-primary">
                  {formatCurrency(application.loanTypeRequest.amount)}
                </p>
              </div>
            </div>
          )}

          {/* Lender */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <Building className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Selected Lender</p>
              <p className="font-medium">{application.lenderName}</p>
            </div>
          </div>

          {/* Loan Purpose */}
          {application.loanTypeRequest?.purpose && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Target className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Purpose</p>
                <p className="font-medium">{application.loanTypeRequest.purpose}</p>
              </div>
            </div>
          )}

          {/* Repayment Preference */}
          {application.loanTypeRequest?.repaymentPreference && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <CreditCard className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Repayment Preference</p>
                <p className="font-medium">{application.loanTypeRequest.repaymentPreference}</p>
              </div>
            </div>
          )}

          {/* Program Info for Study Abroad */}
          {application.loanTypeRequest?.type === 'study-abroad' && application.programInfo?.institution && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <GraduationCap className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Program</p>
                <p className="font-medium">{application.programInfo.programName}</p>
                <p className="text-sm text-muted-foreground">{application.programInfo.institution}</p>
              </div>
            </div>
          )}

          {/* Total Program Cost for Study Abroad */}
          {application.programInfo?.totalCost && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Program Cost</p>
                <p className="font-semibold">{formatCurrency(application.programInfo.totalCost)}</p>
              </div>
            </div>
          )}

          {/* Start Date */}
          {application.programInfo?.startDate && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Program Start Date</p>
                <p className="font-medium">{application.programInfo.startDate}</p>
              </div>
            </div>
          )}
        </div>

        {/* Additional Details */}
        {(application.programInfo?.costBreakdown || application.loanTypeRequest?.purpose) && (
          <div className="mt-6 pt-6 border-t border-border">
            {application.programInfo?.costBreakdown && (
              <div className="mb-4">
                <h4 className="font-medium mb-3">Cost Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex justify-between p-3 bg-muted/30 rounded">
                    <span className="text-muted-foreground">Tuition:</span>
                    <span className="font-medium">{formatCurrency(application.programInfo.costBreakdown.tuition)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted/30 rounded">
                    <span className="text-muted-foreground">Living Expenses:</span>
                    <span className="font-medium">{formatCurrency(application.programInfo.costBreakdown.livingExpenses)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted/30 rounded">
                    <span className="text-muted-foreground">Other:</span>
                    <span className="font-medium">{formatCurrency(application.programInfo.costBreakdown.other)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoanRequestSummary;