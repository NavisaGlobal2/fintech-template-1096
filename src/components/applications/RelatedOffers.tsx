import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Calendar,
  Percent,
  FileText,
  TrendingUp,
  Eye,
  Bell,
  Timer
} from 'lucide-react';
import { toast } from 'sonner';
import { format, isAfter, differenceInHours, differenceInDays } from 'date-fns';
import { OfferDetailsModal } from '@/components/offers/OfferDetailsModal';
import { OfferComparison } from '@/components/offers/OfferComparison';

interface LoanOffer {
  id: string;
  application_id: string;
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
  accepted_at?: string;
  declined_at?: string;
}

interface RelatedOffersProps {
  applicationId: string;
  userId: string;
  canEdit: boolean;
}

const RelatedOffers: React.FC<RelatedOffersProps> = ({ applicationId, userId, canEdit }) => {
  const [offers, setOffers] = useState<LoanOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<LoanOffer | null>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, [applicationId]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('loan_offers')
        .select('*')
        .eq('application_id', applicationId)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOffers(data || []);
    } catch (error) {
      console.error('Error fetching offers:', error);
      toast.error('Failed to load loan offers');
    } finally {
      setLoading(false);
    }
  };

  const handleOfferAction = async (offerId: string, action: 'accept' | 'decline') => {
    if (!canEdit) {
      toast.error('Cannot modify offers for this application');
      return;
    }

    try {
      const { error } = await supabase
        .from('loan_offers')
        .update({
          status: action === 'accept' ? 'accepted' : 'declined',
          [action === 'accept' ? 'accepted_at' : 'declined_at']: new Date().toISOString(),
          accepted_by: action === 'accept' ? userId : null
        })
        .eq('id', offerId);

      if (error) throw error;

      toast.success(`Offer ${action}ed successfully`);
      fetchOffers();
    } catch (error) {
      console.error(`Error ${action}ing offer:`, error);
      toast.error(`Failed to ${action} offer`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'declined': return <XCircle className="h-4 w-4" />;
      case 'expired': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'accepted': return 'default';
      case 'declined': return 'destructive';
      case 'expired': return 'outline';
      default: return 'secondary';
    }
  };

  const isOfferExpired = (validUntil: string) => {
    return isAfter(new Date(), new Date(validUntil));
  };

  const isOfferExpiringSoon = (validUntil: string) => {
    const expiryDate = new Date(validUntil);
    const now = new Date();
    const hoursUntilExpiry = differenceInHours(expiryDate, now);
    return hoursUntilExpiry <= 24 && hoursUntilExpiry > 0;
  };

  const getExpiryWarning = (validUntil: string) => {
    const expiryDate = new Date(validUntil);
    const now = new Date();
    const hoursUntilExpiry = differenceInHours(expiryDate, now);
    const daysUntilExpiry = differenceInDays(expiryDate, now);
    
    if (hoursUntilExpiry <= 0) return null;
    if (hoursUntilExpiry <= 24) return `Expires in ${hoursUntilExpiry} hours`;
    if (daysUntilExpiry <= 7) return `Expires in ${daysUntilExpiry} days`;
    return null;
  };

  const handleViewDetails = (offer: LoanOffer) => {
    setSelectedOffer(offer);
    setShowOfferModal(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <Card className="cosmic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Related Loan Offers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading offers...</div>
        </CardContent>
      </Card>
    );
  }

  if (offers.length === 0) {
    return (
      <Card className="cosmic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Related Loan Offers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Offers Yet</h3>
            <p className="text-muted-foreground">
              Once your application is reviewed, loan offers will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Offer Comparison - Show when multiple offers exist */}
      {offers.length > 1 && (
        <OfferComparison 
          offers={offers} 
          onSelectOffer={handleOfferAction}
          canEdit={canEdit}
        />
      )}

      <Card className="cosmic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Related Loan Offers ({offers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {offers.map((offer, index) => {
              const expired = isOfferExpired(offer.offer_valid_until);
              const effectiveStatus = expired && offer.status === 'pending' ? 'expired' : offer.status;
              
              return (
                <div key={offer.id}>
                  <div className="space-y-4">
                    {/* Offer Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant={getStatusVariant(effectiveStatus)} className="flex items-center gap-2">
                          {getStatusIcon(effectiveStatus)}
                          {effectiveStatus.charAt(0).toUpperCase() + effectiveStatus.slice(1)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {offer.offer_type.charAt(0).toUpperCase() + offer.offer_type.slice(1)} Offer
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Created {formatDate(offer.created_at)}
                      </span>
                    </div>

                    {/* Offer Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Loan Amount</p>
                          <p className="font-semibold text-primary">{formatCurrency(offer.loan_amount)}</p>
                        </div>
                      </div>

                      {offer.apr_rate && (
                        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                          <Percent className="h-4 w-4 text-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">APR Rate</p>
                            <p className="font-semibold">{offer.apr_rate}%</p>
                          </div>
                        </div>
                      )}

                      {offer.isa_percentage && (
                        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                          <Percent className="h-4 w-4 text-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">ISA Percentage</p>
                            <p className="font-semibold">{offer.isa_percentage}%</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <Calendar className="h-4 w-4 text-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Term</p>
                          <p className="font-semibold">{offer.repayment_term_months} months</p>
                        </div>
                      </div>

                      {offer.grace_period_months > 0 && (
                        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                          <Clock className="h-4 w-4 text-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Grace Period</p>
                            <p className="font-semibold">{offer.grace_period_months} months</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Valid Until</p>
                          <p className="font-semibold text-sm">{formatDate(offer.offer_valid_until)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Expiration Warning */}
                    {!expired && offer.status === 'pending' && (() => {
                      const warning = getExpiryWarning(offer.offer_valid_until);
                      return warning ? (
                        <div className="p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Timer className="h-4 w-4 text-orange-600" />
                            <p className="text-sm text-orange-800 dark:text-orange-200">
                              ⚠️ {warning}
                            </p>
                          </div>
                        </div>
                      ) : null;
                    })()}

                    {/* Enhanced Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      {/* View Details Button - Always visible */}
                      <Button 
                        variant="outline" 
                        onClick={() => handleViewDetails(offer)}
                        className="flex items-center justify-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Full Details
                      </Button>

                      {/* Accept/Decline buttons - only for pending offers */}
                      {offer.status === 'pending' && !expired && canEdit && (
                        <>
                          <Button 
                            onClick={() => handleOfferAction(offer.id, 'accept')}
                            className="flex-1 min-w-0"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept Offer
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => handleOfferAction(offer.id, 'decline')}
                            className="flex-1 min-w-0"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Decline
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Status Messages */}
                    {offer.accepted_at && (
                      <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-sm text-green-800 dark:text-green-200">
                          ✅ Accepted on {formatDate(offer.accepted_at)}
                        </p>
                      </div>
                    )}

                    {offer.declined_at && (
                      <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-800 dark:text-red-200">
                          ❌ Declined on {formatDate(offer.declined_at)}
                        </p>
                      </div>
                    )}

                    {expired && offer.status === 'pending' && (
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          ⏰ This offer has expired
                        </p>
                      </div>
                    )}
                  </div>

                  {index < offers.length - 1 && <Separator className="mt-6" />}
                </div>
              );
            })}
          </div>
        </CardContent>

        {/* Offer Details Modal */}
        {selectedOffer && (
          <OfferDetailsModal
            offer={selectedOffer}
            open={showOfferModal}
            onClose={() => {
              setShowOfferModal(false);
              setSelectedOffer(null);
            }}
            onAccept={() => {
              handleOfferAction(selectedOffer.id, 'accept');
              setShowOfferModal(false);
              setSelectedOffer(null);
            }}
            onDecline={() => {
              handleOfferAction(selectedOffer.id, 'decline');
              setShowOfferModal(false);
              setSelectedOffer(null);
            }}
            showActions={canEdit && selectedOffer.status === 'pending' && !isOfferExpired(selectedOffer.offer_valid_until)}
          />
        )}
      </Card>
    </div>
  );
};

export default RelatedOffers;