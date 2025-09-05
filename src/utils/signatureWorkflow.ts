import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SignatureRecord {
  id: string;
  contract_id: string;
  signer_id: string;
  signer_type: string;
  signer_name: string;
  signer_email: string;
  status: string;
  workflow_step: number;
  signed_at?: string;
  signature_data?: string;
  signature_completed: boolean;
}

export interface ContractWorkflowState {
  contract_id: string;
  workflow_status: string;
  requires_guarantor: boolean;
  signatures: SignatureRecord[];
  next_required_signature?: SignatureRecord;
  is_complete: boolean;
  completion_percentage: number;
}

export class SignatureWorkflowManager {
  
  static async initializeContractSignatures(
    contractId: string,
    borrowerId: string,
    borrowerName: string,
    borrowerEmail: string,
    guarantorData?: {
      id: string;
      name: string;
      email: string;
    }
  ): Promise<void> {
    try {
      const { error } = await supabase.rpc('initialize_contract_signatures', {
        contract_id_param: contractId,
        borrower_id: borrowerId,
        borrower_name: borrowerName,
        borrower_email: borrowerEmail,
        guarantor_id: guarantorData?.id || null,
        guarantor_name: guarantorData?.name || null,
        guarantor_email: guarantorData?.email || null
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error initializing contract signatures:', error);
      throw new Error('Failed to initialize signature workflow');
    }
  }

  static async getContractWorkflowState(contractId: string): Promise<ContractWorkflowState> {
    try {
      // Get contract info
      const { data: contract, error: contractError } = await supabase
        .from('loan_contracts')
        .select('signature_workflow_status, contract_data')
        .eq('id', contractId)
        .single();

      if (contractError) throw contractError;

      // Get signatures
      const { data: signatures, error: signaturesError } = await supabase
        .from('contract_signatures')
        .select('*')
        .eq('contract_id', contractId)
        .order('workflow_step');

      if (signaturesError) throw signaturesError;

      const requiresGuarantor = (contract.contract_data as any)?.requiresGuarantor || false;
      const signatureRecords: SignatureRecord[] = signatures || [];
      
      // Find next required signature
      const nextRequired = signatureRecords.find(sig => 
        sig.status === 'pending' && 
        (sig.workflow_step === 1 || 
         (sig.workflow_step === 2 && signatureRecords.some(s => s.workflow_step === 1 && s.status === 'signed')))
      );

      // Calculate completion
      const totalRequired = requiresGuarantor ? 2 : 1;
      const completed = signatureRecords.filter(sig => sig.status === 'signed').length;
      const completionPercentage = (completed / totalRequired) * 100;
      const isComplete = completed === totalRequired;

      return {
        contract_id: contractId,
        workflow_status: contract.signature_workflow_status,
        requires_guarantor: requiresGuarantor,
        signatures: signatureRecords,
        next_required_signature: nextRequired,
        is_complete: isComplete,
        completion_percentage: completionPercentage
      };
    } catch (error: any) {
      console.error('Error getting contract workflow state:', error);
      throw new Error('Failed to get workflow state');
    }
  }

  static async recordSignature(
    contractId: string,
    signerId: string,
    signerType: 'borrower' | 'guarantor' | 'witness',
    signatureData: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('contract_signatures')
        .update({
          signature_data: signatureData,
          signed_at: new Date().toISOString(),
          status: 'signed',
          signature_completed: true,
          ip_address: '127.0.0.1', // In production, get real IP
          user_agent: navigator.userAgent
        })
        .eq('contract_id', contractId)
        .eq('signer_id', signerId)
        .eq('signer_type', signerType);

      if (error) throw error;

      toast.success(`${signerType.charAt(0).toUpperCase() + signerType.slice(1)} signature recorded successfully`);
    } catch (error: any) {
      console.error('Error recording signature:', error);
      throw new Error('Failed to record signature');
    }
  }

  static async checkSignaturePermissions(
    contractId: string,
    userId: string
  ): Promise<{
    canSign: boolean;
    signerType: string | null;
    reason?: string;
  }> {
    try {
      const workflowState = await this.getContractWorkflowState(contractId);
      
      if (workflowState.is_complete) {
        return {
          canSign: false,
          signerType: null,
          reason: 'Contract is already fully signed'
        };
      }

      const userSignature = workflowState.signatures.find(sig => sig.signer_id === userId);
      
      if (!userSignature) {
        return {
          canSign: false,
          signerType: null,
          reason: 'You are not authorized to sign this contract'
        };
      }

      if (userSignature.status === 'signed') {
        return {
          canSign: false,
          signerType: userSignature.signer_type,
          reason: 'You have already signed this contract'
        };
      }

      // Check if it's this user's turn to sign
      const nextRequired = workflowState.next_required_signature;
      if (nextRequired && nextRequired.signer_id !== userId) {
        return {
          canSign: false,
          signerType: userSignature.signer_type,
          reason: `Waiting for ${nextRequired.signer_name} to sign first`
        };
      }

      return {
        canSign: true,
        signerType: userSignature.signer_type
      };
    } catch (error: any) {
      console.error('Error checking signature permissions:', error);
      return {
        canSign: false,
        signerType: null,
        reason: 'Unable to verify signature permissions'
      };
    }
  }

  static async getSignatureHistory(contractId: string): Promise<SignatureRecord[]> {
    try {
      const { data: signatures, error } = await supabase
        .from('contract_signatures')
        .select('*')
        .eq('contract_id', contractId)
        .order('signed_at', { ascending: true });

      if (error) throw error;

      return signatures || [];
    } catch (error: any) {
      console.error('Error getting signature history:', error);
      throw new Error('Failed to get signature history');
    }
  }

  static formatSignatureStatus(status: string): {
    label: string;
    color: 'default' | 'secondary' | 'destructive' | 'success';
  } {
    switch (status) {
      case 'pending':
        return { label: 'Pending Signature', color: 'secondary' };
      case 'signed':
        return { label: 'Signed', color: 'success' };
      case 'declined':
        return { label: 'Declined', color: 'destructive' };
      default:
        return { label: 'Unknown', color: 'default' };
    }
  }

  static formatWorkflowStatus(status: string): {
    label: string;
    color: 'default' | 'secondary' | 'destructive' | 'success';
  } {
    switch (status) {
      case 'pending_borrower_signature':
        return { label: 'Waiting for Borrower', color: 'secondary' };
      case 'pending_guarantor_signature':
        return { label: 'Waiting for Guarantor', color: 'secondary' };
      case 'fully_signed':
        return { label: 'Fully Signed', color: 'success' };
      default:
        return { label: 'Draft', color: 'default' };
    }
  }
}