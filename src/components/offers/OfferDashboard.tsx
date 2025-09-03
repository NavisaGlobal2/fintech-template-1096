import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, DollarSign, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { OfferCard } from './OfferCard';
import { OfferDetailsModal } from './OfferDetailsModal';
import { toast } from 'sonner';

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

interface LoanApplication {
  id: string;
  lender_name: string;
  loan_type_requested: string;
  status: string;
  created_at: string;
  submitted_at: string;
}

export const OfferDashboard: React.FC = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState<LoanOffer[]>([]);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<LoanOffer | null>(null);
  const [showOfferDetails, setShowOfferDetails] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOffersAndApplications();
    }
  }, [user]);

  const fetchOffersAndApplications = async () => {
    try {
      setLoading(true);

      // Fetch offers
      const { data: offersData, error: offersError } = await supabase
        .from('loan_offers')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (offersError) throw offersError;

      // Fetch applications
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('loan_applications')
        .select('id, lender_name, loan_type_requested, status, created_at, submitted_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (applicationsError) throw applicationsError;

      setOffers(offersData || []);
      setApplications(applicationsData || []);
    } catch (error: any) {
      console.error('Error fetching offers:', error);
      toast.error('Failed to load offers and applications');
    } finally {
      setLoading(false);
    }
  };

  const handleOfferAction = async (offerId: string, action: 'accept' | 'decline') => {
    try {
      const { error } = await supabase
        .from('loan_offers')
        .update({
          status: action === 'accept' ? 'accepted' : 'declined',
          [action === 'accept' ? 'accepted_at' : 'declined_at']: new Date().toISOString(),
          accepted_by: action === 'accept' ? user?.id : null
        })
        .eq('id', offerId);

      if (error) throw error;

      toast.success(`Offer ${action}ed successfully`);
      fetchOffersAndApplications();
      setShowOfferDetails(false);
    } catch (error: any) {
      console.error(`Error ${action}ing offer:`, error);
      toast.error(`Failed to ${action} offer`);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'declined': return <XCircle className="h-4 w-4" />;
      case 'expired': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const pendingOffers = offers.filter(offer => offer.status === 'pending');
  const acceptedOffers = offers.filter(offer => offer.status === 'accepted');
  const declinedOffers = offers.filter(offer => offer.status === 'declined');

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading offers...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Loan Offers</h1>
          <p className="text-muted-foreground">Manage your loan offers and applications</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Offers</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOffers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted Offers</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{acceptedOffers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Offered Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              £{pendingOffers.reduce((sum, offer) => sum + offer.loan_amount, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Offers Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending Offers ({pendingOffers.length})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Accepted ({acceptedOffers.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            History ({declinedOffers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingOffers.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No pending offers</p>
                <p className="text-muted-foreground">
                  Your loan applications are being reviewed. You'll see offers here once they're ready.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {pendingOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onViewDetails={() => {
                    setSelectedOffer(offer);
                    setShowOfferDetails(true);
                  }}
                  onAccept={() => handleOfferAction(offer.id, 'accept')}
                  onDecline={() => handleOfferAction(offer.id, 'decline')}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          {acceptedOffers.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No accepted offers</p>
                <p className="text-muted-foreground">
                  Accepted offers will appear here and progress to contract generation.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {acceptedOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onViewDetails={() => {
                    setSelectedOffer(offer);
                    setShowOfferDetails(true);
                  }}
                  showActions={false}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {declinedOffers.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No declined offers</p>
                <p className="text-muted-foreground">
                  Your offer history will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {declinedOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onViewDetails={() => {
                    setSelectedOffer(offer);
                    setShowOfferDetails(true);
                  }}
                  showActions={false}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Offer Details Modal */}
      {selectedOffer && (
        <OfferDetailsModal
          offer={selectedOffer}
          open={showOfferDetails}
          onClose={() => setShowOfferDetails(false)}
          onAccept={() => handleOfferAction(selectedOffer.id, 'accept')}
          onDecline={() => handleOfferAction(selectedOffer.id, 'decline')}
          showActions={selectedOffer.status === 'pending'}
        />
      )}
    </div>
  );
};