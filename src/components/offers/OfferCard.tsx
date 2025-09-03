import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, DollarSign, Percent, Clock, TrendingUp, Eye, CheckCircle, XCircle } from 'lucide-react';

interface OfferCardProps {
  offer: {
    id: string;
    offer_type: string;
    loan_amount: number;
    apr_rate?: number;
    isa_percentage?: number;
    repayment_term_months: number;
    grace_period_months: number;
    repayment_schedule: any;
    terms_and_conditions: any;
    status: string;
    offer_valid_until: string;
    created_at: string;
  };
  onViewDetails: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
  showActions?: boolean;
}

export const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  onViewDetails,
  onAccept,
  onDecline,
  showActions = true
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const getOfferTypeDisplay = (type: string) => {
    switch (type) {
      case 'loan': return 'Traditional Loan';
      case 'isa': return 'Income Share Agreement';
      case 'hybrid': return 'Hybrid Loan';
      default: return type;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'accepted': return 'default';
      case 'declined': return 'destructive';
      case 'expired': return 'outline';
      default: return 'secondary';
    }
  };

  const isExpiringSoon = () => {
    const expiryDate = new Date(offer.offer_valid_until);
    const now = new Date();
    const diffInHours = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffInHours <= 24 && diffInHours > 0;
  };

  const isExpired = () => {
    const expiryDate = new Date(offer.offer_valid_until);
    return new Date() > expiryDate;
  };

  return (
    <Card className={`relative transition-all duration-200 ${
      offer.status === 'accepted' ? 'border-primary shadow-md' : 
      isExpiringSoon() ? 'border-orange-400 shadow-md' :
      isExpired() ? 'border-destructive opacity-75' : ''
    }`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">
                {formatCurrency(offer.loan_amount)}
              </CardTitle>
              <Badge variant={getStatusBadgeVariant(offer.status)} className="capitalize">
                {offer.status}
              </Badge>
            </div>
            <CardDescription className="text-base">
              {getOfferTypeDisplay(offer.offer_type)}
            </CardDescription>
          </div>
          {(isExpiringSoon() || isExpired()) && (
            <Badge variant={isExpired() ? 'destructive' : 'outline'} className="ml-2">
              {isExpired() ? 'Expired' : 'Expires Soon'}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Key Terms Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {offer.offer_type === 'loan' || offer.offer_type === 'hybrid' ? (
            <div className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">APR</p>
                <p className="font-semibold">{offer.apr_rate}%</p>
              </div>
            </div>
          ) : null}

          {offer.offer_type === 'isa' || offer.offer_type === 'hybrid' ? (
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Income Share</p>
                <p className="font-semibold">{offer.isa_percentage}%</p>
              </div>
            </div>
          ) : null}

          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Term</p>
              <p className="font-semibold">{offer.repayment_term_months} months</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Grace Period</p>
              <p className="font-semibold">{offer.grace_period_months} months</p>
            </div>
          </div>
        </div>

        {/* Repayment Schedule */}
        {offer.repayment_schedule?.monthlyPayment && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Monthly Payment
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Monthly Payment</p>
                <p className="font-semibold">
                  {formatCurrency(offer.repayment_schedule.monthlyPayment)}
                </p>
              </div>
              {offer.repayment_schedule.totalRepayment && (
                <div>
                  <p className="text-muted-foreground">Total Repayment</p>
                  <p className="font-semibold">
                    {formatCurrency(offer.repayment_schedule.totalRepayment)}
                  </p>
                </div>
              )}
            </div>
            {offer.repayment_schedule.firstPaymentDate && (
              <div className="mt-2">
                <p className="text-muted-foreground text-sm">First Payment Due</p>
                <p className="font-medium">
                  {new Date(offer.repayment_schedule.firstPaymentDate).toLocaleDateString('en-GB')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Key Benefits */}
        {offer.terms_and_conditions?.benefits?.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Key Benefits</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {offer.terms_and_conditions.benefits.slice(0, 3).map((benefit: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Separator />

        {/* Offer Expiry */}
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-muted-foreground">Offer Valid Until</p>
            <p className={`font-medium ${isExpiringSoon() ? 'text-orange-600' : isExpired() ? 'text-destructive' : ''}`}>
              {new Date(offer.offer_valid_until).toLocaleDateString('en-GB', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onViewDetails}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>

          {showActions && offer.status === 'pending' && !isExpired() && (
            <>
              <Button
                variant="destructive"
                onClick={onDecline}
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Decline
              </Button>
              <Button
                onClick={onAccept}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Accept Offer
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};