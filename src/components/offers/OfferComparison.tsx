import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  DollarSign, 
  Percent, 
  Calendar, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  XCircle,
  Star,
  Calculator,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

interface LoanOffer {
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
}

interface OfferComparisonProps {
  offers: LoanOffer[];
  onSelectOffer: (offerId: string, action: 'accept' | 'decline') => void;
  canEdit: boolean;
}

export const OfferComparison: React.FC<OfferComparisonProps> = ({
  offers,
  onSelectOffer,
  canEdit
}) => {
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);

  if (offers.length < 2) {
    return null; // Don't show comparison for single offer
  }

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

  const calculateTotalCost = (offer: LoanOffer) => {
    if (offer.repayment_schedule?.totalRepayment) {
      return offer.repayment_schedule.totalRepayment;
    }
    if (offer.repayment_schedule?.monthlyPayment) {
      return offer.repayment_schedule.monthlyPayment * offer.repayment_term_months;
    }
    return null;
  };

  const getBestOffer = () => {
    const activeLoanOffers = offers.filter(offer => 
      offer.status === 'pending' && offer.offer_type === 'loan' && offer.apr_rate
    );
    
    if (activeLoanOffers.length === 0) return null;
    
    return activeLoanOffers.reduce((best, current) => {
      const bestAPR = best.apr_rate || Infinity;
      const currentAPR = current.apr_rate || Infinity;
      return currentAPR < bestAPR ? current : best;
    });
  };

  const bestOffer = getBestOffer();

  const toggleOfferSelection = (offerId: string) => {
    setSelectedOffers(prev => 
      prev.includes(offerId) 
        ? prev.filter(id => id !== offerId)
        : prev.length < 3 ? [...prev, offerId] : prev
    );
  };

  const pendingOffers = offers.filter(offer => offer.status === 'pending');

  return (
    <div className="space-y-6">
      <Card className="cosmic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Compare Your Loan Offers ({offers.length})
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select up to 3 offers to compare side by side
          </p>
        </CardHeader>
        <CardContent>
          {/* Quick Selection */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
            {offers.map((offer) => (
              <button
                key={offer.id}
                onClick={() => toggleOfferSelection(offer.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedOffers.includes(offer.id)
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {getOfferTypeDisplay(offer.offer_type)}
                  </Badge>
                  {bestOffer?.id === offer.id && (
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  )}
                </div>
                <p className="font-semibold text-sm">{formatCurrency(offer.loan_amount)}</p>
                {offer.apr_rate && (
                  <p className="text-xs text-muted-foreground">{offer.apr_rate}% APR</p>
                )}
              </button>
            ))}
          </div>

          {/* Comparison Table */}
          {selectedOffers.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted/50 p-4">
                <h4 className="font-semibold">Offer Comparison</h4>
                <p className="text-sm text-muted-foreground">
                  Comparing {selectedOffers.length} selected offers
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/20">
                    <tr>
                      <td className="p-4 font-medium">Feature</td>
                      {selectedOffers.map((offerId) => {
                        const offer = offers.find(o => o.id === offerId)!;
                        return (
                          <td key={offerId} className="p-4 text-center">
                            <div className="space-y-1">
                              <Badge variant="outline" className="text-xs">
                                {getOfferTypeDisplay(offer.offer_type)}
                              </Badge>
                              {bestOffer?.id === offer.id && (
                                <div className="flex items-center justify-center gap-1">
                                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                  <span className="text-xs text-yellow-700">Best Rate</span>
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-4 font-medium flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Loan Amount
                      </td>
                      {selectedOffers.map((offerId) => {
                        const offer = offers.find(o => o.id === offerId)!;
                        return (
                          <td key={offerId} className="p-4 text-center font-semibold text-primary">
                            {formatCurrency(offer.loan_amount)}
                          </td>
                        );
                      })}
                    </tr>
                    
                    <tr className="border-t bg-muted/20">
                      <td className="p-4 font-medium flex items-center gap-2">
                        <Percent className="h-4 w-4" />
                        Interest Rate
                      </td>
                      {selectedOffers.map((offerId) => {
                        const offer = offers.find(o => o.id === offerId)!;
                        return (
                          <td key={offerId} className="p-4 text-center">
                            {offer.apr_rate ? (
                              <span className={`font-semibold ${
                                bestOffer?.id === offer.id ? 'text-green-600' : ''
                              }`}>
                                {offer.apr_rate}% APR
                              </span>
                            ) : offer.isa_percentage ? (
                              <span className="font-semibold">
                                {offer.isa_percentage}% of income
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    <tr className="border-t">
                      <td className="p-4 font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Repayment Term
                      </td>
                      {selectedOffers.map((offerId) => {
                        const offer = offers.find(o => o.id === offerId)!;
                        return (
                          <td key={offerId} className="p-4 text-center font-semibold">
                            {offer.repayment_term_months} months
                          </td>
                        );
                      })}
                    </tr>

                    <tr className="border-t bg-muted/20">
                      <td className="p-4 font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Grace Period
                      </td>
                      {selectedOffers.map((offerId) => {
                        const offer = offers.find(o => o.id === offerId)!;
                        return (
                          <td key={offerId} className="p-4 text-center">
                            {offer.grace_period_months > 0 ? (
                              <span className="font-semibold text-green-600">
                                {offer.grace_period_months} months
                              </span>
                            ) : (
                              <span className="text-muted-foreground">None</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    <tr className="border-t">
                      <td className="p-4 font-medium flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        Monthly Payment
                      </td>
                      {selectedOffers.map((offerId) => {
                        const offer = offers.find(o => o.id === offerId)!;
                        const monthlyPayment = offer.repayment_schedule?.monthlyPayment;
                        return (
                          <td key={offerId} className="p-4 text-center">
                            {monthlyPayment ? (
                              <span className="font-semibold">
                                {formatCurrency(monthlyPayment)}
                              </span>
                            ) : offer.offer_type === 'isa' ? (
                              <span className="text-sm text-muted-foreground">
                                Based on income
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    <tr className="border-t bg-muted/20">
                      <td className="p-4 font-medium flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Total Cost
                      </td>
                      {selectedOffers.map((offerId) => {
                        const offer = offers.find(o => o.id === offerId)!;
                        const totalCost = calculateTotalCost(offer);
                        return (
                          <td key={offerId} className="p-4 text-center">
                            {totalCost ? (
                              <span className="font-semibold">
                                {formatCurrency(totalCost)}
                              </span>
                            ) : offer.offer_type === 'isa' ? (
                              <span className="text-sm text-muted-foreground">
                                Capped at 1.5x loan
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              {canEdit && (
                <div className="p-4 bg-muted/20 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedOffers.map((offerId) => {
                      const offer = offers.find(o => o.id === offerId)!;
                      if (offer.status !== 'pending') return null;
                      
                      return (
                        <div key={offerId} className="text-center space-y-2">
                          <p className="text-sm font-medium">
                            {getOfferTypeDisplay(offer.offer_type)}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => onSelectOffer(offerId, 'accept')}
                              className="flex-1"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onSelectOffer(offerId, 'decline')}
                              className="flex-1"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Decline
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recommendation */}
          {bestOffer && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start gap-3">
                <Star className="h-5 w-5 text-green-600 fill-current mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    Recommended Offer
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    The <strong>{getOfferTypeDisplay(bestOffer.offer_type)}</strong> offer 
                    of <strong>{formatCurrency(bestOffer.loan_amount)}</strong> at{' '}
                    <strong>{bestOffer.apr_rate}% APR</strong> offers the best interest rate 
                    among your traditional loan options.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">Comparison Tips:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Lower APR means less total interest paid</li>
                  <li>• ISA offers adjust payments based on your income</li>
                  <li>• Grace periods give you time before payments start</li>
                  <li>• Consider total cost, not just monthly payments</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};