import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Eye, Download, PenTool, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { ContractViewer } from './ContractViewer';
import { ContractSigningFlow } from './ContractSigningFlow';
import { toast } from 'sonner';

interface LoanContract {
  id: string;
  user_id: string;
  application_id: string;
  offer_id: string;
  contract_type: string;
  contract_data: any;
  contract_pdf_url?: string;
  status: string;
  created_at: string;
  updated_at: string;
  signed_at?: string;
  executed_at?: string;
  version: number;
}

interface ContractSignature {
  id: string;
  contract_id: string;
  signer_id: string;
  signer_type: string;
  signer_name: string;
  signer_email: string;
  signature_data?: string;
  signed_at?: string;
  status: string;
}

export const ContractDashboard: React.FC = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<LoanContract[]>([]);
  const [signatures, setSignatures] = useState<ContractSignature[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<LoanContract | null>(null);
  const [showContractViewer, setShowContractViewer] = useState(false);
  const [showSigningFlow, setShowSigningFlow] = useState(false);

  useEffect(() => {
    if (user) {
      fetchContracts();
    }
  }, [user]);

  const fetchContracts = async () => {
    try {
      setLoading(true);

      // Fetch contracts
      const { data: contractsData, error: contractsError } = await supabase
        .from('loan_contracts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (contractsError) throw contractsError;

      // Fetch signatures for contracts
      if (contractsData?.length > 0) {
        const contractIds = contractsData.map(c => c.id);
        const { data: signaturesData, error: signaturesError } = await supabase
          .from('contract_signatures')
          .select('*')
          .in('contract_id', contractIds);

        if (signaturesError) throw signaturesError;
        setSignatures(signaturesData || []);
      }

      setContracts(contractsData || []);
    } catch (error: any) {
      console.error('Error fetching contracts:', error);
      toast.error('Failed to load contracts');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'ready_for_signature': return 'outline';
      case 'signed': return 'default';
      case 'executed': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText className="h-4 w-4" />;
      case 'ready_for_signature': return <PenTool className="h-4 w-4" />;
      case 'signed': return <CheckCircle className="h-4 w-4" />;
      case 'executed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getContractSignatures = (contractId: string) => {
    return signatures.filter(sig => sig.contract_id === contractId);
  };

  const isPendingSignature = (contract: LoanContract) => {
    const contractSignatures = getContractSignatures(contract.id);
    const userSignature = contractSignatures.find(sig => sig.signer_id === user?.id);
    return contract.status === 'ready_for_signature' && userSignature?.status === 'pending';
  };

  const draftContracts = contracts.filter(c => c.status === 'draft');
  const pendingSignatureContracts = contracts.filter(c => c.status === 'ready_for_signature');
  const signedContracts = contracts.filter(c => c.status === 'signed' || c.status === 'executed');

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading contracts...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Loan Contracts</h1>
          <p className="text-muted-foreground">Review and sign your loan agreements</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Contracts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftContracts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Signature</CardTitle>
            <PenTool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingSignatureContracts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Signed Contracts</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{signedContracts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contracts.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Contracts Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending Signature ({pendingSignatureContracts.length})
          </TabsTrigger>
          <TabsTrigger value="signed">
            Signed ({signedContracts.length})
          </TabsTrigger>
          <TabsTrigger value="drafts">
            Drafts ({draftContracts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingSignatureContracts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <PenTool className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No contracts pending signature</p>
                <p className="text-muted-foreground">
                  Once you accept a loan offer, the contract will be generated and appear here for signing.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {pendingSignatureContracts.map((contract) => (
                <Card key={contract.id} className="border-orange-200 shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-xl">
                            Contract #{contract.id.slice(0, 8)}
                          </CardTitle>
                          <Badge variant={getStatusBadgeVariant(contract.status)} className="capitalize">
                            {getStatusIcon(contract.status)}
                            <span className="ml-1">{contract.status.replace('_', ' ')}</span>
                          </Badge>
                        </div>
                        <CardDescription>
                          {contract.contract_type.replace('_', ' ')} - Version {contract.version}
                        </CardDescription>
                      </div>
                      {isPendingSignature(contract) && (
                        <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-700">
                          Signature Required
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Created</p>
                        <p className="font-medium">
                          {new Date(contract.created_at).toLocaleDateString('en-GB')}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Updated</p>
                        <p className="font-medium">
                          {new Date(contract.updated_at).toLocaleDateString('en-GB')}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedContract(contract);
                          setShowContractViewer(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Review Contract
                      </Button>
                      {isPendingSignature(contract) && (
                        <Button
                          onClick={() => {
                            setSelectedContract(contract);
                            setShowSigningFlow(true);
                          }}
                        >
                          <PenTool className="h-4 w-4 mr-2" />
                          Sign Contract
                        </Button>
                      )}
                      {contract.contract_pdf_url && (
                        <Button
                          variant="outline"
                          onClick={() => window.open(contract.contract_pdf_url, '_blank')}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="signed" className="space-y-4">
          {signedContracts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No signed contracts</p>
                <p className="text-muted-foreground">
                  Your signed contracts will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {signedContracts.map((contract) => (
                <Card key={contract.id} className="border-green-200 shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-xl">
                            Contract #{contract.id.slice(0, 8)}
                          </CardTitle>
                          <Badge variant={getStatusBadgeVariant(contract.status)} className="capitalize">
                            {getStatusIcon(contract.status)}
                            <span className="ml-1">{contract.status.replace('_', ' ')}</span>
                          </Badge>
                        </div>
                        <CardDescription>
                          {contract.contract_type.replace('_', ' ')} - Version {contract.version}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Signed On</p>
                        <p className="font-medium">
                          {contract.signed_at ? 
                            new Date(contract.signed_at).toLocaleDateString('en-GB') : 
                            'Pending'
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Executed On</p>
                        <p className="font-medium">
                          {contract.executed_at ? 
                            new Date(contract.executed_at).toLocaleDateString('en-GB') : 
                            'Pending'
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Version</p>
                        <p className="font-medium">v{contract.version}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedContract(contract);
                          setShowContractViewer(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Contract
                      </Button>
                      {contract.contract_pdf_url && (
                        <Button
                          variant="outline"
                          onClick={() => window.open(contract.contract_pdf_url, '_blank')}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          {draftContracts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No draft contracts</p>
                <p className="text-muted-foreground">
                  Contract drafts are created automatically when you accept loan offers.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {draftContracts.map((contract) => (
                <Card key={contract.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-xl">
                            Contract #{contract.id.slice(0, 8)}
                          </CardTitle>
                          <Badge variant={getStatusBadgeVariant(contract.status)} className="capitalize">
                            {getStatusIcon(contract.status)}
                            <span className="ml-1">{contract.status}</span>
                          </Badge>
                        </div>
                        <CardDescription>
                          {contract.contract_type.replace('_', ' ')} - Version {contract.version}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      This contract is being prepared and will be available for review and signature soon.
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Contract Viewer Modal */}
      {selectedContract && showContractViewer && (
        <ContractViewer
          contract={selectedContract}
          signatures={getContractSignatures(selectedContract.id)}
          open={showContractViewer}
          onClose={() => setShowContractViewer(false)}
        />
      )}

      {/* Contract Signing Flow */}
      {selectedContract && showSigningFlow && (
        <ContractSigningFlow
          contract={selectedContract}
          open={showSigningFlow}
          onClose={() => setShowSigningFlow(false)}
          onComplete={() => {
            fetchContracts();
            setShowSigningFlow(false);
          }}
        />
      )}
    </div>
  );
};