import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Clock, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  X,
  Eye,
  Timer
} from 'lucide-react';
import { toast } from 'sonner';
import { format, differenceInHours, differenceInDays } from 'date-fns';

interface LoanOffer {
  id: string;
  application_id: string;
  offer_type: string;
  loan_amount: number;
  apr_rate?: number;
  isa_percentage?: number;
  status: string;
  offer_valid_until: string;
  created_at: string;
}

interface OfferNotificationBannerProps {
  onViewOffer?: (applicationId: string) => void;
}

export const OfferNotificationBanner: React.FC<OfferNotificationBannerProps> = ({
  onViewOffer
}) => {
  const { user } = useAuth();
  const [pendingOffers, setPendingOffers] = useState<LoanOffer[]>([]);
  const [expiringOffers, setExpiringOffers] = useState<LoanOffer[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOffers();
      // Set up real-time updates for offers
      const channel = supabase
        .channel('offer_notifications')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'loan_offers',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            fetchOffers();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchOffers = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('loan_offers')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const now = new Date();
      const offers = data || [];
      
      // Filter pending offers
      const activePending = offers.filter(offer => {
        const expiryDate = new Date(offer.offer_valid_until);
        return expiryDate > now;
      });

      // Filter expiring offers (within 24 hours)
      const expiring = activePending.filter(offer => {
        const expiryDate = new Date(offer.offer_valid_until);
        const hoursUntilExpiry = differenceInHours(expiryDate, now);
        return hoursUntilExpiry <= 24 && hoursUntilExpiry > 0;
      });

      setPendingOffers(activePending);
      setExpiringOffers(expiring);
    } catch (error) {
      console.error('Error fetching offers for notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const getTimeUntilExpiry = (validUntil: string) => {
    const expiryDate = new Date(validUntil);
    const now = new Date();
    const hoursUntilExpiry = differenceInHours(expiryDate, now);
    const daysUntilExpiry = differenceInDays(expiryDate, now);
    
    if (hoursUntilExpiry <= 24) {
      return `${hoursUntilExpiry} hours`;
    }
    return `${daysUntilExpiry} days`;
  };

  const dismissNotification = (offerId: string) => {
    setDismissed(prev => [...prev, offerId]);
  };

  const handleViewOffer = (applicationId: string) => {
    if (onViewOffer) {
      onViewOffer(applicationId);
    } else {
      // Navigate to application detail
      window.location.href = `/application/${applicationId}`;
    }
  };

  if (loading || (!pendingOffers.length && !expiringOffers.length)) {
    return null;
  }

  const visiblePendingOffers = pendingOffers.filter(offer => !dismissed.includes(offer.id));
  const visibleExpiringOffers = expiringOffers.filter(offer => !dismissed.includes(offer.id));

  return (
    <div className="space-y-3 mb-6">
      {/* Expiring Offers - High Priority */}
      {visibleExpiringOffers.map((offer) => (
        <Card key={`expiring-${offer.id}`} className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Timer className="h-5 w-5 text-orange-600 mt-0.5" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-orange-300 text-orange-700">
                      Expiring Soon
                    </Badge>
                    <span className="text-sm text-orange-800 font-medium">
                      {getTimeUntilExpiry(offer.offer_valid_until)} remaining
                    </span>
                  </div>
                  <h4 className="font-semibold text-orange-900">
                    Urgent: Loan Offer Expires Soon
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-orange-700">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium">{formatCurrency(offer.loan_amount)}</span>
                    </div>
                    {offer.apr_rate && (
                      <span>{offer.apr_rate}% APR</span>
                    )}
                    {offer.isa_percentage && (
                      <span>{offer.isa_percentage}% of income</span>
                    )}
                    <span className="capitalize">{offer.offer_type} offer</span>
                  </div>
                  <p className="text-sm text-orange-700">
                    Review and accept your loan offer before it expires on{' '}
                    <strong>{format(new Date(offer.offer_valid_until), 'PPP')}</strong>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  onClick={() => handleViewOffer(offer.application_id)}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Review Offer
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => dismissNotification(offer.id)}
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* New Pending Offers */}
      {visiblePendingOffers.filter(offer => !visibleExpiringOffers.some(exp => exp.id === offer.id)).map((offer) => (
        <Card key={`pending-${offer.id}`} className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-blue-300 text-blue-700">
                      New Offer
                    </Badge>
                    <span className="text-sm text-blue-600">
                      Received {format(new Date(offer.created_at), 'PPP')}
                    </span>
                  </div>
                  <h4 className="font-semibold text-blue-900">
                    You have a new loan offer available
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-blue-700">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium">{formatCurrency(offer.loan_amount)}</span>
                    </div>
                    {offer.apr_rate && (
                      <span>{offer.apr_rate}% APR</span>
                    )}
                    {offer.isa_percentage && (
                      <span>{offer.isa_percentage}% of income</span>
                    )}
                    <span className="capitalize">{offer.offer_type} offer</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Review your personalized loan offer and decide whether to accept or decline.
                    Valid until <strong>{format(new Date(offer.offer_valid_until), 'PPP')}</strong>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  onClick={() => handleViewOffer(offer.application_id)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Offer
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => dismissNotification(offer.id)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Summary for multiple offers */}
      {visiblePendingOffers.length > 2 && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-semibold text-green-900">
                    Great news! You have {visiblePendingOffers.length} loan offers
                  </h4>
                  <p className="text-sm text-green-700">
                    Compare all your offers to find the best terms for your needs.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-100"
              >
                Compare All Offers
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};