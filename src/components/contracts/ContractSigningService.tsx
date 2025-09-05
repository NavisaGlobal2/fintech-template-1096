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
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InteractiveContract, InteractiveContractRef } from './InteractiveContract';
import { PDFGenerator } from '@/utils/pdfGenerator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  FileText,
  Download,
  CheckCircle,
  User,
  PenTool,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

interface ContractSigningServiceProps {
  offer: any;
  contractData: any;
  borrowerData: any;
  lenderData: any;
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const steps = [
  { id: 1, title: 'Review & Edit', description: 'Review contract and edit details', icon: FileText },
  { id: 2, title: 'Sign Contract', description: 'Provide digital signature', icon: PenTool },
  { id: 3, title: 'Download & Complete', description: 'Download signed contract', icon: Download }
];

export const ContractSigningService: React.FC<ContractSigningServiceProps> = ({
  offer,
  contractData,
  borrowerData: initialBorrowerData,
  lenderData,
  open,
  onClose,
  onComplete
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [borrowerData, setBorrowerData] = useState(initialBorrowerData);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [signatureData, setSignatureData] = useState<string>('');
  const [contractSigned, setContractSigned] = useState(false);
  const interactiveContractRef = useRef<InteractiveContractRef>(null);

  const progress = (currentStep / steps.length) * 100;

  const handleBorrowerUpdate = (updatedBorrower: any) => {
    setBorrowerData(updatedBorrower);
  };

  const handleSignatureComplete = (signature: string) => {
    setSignatureData(signature);
    setContractSigned(true);
    setCurrentStep(2);
    toast.success('Contract signed successfully!');
  };

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloadingPDF(true);
      const element = document.getElementById('interactive-contract');
      
      if (!element) {
        toast.error('Contract document not found');
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
          filename: `signed-education-loan-agreement-${offer.id.slice(0, 8)}.pdf`
        }
      );

      toast.success('Signed contract PDF downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setDownloadingPDF(false);
    }
  };

  const handleAcceptOffer = async () => {
    try {
      setIsLoading(true);

      // Get the final contract data
      const contractState = interactiveContractRef.current?.getUpdatedData();
      
      if (!contractState?.isSigned) {
        toast.error('Please sign the contract before accepting the offer');
        return;
      }

      // Update the offer status
      const { error: offerError } = await supabase
        .from('loan_offers')
        .update({
          status: 'accepted',
          accepted_at: new Date().toISOString(),
          accepted_by: user?.id
        })
        .eq('id', offer.id);

      if (offerError) throw offerError;

      // Create or update contract record
      const { error: contractError } = await supabase
        .from('loan_contracts')
        .upsert({
          user_id: user?.id,
          offer_id: offer.id,
          application_id: offer.application_id,
          contract_type: 'education_loan',
          status: 'signed',
          contract_data: {
            ...contractData,
            borrower: contractState.borrower,
            signatureData: contractState.signatureData,
            signedAt: new Date().toISOString()
          },
          signed_at: new Date().toISOString()
        });

      if (contractError) throw contractError;

      toast.success('Offer accepted and contract signed successfully!');
      onComplete();
    } catch (error) {
      console.error('Error accepting offer:', error);
      toast.error('Failed to accept offer');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Review Your Contract</h4>
                  <p className="text-sm text-blue-800">
                    Please review all terms and conditions. You can edit your address or personal details by clicking the "Edit Address" button.
                  </p>
                </div>
              </div>
            </div>

            <div id="interactive-contract">
              <InteractiveContract
                ref={interactiveContractRef}
                contract={contractData}
                borrower={borrowerData}
                lender={lenderData}
                onBorrowerUpdate={handleBorrowerUpdate}
                onSignatureComplete={handleSignatureComplete}
                className="border rounded-lg"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {contractSigned ? (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Contract Successfully Signed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-700 mb-4">
                    Your contract has been digitally signed and is now legally binding.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Signed by:</span>
                      <span className="font-medium">{borrowerData.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date & Time:</span>
                      <span className="font-medium">{new Date().toLocaleString('en-GB')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IP Address:</span>
                      <span className="font-medium">[Recorded]</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-orange-800 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Signature Required
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-700">
                    Please go back to step 1 and sign the contract by clicking the "Sign Contract" button.
                  </p>
                </CardContent>
              </Card>
            )}

            <div id="interactive-contract-step2">
              <InteractiveContract
                ref={interactiveContractRef}
                contract={contractData}
                borrower={borrowerData}
                lender={lenderData}
                onBorrowerUpdate={handleBorrowerUpdate}
                onSignatureComplete={handleSignatureComplete}
                className="border rounded-lg"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <div>
              <h3 className="text-2xl font-semibold text-green-800 mb-2">Contract Ready for Download</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your signed contract is ready. Download a copy for your records and complete the offer acceptance.
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Button
                    onClick={handleDownloadPDF}
                    disabled={downloadingPDF}
                    className="w-full"
                    size="lg"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    {downloadingPDF ? 'Generating PDF...' : 'Download Signed Contract'}
                  </Button>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>Contract ID: {offer.id}</p>
                    <p>Generated: {new Date().toLocaleDateString('en-GB')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return true; // Can always proceed from review
      case 2:
        return contractSigned; // Must be signed to proceed
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <span>Sign Loan Agreement</span>
            <Badge variant="outline">
              £{offer.loan_amount?.toLocaleString('en-GB')}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Review, edit, and digitally sign your education loan contract
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Step {currentStep} of {steps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
          
          {/* Steps */}
          <div className="flex justify-between">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex flex-col items-center space-y-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.id === currentStep ? 'bg-primary text-primary-foreground' :
                    step.id < currentStep ? 'bg-green-500 text-white' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {step.id < currentStep ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[60vh]">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button 
                variant="outline" 
                onClick={handlePreviousStep}
                disabled={isLoading}
              >
                Previous
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            
            {currentStep < steps.length ? (
              <Button 
                onClick={handleNextStep}
                disabled={!canProceedToNext() || isLoading}
              >
                Next Step
              </Button>
            ) : (
              <Button 
                onClick={handleAcceptOffer}
                disabled={!contractSigned || isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isLoading ? 'Processing...' : 'Accept Offer & Complete'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};