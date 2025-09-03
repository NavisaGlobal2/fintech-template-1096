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
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  PenTool,
  FileText,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

interface ContractSigningFlowProps {
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
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const ContractSigningFlow: React.FC<ContractSigningFlowProps> = ({
  contract,
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const steps = [
    { id: 1, title: 'Review Contract', description: 'Review all terms and conditions' },
    { id: 2, title: 'Identity Verification', description: 'Confirm your identity' },
    { id: 3, title: 'Digital Signature', description: 'Provide your digital signature' },
    { id: 4, title: 'Completion', description: 'Contract signing completed' }
  ];

  const progress = (currentStep / steps.length) * 100;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    // Convert canvas to base64
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL();
      setSignature(dataURL.split(',')[1]); // Remove data:image/png;base64, prefix
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignature('');
      }
    }
  };

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

  const handleCompleteSignature = async () => {
    if (!signature) {
      toast.error('Please provide your digital signature');
      return;
    }

    try {
      setLoading(true);

      // Update contract signature
      const { error: signatureError } = await supabase
        .from('contract_signatures')
        .update({
          signature_data: signature,
          signed_at: new Date().toISOString(),
          status: 'signed',
          ip_address: '127.0.0.1', // In production, get real IP
          user_agent: navigator.userAgent
        })
        .eq('contract_id', contract.id)
        .eq('signer_id', user?.id);

      if (signatureError) throw signatureError;

      // Update contract status
      const { error: contractError } = await supabase
        .from('loan_contracts')
        .update({
          status: 'signed',
          signed_at: new Date().toISOString()
        })
        .eq('id', contract.id);

      if (contractError) throw contractError;

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
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Review Contract Terms</h3>
              
              {/* Contract Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Loan Agreement Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contract.contract_data && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Loan Amount</p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(contract.contract_data.loanAmount)}
                        </p>
                      </div>
                      {contract.contract_data.aprRate && (
                        <div>
                          <p className="text-sm text-muted-foreground">APR</p>
                          <p className="text-lg font-semibold">{contract.contract_data.aprRate}%</p>
                        </div>
                      )}
                      {contract.contract_data.repaymentSchedule?.monthlyPayment && (
                        <div>
                          <p className="text-sm text-muted-foreground">Monthly Payment</p>
                          <p className="text-lg font-semibold">
                            {formatCurrency(contract.contract_data.repaymentSchedule.monthlyPayment)}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground">Term</p>
                        <p className="text-lg font-semibold">
                          {contract.contract_data.repaymentTermMonths} months
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Agreement Checkbox */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="agreement" 
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked as boolean)}
                  />
                  <label htmlFor="agreement" className="text-sm">
                    I have read and understood all terms and conditions of this loan agreement. 
                    I agree to the repayment schedule, interest rates, and all other conditions 
                    outlined in this contract.
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
                    Verify Your Identity
                  </CardTitle>
                  <CardDescription>
                    Confirm your identity details before signing the contract.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Signing as</p>
                        <p className="font-medium">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Signing date</p>
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
                        I confirm that I am the person authorized to sign this contract and that 
                        all information provided is accurate and complete.
                      </label>
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
              <h3 className="text-xl font-semibold">Digital Signature</h3>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PenTool className="h-5 w-5" />
                    Provide Your Signature
                  </CardTitle>
                  <CardDescription>
                    Sign in the box below to complete the contract signing process.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-muted rounded-lg p-4">
                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={150}
                      className="w-full border border-border rounded cursor-crosshair"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      style={{ touchAction: 'none' }}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-muted-foreground">
                        Sign above using your mouse or touchpad
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={clearSignature}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>

                  {signature && (
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-800">Signature captured successfully</span>
                      </div>
                    </div>
                  )}

                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium mb-1">Legal Notice</p>
                        <p>
                          By providing your digital signature, you are legally bound to this contract. 
                          This signature has the same legal effect as a handwritten signature.
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
              <h3 className="text-2xl font-semibold text-green-800">Contract Signed Successfully!</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your loan contract has been signed and is now legally binding. 
                You will receive a copy via email shortly.
              </p>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Contract ID</p>
                    <p className="font-mono text-sm">{contract.id}</p>
                    <p className="text-sm text-muted-foreground">Signed on</p>
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl">Contract Signing</DialogTitle>
          <DialogDescription>
            Complete the digital signing process for your loan contract
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
        <div className="min-h-[400px] overflow-y-auto">
          {renderStepContent()}
        </div>

        {/* Footer */}
        {currentStep < 4 && (
          <DialogFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={currentStep === 1 ? onClose : handleBack}
            >
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </Button>
            
            {currentStep === 3 ? (
              <Button 
                onClick={handleCompleteSignature} 
                disabled={!canProceed() || loading}
              >
                {loading ? 'Signing...' : 'Complete Signature'}
              </Button>
            ) : (
              <Button 
                onClick={handleNext} 
                disabled={!canProceed()}
              >
                Next
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};