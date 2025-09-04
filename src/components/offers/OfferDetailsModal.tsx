import React, { useState, useRef } from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  FileText,
  Maximize
} from 'lucide-react';
import { OfferDocument } from './OfferDocument';
import { LegalContract } from '@/components/contracts/LegalContract';
import { ContractSigningService } from '@/components/contracts/ContractSigningService';
import { PDFGenerator } from '@/utils/pdfGenerator';
import { toast } from 'sonner';

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [showContractSigning, setShowContractSigning] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

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

  const handleDownloadPDF = async () => {
    try {
      setDownloadingPDF(true);
      const element = document.getElementById('offer-document');
      
      if (!element) {
        toast.error('Document not found');
        return;
      }

      await PDFGenerator.generateOfferDocument(
        element,
        {
          loanAmount: offer.loan_amount,
          offerType: offer.offer_type,
          offerId: offer.id
        },
        {
          filename: `loan-offer-${offer.offer_type}-${offer.id.slice(0, 8)}.pdf`
        }
      );

      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setDownloadingPDF(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={isFullscreen ? "max-w-full max-h-full w-full h-full" : "max-w-6xl max-h-[90vh]"}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl flex items-center gap-3">
                <span>{formatCurrency(offer.loan_amount)}</span>
                <Badge variant="outline">{getOfferTypeDisplay(offer.offer_type)}</Badge>
              </DialogTitle>
              <DialogDescription>
                Professional loan agreement document with downloadable PDF
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                <Maximize className="h-4 w-4 mr-2" />
                {isFullscreen ? 'Exit' : 'Fullscreen'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPDF}
                disabled={downloadingPDF}
              >
                <Download className="h-4 w-4 mr-2" />
                {downloadingPDF ? 'Generating...' : 'Download PDF'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
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

            <Tabs defaultValue="document" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="document">
                  <FileText className="h-4 w-4 mr-2" />
                  Full Agreement
                </TabsTrigger>
                <TabsTrigger value="summary">Summary View</TabsTrigger>
              </TabsList>

              <TabsContent value="document" className="space-y-4">
                <OfferDocument
                  offer={offer}
                  borrowerInfo={{
                    name: 'Loan Applicant',
                    email: 'applicant@email.com'
                  }}
                  lenderInfo={{
                    name: 'TechScale Finance Ltd',
                    address: 'London, United Kingdom',
                    registration: 'TSF123456'
                  }}
                />
              </TabsContent>

              <TabsContent value="summary" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2 text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Loan Amount</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(offer.loan_amount)}</p>
                  </div>

                  {offer.apr_rate && (
                    <div className="space-y-2 text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">APR</p>
                      <p className="text-2xl font-bold text-primary">{offer.apr_rate}%</p>
                    </div>
                  )}

                  {offer.isa_percentage && (
                    <div className="space-y-2 text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Income Share</p>
                      <p className="text-2xl font-bold text-primary">{offer.isa_percentage}%</p>
                    </div>
                  )}

                  <div className="space-y-2 text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Term</p>
                    <p className="text-2xl font-bold text-primary">{offer.repayment_term_months}</p>
                    <p className="text-xs text-muted-foreground">months</p>
                  </div>

                  <div className="space-y-2 text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Grace Period</p>
                    <p className="text-2xl font-bold text-primary">{offer.grace_period_months}</p>
                    <p className="text-xs text-muted-foreground">months</p>
                  </div>
                </div>

                {/* Monthly Payment Highlight */}
                {offer.repayment_schedule?.monthlyPayment && (
                  <div className="text-center p-6 bg-primary/5 border border-primary/20 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Monthly Payment</p>
                    <p className="text-4xl font-bold text-primary mb-2">
                      {formatCurrency(offer.repayment_schedule.monthlyPayment)}
                    </p>
                    {offer.repayment_schedule.firstPaymentDate && (
                      <p className="text-sm text-muted-foreground">
                        Starting {new Date(offer.repayment_schedule.firstPaymentDate).toLocaleDateString('en-GB')}
                      </p>
                    )}
                  </div>
                )}

                {/* Quick Benefits */}
                {offer.terms_and_conditions?.benefits && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Key Benefits
                    </h4>
                    <ul className="space-y-2">
                      {offer.terms_and_conditions.benefits.slice(0, 4).map((benefit: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>

        {showActions && offer.status === 'pending' && !isExpired() && (
          <DialogFooter className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              disabled={downloadingPDF}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Agreement
            </Button>
            <Button variant="destructive" onClick={onDecline}>
              <XCircle className="h-4 w-4 mr-2" />
              Decline Offer
            </Button>
            <Button onClick={onAccept} className="bg-primary hover:bg-primary/90">
              <CheckCircle className="h-4 w-4 mr-2" />
              Accept Offer
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};