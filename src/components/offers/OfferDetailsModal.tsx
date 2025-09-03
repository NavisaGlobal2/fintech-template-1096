import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CalendarDays,
  DollarSign,
  Percent,
  Clock,
  TrendingUp,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

interface OfferDetailsModalProps {
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
  open: boolean;
  onClose: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
  showActions?: boolean;
}

export const OfferDetailsModal: React.FC<OfferDetailsModalProps> = ({
  offer,
  open,
  onClose,
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

  const isExpired = () => {
    const expiryDate = new Date(offer.offer_valid_until);
    return new Date() > expiryDate;
  };

  const isExpiringSoon = () => {
    const expiryDate = new Date(offer.offer_valid_until);
    const now = new Date();
    const diffInHours = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffInHours <= 24 && diffInHours > 0;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span>{formatCurrency(offer.loan_amount)}</span>
              <Badge variant="outline">{getOfferTypeDisplay(offer.offer_type)}</Badge>
            </div>
          </DialogTitle>
          <DialogDescription>
            Review all terms and conditions before accepting this loan offer.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Offer Status Alert */}
            {(isExpired() || isExpiringSoon()) && (
              <div className={`p-4 border rounded-lg ${
                isExpired() ? 'border-destructive bg-destructive/10' : 'border-orange-400 bg-orange-50'
              }`}>
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`h-4 w-4 ${
                    isExpired() ? 'text-destructive' : 'text-orange-600'
                  }`} />
                  <span className={`font-medium ${
                    isExpired() ? 'text-destructive' : 'text-orange-600'
                  }`}>
                    {isExpired() ? 'This offer has expired' : 'This offer expires soon'}
                  </span>
                </div>
              </div>
            )}

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="repayment">Repayment</TabsTrigger>
                <TabsTrigger value="terms">Terms</TabsTrigger>
                <TabsTrigger value="conditions">Conditions</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm">Loan Amount</span>
                    </div>
                    <p className="text-2xl font-bold">{formatCurrency(offer.loan_amount)}</p>
                  </div>

                  {offer.offer_type === 'loan' || offer.offer_type === 'hybrid' ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Percent className="h-4 w-4" />
                        <span className="text-sm">APR</span>
                      </div>
                      <p className="text-2xl font-bold">{offer.apr_rate}%</p>
                    </div>
                  ) : null}

                  {offer.offer_type === 'isa' || offer.offer_type === 'hybrid' ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm">Income Share</span>
                      </div>
                      <p className="text-2xl font-bold">{offer.isa_percentage}%</p>
                    </div>
                  ) : null}

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      <span className="text-sm">Term</span>
                    </div>
                    <p className="text-2xl font-bold">{offer.repayment_term_months}</p>
                    <p className="text-xs text-muted-foreground">months</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">Grace Period</span>
                    </div>
                    <p className="text-2xl font-bold">{offer.grace_period_months}</p>
                    <p className="text-xs text-muted-foreground">months</p>
                  </div>
                </div>

                <Separator />

                {/* Offer Details */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Offer Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Offer Created</p>
                      <p className="font-medium">
                        {new Date(offer.created_at).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Valid Until</p>
                      <p className={`font-medium ${
                        isExpiringSoon() ? 'text-orange-600' : 
                        isExpired() ? 'text-destructive' : ''
                      }`}>
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
                </div>
              </TabsContent>

              <TabsContent value="repayment" className="space-y-4">
                {offer.repayment_schedule && (
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Repayment Schedule
                    </h4>
                    
                    <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                      {offer.repayment_schedule.monthlyPayment && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Monthly Payment</p>
                            <p className="text-2xl font-bold text-primary">
                              {formatCurrency(offer.repayment_schedule.monthlyPayment)}
                            </p>
                          </div>
                          {offer.repayment_schedule.totalRepayment && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Total Repayment</p>
                              <p className="text-2xl font-bold">
                                {formatCurrency(offer.repayment_schedule.totalRepayment)}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {offer.repayment_schedule.firstPaymentDate && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">First Payment Due</p>
                          <p className="text-lg font-semibold">
                            {new Date(offer.repayment_schedule.firstPaymentDate).toLocaleDateString('en-GB', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      )}
                    </div>

                    {offer.offer_type === 'isa' && (
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-medium text-blue-800 mb-1">Income Share Agreement</p>
                            <p className="text-blue-700">
                              You'll pay {offer.isa_percentage}% of your gross income for {offer.repayment_term_months} months. 
                              Payments automatically adjust based on your income level.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="terms" className="space-y-4">
                {offer.terms_and_conditions && (
                  <div className="space-y-6">
                    {/* Benefits */}
                    {offer.terms_and_conditions.benefits && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Benefits
                        </h4>
                        <ul className="space-y-2">
                          {offer.terms_and_conditions.benefits.map((benefit: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Eligibility Requirements */}
                    {offer.terms_and_conditions.eligibilityRequirements && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Eligibility Requirements
                        </h4>
                        <ul className="space-y-2">
                          {offer.terms_and_conditions.eligibilityRequirements.map((requirement: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                              <span className="text-sm">{requirement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="conditions" className="space-y-4">
                {offer.terms_and_conditions?.specialConditions && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      Special Conditions
                    </h4>
                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                      <ul className="space-y-2">
                        {offer.terms_and_conditions.specialConditions.map((condition: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-orange-800">{condition}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h5 className="font-medium mb-2">Important Notes</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• This offer is binding once accepted</li>
                    <li>• You have until the expiry date to make your decision</li>
                    <li>• Contract generation will begin immediately upon acceptance</li>
                    <li>• All terms are subject to final credit verification</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>

        {showActions && offer.status === 'pending' && !isExpired() && (
          <DialogFooter className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="destructive" onClick={onDecline}>
              <XCircle className="h-4 w-4 mr-2" />
              Decline Offer
            </Button>
            <Button onClick={onAccept}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Accept Offer
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};