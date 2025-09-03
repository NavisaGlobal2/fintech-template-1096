import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Download,
  CheckCircle,
  Clock,
  User,
  Calendar,
  DollarSign,
  Percent,
  AlertCircle
} from 'lucide-react';

interface ContractViewerProps {
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
    updated_at: string;
    signed_at?: string;
    executed_at?: string;
    version: number;
  };
  signatures: Array<{
    id: string;
    contract_id: string;
    signer_id: string;
    signer_type: string;
    signer_name: string;
    signer_email: string;
    signature_data?: string;
    signed_at?: string;
    status: string;
  }>;
  open: boolean;
  onClose: () => void;
}

export const ContractViewer: React.FC<ContractViewerProps> = ({
  contract,
  signatures,
  open,
  onClose
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const getSignatureStatusBadge = (status: string) => {
    switch (status) {
      case 'signed':
        return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" /> Signed</Badge>;
      case 'pending':
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'declined':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" /> Declined</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getSignerTypeDisplay = (type: string) => {
    switch (type) {
      case 'borrower': return 'Borrower';
      case 'co_signer': return 'Co-Signer';
      case 'lender': return 'Lender';
      case 'witness': return 'Witness';
      default: return type;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <FileText className="h-6 w-6" />
            Contract #{contract.id.slice(0, 8)}
            <Badge variant="outline" className="capitalize">
              {contract.status.replace('_', ' ')}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {contract.contract_type.replace('_', ' ')} - Version {contract.version}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] overflow-y-auto">
          <div className="space-y-6">
            <Tabs defaultValue="summary" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="terms">Terms</TabsTrigger>
                <TabsTrigger value="signatures">Signatures</TabsTrigger>
                <TabsTrigger value="document">Document</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  {/* Contract Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Contract Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Contract ID</p>
                          <p className="font-mono text-sm">{contract.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Created</p>
                          <p className="text-sm">
                            {new Date(contract.created_at).toLocaleDateString('en-GB')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Last Updated</p>
                          <p className="text-sm">
                            {new Date(contract.updated_at).toLocaleDateString('en-GB')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Status Information</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Current Status</p>
                        <Badge variant="outline" className="capitalize">
                          {contract.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      {contract.signed_at && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">Signed On</p>
                            <p className="text-sm">
                              {new Date(contract.signed_at).toLocaleDateString('en-GB')}
                            </p>
                          </div>
                        </div>
                      )}
                      {contract.executed_at && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">Executed On</p>
                            <p className="text-sm">
                              {new Date(contract.executed_at).toLocaleDateString('en-GB')}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="terms" className="space-y-4">
                {contract.contract_data && (
                  <div className="space-y-6">
                    {/* Loan Terms */}
                    {contract.contract_data.loanAmount && (
                      <div className="bg-muted/50 p-6 rounded-lg">
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Loan Terms
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Loan Amount</p>
                            <p className="text-lg font-semibold">
                              {formatCurrency(contract.contract_data.loanAmount)}
                            </p>
                          </div>
                          {contract.contract_data.aprRate && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">APR</p>
                              <p className="text-lg font-semibold">
                                {contract.contract_data.aprRate}%
                              </p>
                            </div>
                          )}
                          {contract.contract_data.isaPercentage && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Income Share</p>
                              <p className="text-lg font-semibold">
                                {contract.contract_data.isaPercentage}%
                              </p>
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Term</p>
                            <p className="text-lg font-semibold">
                              {contract.contract_data.repaymentTermMonths} months
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Repayment Schedule */}
                    {contract.contract_data.repaymentSchedule && (
                      <div>
                        <h4 className="font-semibold mb-3">Repayment Schedule</h4>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            {contract.contract_data.repaymentSchedule.monthlyPayment && (
                              <div>
                                <p className="text-muted-foreground">Monthly Payment</p>
                                <p className="font-semibold text-lg">
                                  {formatCurrency(contract.contract_data.repaymentSchedule.monthlyPayment)}
                                </p>
                              </div>
                            )}
                            {contract.contract_data.repaymentSchedule.totalRepayment && (
                              <div>
                                <p className="text-muted-foreground">Total Repayment</p>
                                <p className="font-semibold text-lg">
                                  {formatCurrency(contract.contract_data.repaymentSchedule.totalRepayment)}
                                </p>
                              </div>
                            )}
                            {contract.contract_data.repaymentSchedule.firstPaymentDate && (
                              <div>
                                <p className="text-muted-foreground">First Payment Due</p>
                                <p className="font-semibold">
                                  {new Date(contract.contract_data.repaymentSchedule.firstPaymentDate).toLocaleDateString('en-GB')}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Terms and Conditions */}
                    {contract.contract_data.termsAndConditions && (
                      <div>
                        <h4 className="font-semibold mb-3">Terms and Conditions</h4>
                        
                        {/* Benefits */}
                        {contract.contract_data.termsAndConditions.benefits && (
                          <div className="mb-4">
                            <h5 className="font-medium mb-2 text-green-700">Benefits</h5>
                            <ul className="space-y-1">
                              {contract.contract_data.termsAndConditions.benefits.map((benefit: string, index: number) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Special Conditions */}
                        {contract.contract_data.termsAndConditions.specialConditions && (
                          <div className="mb-4">
                            <h5 className="font-medium mb-2 text-orange-700">Special Conditions</h5>
                            <ul className="space-y-1">
                              {contract.contract_data.termsAndConditions.specialConditions.map((condition: string, index: number) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <AlertCircle className="h-3 w-3 text-orange-600 mt-0.5 flex-shrink-0" />
                                  {condition}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Eligibility Requirements */}
                        {contract.contract_data.termsAndConditions.eligibilityRequirements && (
                          <div>
                            <h5 className="font-medium mb-2">Eligibility Requirements</h5>
                            <ul className="space-y-1">
                              {contract.contract_data.termsAndConditions.eligibilityRequirements.map((requirement: string, index: number) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                  {requirement}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="signatures" className="space-y-4">
                <div className="space-y-4">
                  <h4 className="font-semibold">Required Signatures</h4>
                  
                  {signatures.length === 0 ? (
                    <div className="text-center py-8">
                      <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No signatures recorded yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {signatures.map((signature) => (
                        <div key={signature.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{signature.signer_name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {getSignerTypeDisplay(signature.signer_type)}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{signature.signer_email}</p>
                              {signature.signed_at && (
                                <p className="text-xs text-muted-foreground">
                                  Signed on {new Date(signature.signed_at).toLocaleDateString('en-GB')} at{' '}
                                  {new Date(signature.signed_at).toLocaleTimeString('en-GB')}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              {getSignatureStatusBadge(signature.status)}
                            </div>
                          </div>
                          
                          {signature.signature_data && (
                            <div className="mt-4 p-2 bg-muted/50 rounded border">
                              <p className="text-xs text-muted-foreground mb-2">Digital Signature:</p>
                              <img 
                                src={`data:image/png;base64,${signature.signature_data}`} 
                                alt="Digital signature" 
                                className="max-h-16 border rounded"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="document" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Contract Document</h4>
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

                  {contract.contract_pdf_url ? (
                    <div className="border rounded-lg overflow-hidden">
                      <iframe
                        src={contract.contract_pdf_url}
                        className="w-full h-96"
                        title="Contract Document"
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Contract document is being generated and will be available soon.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};