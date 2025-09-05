import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  CheckCircle,
  Clock,
  User,
  Users,
  AlertCircle,
  FileSignature
} from 'lucide-react';
import { SignatureWorkflowManager, ContractWorkflowState, SignatureRecord } from '@/utils/signatureWorkflow';
import { toast } from 'sonner';

interface SignatureStatusTrackerProps {
  contractId: string;
  className?: string;
  onWorkflowUpdate?: (state: ContractWorkflowState) => void;
}

const SignatureStatusTracker: React.FC<SignatureStatusTrackerProps> = ({
  contractId,
  className,
  onWorkflowUpdate
}) => {
  const [workflowState, setWorkflowState] = useState<ContractWorkflowState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWorkflowState = async () => {
    try {
      setLoading(true);
      setError(null);
      const state = await SignatureWorkflowManager.getContractWorkflowState(contractId);
      setWorkflowState(state);
      onWorkflowUpdate?.(state);
    } catch (err: any) {
      console.error('Error loading workflow state:', err);
      setError(err.message || 'Failed to load signature status');
      toast.error('Failed to load signature status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contractId) {
      loadWorkflowState();
    }
  }, [contractId]);

  const getSignerInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getSignerTypeIcon = (signerType: string) => {
    switch (signerType) {
      case 'borrower':
        return <User className="h-4 w-4" />;
      case 'guarantor':
        return <Users className="h-4 w-4" />;
      case 'witness':
        return <FileSignature className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const formatSignerType = (signerType: string): string => {
    return signerType.charAt(0).toUpperCase() + signerType.slice(1);
  };

  const renderSignatureItem = (signature: SignatureRecord) => {
    const statusInfo = SignatureWorkflowManager.formatSignatureStatus(signature.status);
    const isNext = workflowState?.next_required_signature?.id === signature.id;

    return (
      <div
        key={signature.id}
        className={`flex items-center gap-3 p-3 rounded-lg border ${
          isNext ? 'border-blue-200 bg-blue-50' : 'border-border'
        }`}
      >
        <Avatar className="h-10 w-10">
          <AvatarFallback className={`text-sm font-medium ${
            signature.status === 'signed' ? 'bg-green-100 text-green-700' :
            isNext ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
          }`}>
            {getSignerInitials(signature.signer_name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {getSignerTypeIcon(signature.signer_type)}
            <span className="font-medium text-sm truncate">
              {signature.signer_name}
            </span>
            <Badge variant={statusInfo.color as any}>
              {statusInfo.label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {formatSignerType(signature.signer_type)} • {signature.signer_email}
          </p>
          {signature.signed_at && (
            <p className="text-xs text-muted-foreground">
              Signed on {new Date(signature.signed_at).toLocaleDateString('en-GB')} at{' '}
              {new Date(signature.signed_at).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          )}
        </div>

        <div className="flex items-center">
          {signature.status === 'signed' ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : isNext ? (
            <div className="flex items-center gap-1 text-blue-600">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium">Next</span>
            </div>
          ) : (
            <Clock className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature className="h-5 w-5" />
            Signature Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !workflowState) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Signature Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error || 'Failed to load signature status'}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const workflowStatusInfo = SignatureWorkflowManager.formatWorkflowStatus(
    workflowState.workflow_status
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSignature className="h-5 w-5" />
            Signature Status
          </div>
          <Badge variant={workflowStatusInfo.color as any}>
            {workflowStatusInfo.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Completion Progress</span>
            <span>{Math.round(workflowState.completion_percentage)}%</span>
          </div>
          <Progress
            value={workflowState.completion_percentage}
            className="h-2"
          />
        </div>

        {/* Signature List */}
        <div className="space-y-3">
          {workflowState.signatures.map(renderSignatureItem)}
        </div>

        {/* Next Action */}
        {!workflowState.is_complete && workflowState.next_required_signature && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Waiting for Signature</p>
                <p>
                  {workflowState.next_required_signature.signer_name} needs to sign next as{' '}
                  {formatSignerType(workflowState.next_required_signature.signer_type).toLowerCase()}.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Completion Message */}
        {workflowState.is_complete && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">Contract Fully Signed</p>
                <p>All required signatures have been collected. The contract is now legally binding.</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SignatureStatusTracker;