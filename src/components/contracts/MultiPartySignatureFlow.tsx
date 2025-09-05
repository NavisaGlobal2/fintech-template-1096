import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  FileSignature,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Users,
  Shield,
  ArrowRight
} from 'lucide-react';
import ESignature from '@/components/techscale/ESignature';
import SignatureStatusTracker from './SignatureStatusTracker';
import { SignatureWorkflowManager, ContractWorkflowState } from '@/utils/signatureWorkflow';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface MultiPartySignatureFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  contractId: string;
  contractData: any;
  borrowerData: any;
  guarantorData?: any;
}

const MultiPartySignatureFlow: React.FC<MultiPartySignatureFlowProps> = ({
  isOpen,
  onClose,
  onComplete,
  contractId,
  contractData,
  borrowerData,
  guarantorData
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<'review' | 'sign' | 'complete'>('review');
  const [workflowState, setWorkflowState] = useState<ContractWorkflowState | null>(null);
  const [showSignature, setShowSignature] = useState(false);
  const [signingAsType, setSigningAsType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [permissionsChecked, setPermissionsChecked] = useState(false);
  const [canSign, setCanSign] = useState(false);
  const [permissionReason, setPermissionReason] = useState<string>('');

  // Check permissions when component loads
  useEffect(() => {
    if (isOpen && contractId && user?.id && !permissionsChecked) {
      checkSignaturePermissions();
    }
  }, [isOpen, contractId, user?.id, permissionsChecked]);

  const checkSignaturePermissions = async () => {
    if (!user?.id) return;
    
    try {
      const permissions = await SignatureWorkflowManager.checkSignaturePermissions(
        contractId,
        user.id
      );
      
      setCanSign(permissions.canSign);
      setSigningAsType(permissions.signerType);
      setPermissionReason(permissions.reason || '');
      setPermissionsChecked(true);
    } catch (error: any) {
      console.error('Error checking permissions:', error);
      toast.error('Failed to check signature permissions');
      setPermissionReason('Unable to verify permissions');
      setPermissionsChecked(true);
    }
  };

  const handleWorkflowUpdate = (state: ContractWorkflowState) => {
    setWorkflowState(state);
    
    if (state.is_complete) {
      setCurrentStep('complete');
    }
  };

  const handleStartSigning = async () => {
    if (!canSign || !user?.id) {
      toast.error(permissionReason || 'You cannot sign at this time');
      return;
    }

    // Initialize signatures if needed
    if (!workflowState?.signatures.length) {
      try {
        setLoading(true);
        
        await SignatureWorkflowManager.initializeContractSignatures(
          contractId,
          borrowerData.userId || user.id,
          borrowerData.fullName || borrowerData.firstName + ' ' + borrowerData.lastName,
          borrowerData.email || user.email || '',
          guarantorData ? {
            id: guarantorData.userId || 'temp-guarantor-id',
            name: guarantorData.fullName || guarantorData.name || 'Guarantor',
            email: guarantorData.email || ''
          } : undefined
        );
        
        // Refresh workflow state
        const updatedState = await SignatureWorkflowManager.getContractWorkflowState(contractId);
        setWorkflowState(updatedState);
        
        toast.success('Signature workflow initialized');
      } catch (error: any) {
        console.error('Error initializing signatures:', error);
        toast.error('Failed to initialize signature workflow');
        return;
      } finally {
        setLoading(false);
      }
    }

    setShowSignature(true);
  };

  const handleSignatureComplete = async (signatureData: string) => {
    if (!user?.id || !signingAsType) {
      toast.error('Unable to record signature');
      return;
    }

    try {
      setLoading(true);
      
      // Record the signature
      await SignatureWorkflowManager.recordSignature(
        contractId,
        user.id,
        signingAsType as 'borrower' | 'guarantor' | 'witness',
        signatureData.split(',')[1] // Remove data URL prefix
      );

      // Refresh workflow state
      const updatedState = await SignatureWorkflowManager.getContractWorkflowState(contractId);
      setWorkflowState(updatedState);
      
      setShowSignature(false);
      setCurrentStep('complete');
      
      if (updatedState.is_complete) {
        toast.success('Contract fully signed and complete!');
        setTimeout(() => {
          onComplete();
        }, 1500);
      } else {
        toast.success('Your signature has been recorded');
      }
    } catch (error: any) {
      console.error('Error recording signature:', error);
      toast.error('Failed to record signature');
    } finally {
      setLoading(false);
    }
  };

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Review Contract Details</h3>
        <p className="text-muted-foreground">
          Please review the contract details below before proceeding with the signature.
        </p>
      </div>

      {/* Contract Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature className="h-5 w-5" />
            Contract Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Loan Amount</p>
              <p className="text-lg font-semibold">
                £{contractData.loanAmount?.toLocaleString('en-GB')}
              </p>
            </div>
            {contractData.aprRate && (
              <div>
                <p className="text-sm text-muted-foreground">APR</p>
                <p className="text-lg font-semibold">{contractData.aprRate}%</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Term</p>
              <p className="text-lg font-semibold">{contractData.repaymentTermMonths} months</p>
            </div>
            {contractData.monthlyPayment && (
              <div>
                <p className="text-sm text-muted-foreground">Monthly Payment</p>
                <p className="text-lg font-semibold">
                  £{contractData.monthlyPayment?.toLocaleString('en-GB')}
                </p>
              </div>
            )}
          </div>
          
          {guarantorData && (
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-2">Guarantor Required</p>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>{guarantorData.fullName || guarantorData.name}</span>
                <span className="text-muted-foreground">({guarantorData.relationship})</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Signature Status */}
      <SignatureStatusTracker
        contractId={contractId}
        onWorkflowUpdate={handleWorkflowUpdate}
      />

      {/* Permissions Status */}
      {permissionsChecked && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Your Signing Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {canSign ? (
              <div className="flex items-start gap-2 text-green-800 bg-green-50 p-3 rounded-lg">
                <CheckCircle className="h-4 w-4 mt-0.5" />
                <div>
                  <p className="font-medium">Ready to Sign</p>
                  <p className="text-sm">
                    You can sign this contract as {signingAsType?.toLowerCase()}.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-amber-800 bg-amber-50 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4 mt-0.5" />
                <div>
                  <p className="font-medium">Cannot Sign Yet</p>
                  <p className="text-sm">{permissionReason}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderCompleteStep = () => (
    <div className="space-y-6 text-center">
      <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
      
      <div>
        <h3 className="text-2xl font-semibold text-green-800 mb-2">
          {workflowState?.is_complete ? 'Contract Fully Signed!' : 'Signature Recorded'}
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          {workflowState?.is_complete 
            ? 'All required signatures have been collected. The contract is now legally binding.'
            : 'Your signature has been recorded. Waiting for other parties to complete signing.'
          }
        </p>
      </div>

      <SignatureStatusTracker
        contractId={contractId}
        onWorkflowUpdate={handleWorkflowUpdate}
      />

      {workflowState?.is_complete && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Contract ID</p>
              <p className="font-mono text-sm">{contractId.slice(0, 8)}</p>
              <p className="text-sm text-muted-foreground">Completed on</p>
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
      )}
    </div>
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <FileSignature className="h-6 w-6" />
              Contract Signing
              {workflowState && (
                <Badge variant={workflowState.is_complete ? "default" : "secondary"}>
                  {Math.round(workflowState.completion_percentage)}% Complete
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto max-h-[70vh] py-4">
            {currentStep === 'review' && renderReviewStep()}
            {currentStep === 'complete' && renderCompleteStep()}
          </div>

          <Separator />

          <div className="flex justify-between items-center pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            
            {currentStep === 'review' && canSign && (
              <Button
                onClick={handleStartSigning}
                disabled={loading || !permissionsChecked}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Clock className="h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <FileSignature className="h-4 w-4" />
                    Sign Contract
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
            
            {currentStep === 'complete' && workflowState?.is_complete && (
              <Button
                onClick={onComplete}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Continue
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Digital Signature Modal */}
      {showSignature && (
        <ESignature
          onComplete={handleSignatureComplete}
          onCancel={() => setShowSignature(false)}
        />
      )}
    </>
  );
};

export default MultiPartySignatureFlow;