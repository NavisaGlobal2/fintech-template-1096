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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { LegalContract } from './LegalContract';
import { PDFGenerator } from '@/utils/pdfGenerator';
import ESignature from '@/components/techscale/ESignature';
import {
  PenTool,
  FileText,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  Shield,
  Download,
  Eye,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { toast } from 'sonner';

interface ContractSigningServiceProps {
  contract: {
    id: string;
    user_id: string;
    application_id: string;
    offer_id: string;
    contract_type: string;
    contract_data: any;
    contract_pdf_url?: string;
    status: string;
    created_at: string;
    version: number;
  };
  borrowerInfo: {
    fullName: string;
    email: string;
    address: string;
    dateOfBirth?: string;
    nationalId?: string;
  };
  lenderInfo: {
    companyName: string;
    registeredAddress: string;
    registrationNumber: string;
    contactEmail: string;
    phoneNumber: string;
  };
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const ContractSigningService: React.FC<ContractSigningServiceProps> = ({
  contract,
  borrowerInfo,
  lenderInfo,
  open,
  onClose,
  onComplete
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [identityVerified, setIdentityVerified] = useState(false);
  const [signature, setSignature] = useState<string>('');
  const [showSignature, setShowSignature] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const contractRef = useRef<HTMLDivElement>(null);

  const steps = [
    { id: 1, title: 'Review Contract', description: 'Read and review all terms' },
    { id: 2, title: 'Identity Verification', description: 'Confirm your identity' },
    { id: 3, title: 'Digital Signature', description: 'Sign the agreement' },
    { id: 4, title: 'Completion', description: 'Contract execution complete' }
  ];

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSignatureComplete = async (signatureData: string) => {
    setSignature(signatureData.split(',')[1]); // Remove data URL prefix
    setShowSignature(false);
    toast.success('Signature captured successfully');
  };

  const handleDownloadContract = async () => {
    if (!contractRef.current) {
      toast.error('Contract not available for download');
      return;
    }

    try {
      const contractData = {
        ...contract.contract_data,
        contractType: contract.contract_type,
        id: contract.id,
        createdAt: contract.created_at,
        offerValidUntil: contract.contract_data.offerValidUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };

      await PDFGenerator.downloadFromElement(contractRef.current, {
        filename: `contract-${contract.contract_type}-${contract.id.slice(0, 8)}.pdf`,
        format: 'a4',
        orientation: 'portrait',
        quality: 2
      });

      toast.success('Contract downloaded successfully');
    } catch (error) {
      console.error('Error downloading contract:', error);
      toast.error('Failed to download contract');
    }
  };

  const handleCompleteSignature = async () => {
    if (!signature) {
      toast.error('Please provide your digital signature');
      return;
    }

    try {
      setLoading(true);

      // Record signature data
      const signatureData = {
        borrowerSignature: signature,
        signedDate: new Date().toISOString(),
        ipAddress: '127.0.0.1', // In production, get real IP
        userAgent: navigator.userAgent
      };

      // Update contract with signature
      const { error: contractError } = await supabase
        .from('loan_contracts')
        .update({
          status: 'signed',
          signed_at: new Date().toISOString(),
          contract_data: {
            ...contract.contract_data,
            signatureData
          }
        })
        .eq('id', contract.id);

      if (contractError) throw contractError;

      // Create signature record
      const { error: signatureError } = await supabase
        .from('contract_signatures')
        .insert({
          contract_id: contract.id,
          signer_id: user?.id,
          signer_email: borrowerInfo.email,
          signer_name: borrowerInfo.fullName,
          signer_type: 'borrower',
          signature_data: signature,
          signed_at: new Date().toISOString(),
          status: 'signed',
          ip_address: '127.0.0.1',
          user_agent: navigator.userAgent
        });

      if (signatureError) console.warn('Signature record error:', signatureError);

      setCurrentStep(4);
      toast.success('Contract signed successfully!');
      
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error: any) {
      console.error('Error signing contract:', error);
      toast.error('Failed to sign contract');
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

  const renderStepContent = () => {
    const contractData = {
      ...contract.contract_data,
      contractType: contract.contract_type,
      id: contract.id,
      createdAt: contract.created_at,
      offerValidUntil: contract.contract_data.offerValidUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Review Legal Contract</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadContract}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="contract" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="contract">Full Agreement</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                </TabsList>

                <TabsContent value="contract">
                  <ScrollArea className={`border border-border rounded-lg ${isFullscreen ? 'h-[70vh]' : 'h-[50vh]'}`}>
                    <LegalContract
                      ref={contractRef}
                      contract={contractData}
                      borrower={borrowerInfo}
                      lender={lenderInfo}
                      className="p-6"
                    />
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="summary">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Contract Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Loan Amount</p>
                          <p className="text-lg font-semibold">
                            {formatCurrency(contractData.loanAmount)}
                          </p>
                        </div>
                        {contractData.aprRate && (
                          <div>
                            <p className="text-sm text-muted-foreground">APR</p>
                            <p className="text-lg font-semibold">{contractData.aprRate}%</p>
                          </div>
                        )}
                        {contractData.isaPercentage && (
                          <div>
                            <p className="text-sm text-muted-foreground">Income Share</p>
                            <p className="text-lg font-semibold">{contractData.isaPercentage}%</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-muted-foreground">Term</p>
                          <p className="text-lg font-semibold">
                            {contractData.repaymentTermMonths} months
                          </p>
                        </div>
                      </div>
                      
                      <Separator />

                      <div className="space-y-2">
                        <h4 className="font-semibold">Key Terms:</h4>
                        <ul className="text-sm space-y-1 ml-4">
                          <li>• Grace period of {contractData.gracePeriodMonths} months</li>
                          <li>• Monthly payments commence after grace period</li>
                          <li>• Electronic signature legally binding</li>
                          <li>• Governed by laws of England and Wales</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="agreement" 
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked as boolean)}
                  />
                  <label htmlFor="agreement" className="text-sm">
                    I have carefully read and understood all terms and conditions of this legal contract. 
                    I acknowledge that this is a binding legal agreement and agree to all provisions, 
                    including repayment obligations, interest rates, and all other terms outlined herein.
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Identity Verification</h3>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Confirm Your Identity
                  </CardTitle>
                  <CardDescription>
                    Verify your identity details before executing the legal contract.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Signing Party</p>
                        <p className="font-medium">{borrowerInfo.fullName}</p>
                        <p className="text-sm text-muted-foreground">{borrowerInfo.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Contract Execution Date</p>
                        <p className="font-medium">
                          {new Date().toLocaleDateString('en-GB', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="identity" 
                        checked={identityVerified}
                        onCheckedChange={(checked) => setIdentityVerified(checked as boolean)}
                      />
                      <label htmlFor="identity" className="text-sm">
                        I hereby confirm that I am <strong>{borrowerInfo.fullName}</strong>, the person 
                        authorized to execute this contract. I represent that I have the legal capacity 
                        to enter into this binding agreement and that all information provided is true, 
                        accurate, and complete.
                      </label>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                      <p className="text-sm text-amber-800">
                        <strong>Legal Notice:</strong> Providing false information or signing on behalf 
                        of another person may constitute fraud and is subject to legal penalties.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Execute Legal Contract</h3>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PenTool className="h-5 w-5" />
                    Digital Signature Required
                  </CardTitle>
                  <CardDescription>
                    Provide your legally binding digital signature to execute this contract.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    {signature ? (
                      <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-green-800">Signature Captured</span>
                          </div>
                          <div className="h-24 bg-white border border-green-300 rounded flex items-center justify-center">
                            <img 
                              src={`data:image/png;base64,${signature}`} 
                              alt="Your Signature" 
                              className="max-h-full"
                            />
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowSignature(true)}
                        >
                          Update Signature
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="h-24 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center bg-muted/20">
                          <p className="text-muted-foreground">No signature provided</p>
                        </div>
                        <Button onClick={() => setShowSignature(true)}>
                          <PenTool className="h-4 w-4 mr-2" />
                          Provide Signature
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                      <div className="text-sm text-red-800">
                        <p className="font-medium mb-1">BINDING LEGAL AGREEMENT</p>
                        <p>
                          By providing your digital signature, you are creating a legally binding contract. 
                          This signature carries the same legal weight as a handwritten signature and makes 
                          you fully responsible for all obligations under this agreement.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 text-center">
            <div className="space-y-4">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              <h3 className="text-2xl font-semibold text-green-800">Contract Executed Successfully!</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your legal contract has been digitally signed and is now in full force and effect. 
                Both parties are legally bound by the terms and conditions outlined in the agreement.
              </p>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Contract Reference</p>
                    <p className="font-mono text-sm">TSF-{contract.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-sm text-muted-foreground">Executed on</p>
                    <p className="font-medium">
                      {new Date().toLocaleDateString('en-GB', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  A signed copy of this contract will be sent to your registered email address. 
                  Please keep this document for your records.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return agreed;
      case 2:
        return identityVerified;
      case 3:
        return signature.length > 0;
      default:
        return true;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className={`max-w-6xl ${isFullscreen ? 'max-h-[95vh]' : 'max-h-[90vh]'} overflow-hidden`}>
          <DialogHeader>
            <DialogTitle className="text-2xl">Legal Contract Execution</DialogTitle>
            <DialogDescription>
              Execute your loan agreement through our secure digital signing process
            </DialogDescription>
          </DialogHeader>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Step {currentStep} of {steps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Steps Indicator */}
          <div className="flex justify-between">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center space-y-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.id === currentStep ? 'bg-primary text-primary-foreground' :
                  step.id < currentStep ? 'bg-green-500 text-white' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {step.id < currentStep ? <CheckCircle className="h-4 w-4" /> : step.id}
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className={`overflow-y-auto ${isFullscreen ? 'min-h-[60vh]' : 'min-h-[40vh]'}`}>
            {renderStepContent()}
          </div>

          {/* Footer */}
          {currentStep < 4 && (
            <DialogFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={currentStep === 1 ? onClose : handleBack}
                disabled={loading}
              >
                {currentStep === 1 ? 'Cancel' : 'Back'}
              </Button>
              
              {currentStep < 3 ? (
                <Button 
                  onClick={handleNext}
                  disabled={!canProceed()}
                >
                  Continue
                </Button>
              ) : (
                <Button 
                  onClick={handleCompleteSignature}
                  disabled={!canProceed() || loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Executing Contract...' : 'Execute Contract'}
                </Button>
              )}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Signature Modal */}
      {showSignature && (
        <ESignature
          onComplete={handleSignatureComplete}
          onCancel={() => setShowSignature(false)}
        />
      )}
    </>
  );
};