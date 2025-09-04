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
    <Card className={`relative transition-all duration-200 hover:shadow-lg ${
      offer.status === 'accepted' ? 'border-primary shadow-md' : 
      isExpiringSoon() ? 'border-orange-400 shadow-md' :
      isExpired() ? 'border-destructive opacity-75' : ''
    }`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl font-bold">
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

      <CardContent className="space-y-4">
        {/* Essential Terms - Simplified Grid */}
        <div className="grid grid-cols-2 gap-4">
          {offer.offer_type === 'loan' || offer.offer_type === 'hybrid' ? (
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Percent className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold text-primary">{offer.apr_rate}%</p>
              <p className="text-sm text-muted-foreground">APR</p>
            </div>
          ) : null}

          {offer.offer_type === 'isa' || offer.offer_type === 'hybrid' ? (
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold text-primary">{offer.isa_percentage}%</p>
              <p className="text-sm text-muted-foreground">Income Share</p>
            </div>
          ) : null}

          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <CalendarDays className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold text-primary">{offer.repayment_term_months}</p>
            <p className="text-sm text-muted-foreground">Months</p>
          </div>

          {offer.grace_period_months > 0 && (
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold text-primary">{offer.grace_period_months}</p>
              <p className="text-sm text-muted-foreground">Grace Period</p>
            </div>
          )}
        </div>

        {/* Monthly Payment Highlight */}
        {offer.repayment_schedule?.monthlyPayment && (
          <div className="text-center p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <DollarSign className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-3xl font-bold text-primary mb-1">
              {formatCurrency(offer.repayment_schedule.monthlyPayment)}
            </p>
            <p className="text-sm text-muted-foreground">Monthly Payment</p>
          </div>
        )}

        <Separator />

        {/* Offer Expiry */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Valid Until</p>
          <p className={`font-medium ${isExpiringSoon() ? 'text-orange-600' : isExpired() ? 'text-destructive' : ''}`}>
            {new Date(offer.offer_valid_until).toLocaleDateString('en-GB', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={onViewDetails}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Full Agreement
          </Button>

          {showActions && offer.status === 'pending' && !isExpired() && (
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="destructive"
                onClick={onDecline}
                size="sm"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Decline
              </Button>
              <Button
                onClick={onAccept}
                size="sm"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Accept
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};