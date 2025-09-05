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
import { Separator } from '@/components/ui/separator';
import { InteractiveContract, InteractiveContractRef } from './InteractiveContract';
import MultiPartySignatureFlow from './MultiPartySignatureFlow';
import { DocumentDownloader } from '@/utils/documentDownloader';
import { DownloadMenu } from '@/components/ui/download-menu';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  FileText,
  Download,
  CheckCircle,
  User,
  PenTool,
  AlertTriangle,
  FileSignature,
  Shield
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
  { id: 2, title: 'Multi-Party Signing', description: 'Digital signature workflow', icon: FileSignature },
  { id: 3, title: 'Download & Complete', description: 'Download signed contract and complete', icon: Download }
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
  const [guarantorData, setGuarantorData] = useState<any>(null);
  const [contractSigned, setContractSigned] = useState(false);
  const [signatureData, setSignatureData] = useState<string>('');
  const [manualUploadData, setManualUploadData] = useState<any>(null);
  const [showSigningFlow, setShowSigningFlow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadingDocument, setDownloadingDocument] = useState(false);
  
  const interactiveContractRef = useRef<InteractiveContractRef>(null);

  const progress = (currentStep / steps.length) * 100;

  const handleBorrowerUpdate = (updatedBorrower: any) => {
    setBorrowerData(updatedBorrower);
  };

  const handleGuarantorUpdate = (updatedGuarantor: any) => {
    setGuarantorData(updatedGuarantor);
  };

  const handleSignatureComplete = (signature: string) => {
    setSignatureData(signature);
    setContractSigned(true);
    setCurrentStep(3);
    toast.success('Contract signed successfully!');
  };

  const handleManualUploadComplete = (uploadData: any) => {
    setManualUploadData(uploadData);
    setContractSigned(true);
    setCurrentStep(3);
    toast.success('Contract uploaded successfully!');
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Move to signature step
      setCurrentStep(2);
      setShowSigningFlow(true);
    } else if (currentStep === 2) {
      // Move to download step
      setCurrentStep(3);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      if (currentStep === 2) {
        setShowSigningFlow(false);
      }
    }
  };

  const handleSigningFlowComplete = () => {
    setShowSigningFlow(false);
    setContractSigned(true);
    setCurrentStep(3);
  };

  const handleDownloadDocument = async (format: 'png' | 'pdf' | 'docx' | 'jpg' | 'printpdf') => {
    const element = document.getElementById('interactive-contract');
    if (!element) {
      toast.error('Contract document not found');
      return;
    }

    try {
      setDownloadingDocument(true);
      
      const contractTitle = `Loan_Agreement_${offer.id?.slice(0, 8)}_Signed`;
      
      switch (format) {
        case 'png':
          await DocumentDownloader.downloadAsPNG(element, { filename: contractTitle });
          break;
        case 'jpg':
          await DocumentDownloader.downloadAsJPG(element, { filename: contractTitle });
          break;
        case 'pdf':
          await DocumentDownloader.downloadAsPDF(element, { filename: contractTitle });
          break;
        case 'docx':
          await DocumentDownloader.downloadAsDOCX(element, { filename: contractTitle });
          break;
        case 'printpdf':
          await DocumentDownloader.downloadAsPrintPDF(element, { filename: contractTitle });
          break;
      }
      
      toast.success(`Contract downloaded as ${format.toUpperCase()}`);
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error(`Failed to download as ${format.toUpperCase()}`);
    } finally {
      setDownloadingDocument(false);
    }
  };

  const handleAcceptOffer = async () => {
    try {
      setIsLoading(true);

      // Get the final contract data
      const contractState = interactiveContractRef.current?.getUpdatedData();
      
      if (!contractSigned) {
        toast.error('Please complete the contract signing process first');
        return;
      }

      // Update the loan offer to accepted
      const { error: offerError } = await supabase
        .from('loan_offers')
        .update({
          status: 'accepted',
          accepted_at: new Date().toISOString(),
          accepted_by: user?.id
        })
        .eq('id', offer.id);

      if (offerError) throw offerError;

      // Create notification
      await supabase
        .from('notifications')
        .insert({
          user_id: offer.user_id,
          title: 'Loan Agreement Executed',
          message: `Your loan agreement for £${offer.loan_amount?.toLocaleString('en-GB')} has been fully executed and is now active.`,
          type: 'contract_executed',
          data: {
            offer_id: offer.id,
            contract_id: offer.id,
            loan_amount: offer.loan_amount,
            signed_at: new Date().toISOString()
          }
        });

      toast.success('Loan agreement accepted and executed successfully!');
      onComplete();
      
    } catch (error: any) {
      console.error('Error accepting offer:', error);
      toast.error('Failed to complete offer acceptance');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Review and Edit Contract</h3>
              <p className="text-muted-foreground">
                Review the contract terms and edit any details as needed before proceeding to signature.
              </p>
            </div>

            <div id="interactive-contract">
              <InteractiveContract
                ref={interactiveContractRef}
                contract={{
                  id: offer.id,
                  contractType: 'Education Loan Agreement',
                  loanAmount: offer.loan_amount,
                  aprRate: offer.apr_rate,
                  repaymentTermMonths: offer.repayment_term_months,
                  monthlyPayment: offer.repayment_schedule?.monthlyPayment,
                  gracePeriodMonths: offer.grace_period_months,
                  requiresGuarantor: offer.requires_guarantor,
                  ...contractData
                }}
                borrower={borrowerData}
                lender={lenderData}
                guarantor={guarantorData}
                onBorrowerUpdate={handleBorrowerUpdate}
                onGuarantorUpdate={handleGuarantorUpdate}
                onSignatureComplete={handleSignatureComplete}
                onManualUploadComplete={handleManualUploadComplete}
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
                      <span>Status:</span>
                      <Badge variant="default">Fully Executed</Badge>
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
                    Please complete the signature process using the button below to proceed.
                  </p>
                </CardContent>
              </Card>
            )}

            <div id="interactive-contract-step2">
              <InteractiveContract
                ref={interactiveContractRef}
                contract={{
                  id: offer.id,
                  contractType: 'Education Loan Agreement',
                  loanAmount: offer.loan_amount,
                  aprRate: offer.apr_rate,
                  repaymentTermMonths: offer.repayment_term_months,
                  monthlyPayment: offer.repayment_schedule?.monthlyPayment,
                  gracePeriodMonths: offer.grace_period_months,
                  requiresGuarantor: offer.requires_guarantor,
                  ...contractData
                }}
                borrower={borrowerData}
                lender={lenderData}
                guarantor={guarantorData}
                onBorrowerUpdate={handleBorrowerUpdate}
                onGuarantorUpdate={handleGuarantorUpdate}
                onSignatureComplete={handleSignatureComplete}
                onManualUploadComplete={handleManualUploadComplete}
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
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Choose your preferred download format:
                    </p>
                    <DownloadMenu
                      onDownload={handleDownloadDocument}
                      loading={downloadingDocument}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Contract ID: {offer.id.slice(0, 8)}</p>
                    <p>Generated: {new Date().toLocaleDateString('en-GB')}</p>
                    {signatureData && (
                      <p>Digitally Signed: {new Date().toLocaleTimeString('en-GB')}</p>
                    )}
                    {manualUploadData && (
                      <p>Manual Upload: {manualUploadData.fileName}</p>
                    )}
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
    <>
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
              
              {currentStep === 2 && !contractSigned && (
                <Button 
                  onClick={() => setShowSigningFlow(true)}
                  className="flex items-center gap-2"
                >
                  <FileSignature className="h-4 w-4" />
                  Start Signing Process
                </Button>
              )}
              
              {currentStep < steps.length && currentStep !== 2 && (
                <Button 
                  onClick={handleNextStep}
                  disabled={!canProceedToNext() || isLoading}
                >
                  Next Step
                </Button>
              )}
              
              {currentStep === steps.length && (
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

      {/* Multi-Party Signature Flow */}
      {showSigningFlow && (
        <MultiPartySignatureFlow
          isOpen={showSigningFlow}
          onClose={() => setShowSigningFlow(false)}
          onComplete={handleSigningFlowComplete}
          contractId={offer.id}
          contractData={{
            loanAmount: offer.loan_amount,
            aprRate: offer.apr_rate,
            repaymentTermMonths: offer.repayment_term_months,
            monthlyPayment: offer.repayment_schedule?.monthlyPayment,
            gracePeriodMonths: offer.grace_period_months,
            requiresGuarantor: offer.requires_guarantor,
            ...contractData
          }}
          borrowerData={borrowerData}
          guarantorData={guarantorData}
        />
      )}
    </>
  );
};