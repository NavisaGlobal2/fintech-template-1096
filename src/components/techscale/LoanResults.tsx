
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoanOption, UserProfile } from '@/types/techscale';
import { CheckCircle, AlertCircle, XCircle, Clock, DollarSign, Users, Calendar } from 'lucide-react';

interface LoanResultsProps {
  loans: LoanOption[];
  userProfile: UserProfile;
}

const LoanResults: React.FC<LoanResultsProps> = ({ loans, userProfile }) => {
  const [sortBy, setSortBy] = useState<'relevance' | 'rate' | 'amount'>('relevance');

  const sortedLoans = [...loans].sort((a, b) => {
    if (sortBy === 'relevance') {
      const tierOrder = { green: 0, yellow: 1, red: 2 };
      return tierOrder[a.eligibilityTier] - tierOrder[b.eligibilityTier];
    }
    if (sortBy === 'rate') {
      const aRate = parseFloat(a.aprRange.split('%')[0]);
      const bRate = parseFloat(b.aprRange.split('%')[0]);
      return aRate - bRate;
    }
    if (sortBy === 'amount') {
      const aAmount = parseFloat(a.maxAmount.replace(/[$,]/g, ''));
      const bAmount = parseFloat(b.maxAmount.replace(/[$,]/g, ''));
      return bAmount - aAmount;
    }
    return 0;
  });

  const getEligibilityIcon = (tier: string) => {
    switch (tier) {
      case 'green':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'yellow':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'red':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getEligibilityText = (tier: string) => {
    switch (tier) {
      case 'green':
        return 'Likely Eligible';
      case 'yellow':
        return 'Needs Review';
      case 'red':
        return 'May Not Qualify';
      default:
        return 'Unknown';
    }
  };

  const getEligibilityColor = (tier: string) => {
    switch (tier) {
      case 'green':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'red':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Sorting controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {loans.length} loan options
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border border-border rounded px-2 py-1 bg-background"
          >
            <option value="relevance">Relevance</option>
            <option value="rate">Interest Rate</option>
            <option value="amount">Loan Amount</option>
          </select>
        </div>
      </div>

      {/* Loan cards */}
      <div className="space-y-4">
        {sortedLoans.map((loan) => (
          <Card key={loan.id} className={`cosmic-glass ${loan.eligibilityTier === 'green' ? 'ring-2 ring-green-200' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl">{loan.lenderName}</CardTitle>
                  <p className="text-sm text-muted-foreground">{loan.description}</p>
                  {loan.specialOffers && (
                    <Badge variant="secondary" className="w-fit">
                      🎉 {loan.specialOffers}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {getEligibilityIcon(loan.eligibilityTier)}
                  <Badge className={getEligibilityColor(loan.eligibilityTier)}>
                    {getEligibilityText(loan.eligibilityTier)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Key metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">APR Range</div>
                    <div className="text-sm text-muted-foreground">{loan.aprRange}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Max Amount</div>
                    <div className="text-sm text-muted-foreground">{loan.maxAmount}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Term</div>
                    <div className="text-sm text-muted-foreground">{loan.repaymentTerm}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Processing</div>
                    <div className="text-sm text-muted-foreground">{loan.processingTime}</div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <div className="text-sm font-medium mb-2">Key Features</div>
                <div className="flex flex-wrap gap-2">
                  {loan.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {loan.coSignerRequired && (
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Co-signer Required
                    </Badge>
                  )}
                  {loan.gracePeriod !== '0 months' && (
                    <Badge variant="outline" className="text-xs">
                      {loan.gracePeriod} Grace Period
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  Match score based on your profile
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                  <Button 
                    size="sm"
                    className={loan.eligibilityTier === 'green' ? 'bg-green-600 hover:bg-green-700' : ''}
                    disabled={loan.eligibilityTier === 'red'}
                  >
                    {loan.eligibilityTier === 'red' ? 'Not Eligible' : 'Apply Now'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LoanResults;
