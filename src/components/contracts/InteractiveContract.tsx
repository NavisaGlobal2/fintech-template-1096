import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Edit2, Save, X, FileSignature, MapPin, User, Users, Upload, AlertCircle } from 'lucide-react';
import { LegalContract } from './LegalContract';
import ESignature from '../techscale/ESignature';
import GuarantorDetailsForm from './GuarantorDetailsForm';
import ManualContractUpload from './ManualContractUpload';
import { toast } from 'sonner';

interface GuarantorDetails {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  relationship: string;
  occupation: string;
  employer: string;
  annualIncome: string;
  dateOfBirth: string;
  nationalId: string;
}

interface InteractiveContractProps {
  contract: {
    id: string;
    contractType: string;
    loanAmount: number;
    aprRate?: number;
    isaPercentage?: number;
    repaymentTermMonths: number;
    gracePeriodMonths: number;
    repaymentSchedule: any;
    termsAndConditions: any;
    offerValidUntil: string;
    createdAt: string;
    requiresGuarantor?: boolean;
  };
  borrower: {
    fullName: string;
    email: string;
    address: string;
    dateOfBirth?: string;
    nationalId?: string;
  };
  lender: {
    companyName: string;
    registrationNumber: string;
    registeredAddress: string;
    contactEmail: string;
    phoneNumber: string;
  };
  guarantor?: GuarantorDetails;
  onBorrowerUpdate?: (borrower: any) => void;
  onGuarantorUpdate?: (guarantor: GuarantorDetails) => void;
  onSignatureComplete?: (signatureData: string) => void;
  onManualUploadComplete?: (uploadData: any) => void;
  className?: string;
}

export interface InteractiveContractRef {
  getUpdatedData: () => {
    borrower: any;
    guarantor: GuarantorDetails | null;
    isSigned: boolean;
    signatureData: string | null;
    isManuallyUploaded: boolean;
    manualUploadData: any;
  };
}

const InteractiveContract = forwardRef<InteractiveContractRef, InteractiveContractProps>(
  ({ contract, borrower, lender, guarantor, onBorrowerUpdate, onGuarantorUpdate, onSignatureComplete, onManualUploadComplete }, ref) => {
    const [borrowerData, setBorrowerData] = useState(borrower);
    const [guarantorData, setGuarantorData] = useState<GuarantorDetails | null>(guarantor || null);
    const [editingAddress, setEditingAddress] = useState(false);
    const [editingGuarantor, setEditingGuarantor] = useState(false);
    const [showSignature, setShowSignature] = useState(false);
    const [showManualUpload, setShowManualUpload] = useState(false);
    const [signatureData, setSignatureData] = useState<string | null>(null);
    const [manualUploadData, setManualUploadData] = useState<any>(null);
    const [tempAddress, setTempAddress] = useState('');

    const handleEditAddress = () => {
      setTempAddress(borrowerData.address);
      setEditingAddress(true);
    };

    const handleSaveAddress = () => {
      const updatedBorrower = { ...borrowerData, address: tempAddress };
      setBorrowerData(updatedBorrower);
      onBorrowerUpdate?.(updatedBorrower);
      setEditingAddress(false);
    };

    const handleCancelEdit = () => {
      setEditingAddress(false);
      setTempAddress('');
    };

    useImperativeHandle(ref, () => ({
      getUpdatedData: () => ({
        borrower: borrowerData,
        guarantor: guarantorData,
        isSigned: !!signatureData,
        signatureData,
        isManuallyUploaded: !!manualUploadData,
        manualUploadData
      })
    }));

    const handleStartSigning = () => {
      if (contract.requiresGuarantor && !guarantorData) {
        toast.error('Please provide guarantor details before signing');
        setEditingGuarantor(true);
        return;
      }
      setShowSignature(true);
    };

    const handleSignatureComplete = (signature: string) => {
      setSignatureData(signature);
      setShowSignature(false);
      onSignatureComplete?.(signature);
    };

    const handleSignatureCancel = () => {
      setShowSignature(false);
    };

    const handleManualUploadStart = () => {
      if (contract.requiresGuarantor && !guarantorData) {
        toast.error('Please provide guarantor details before uploading');
        setEditingGuarantor(true);
        return;
      }
      setShowManualUpload(true);
    };

    const handleManualUploadComplete = (uploadData: any) => {
      setManualUploadData(uploadData);
      setShowManualUpload(false);
      onManualUploadComplete?.(uploadData);
      toast.success('Contract uploaded successfully!');
    };

    const handleGuarantorSave = (guarantor: GuarantorDetails) => {
      setGuarantorData(guarantor);
      onGuarantorUpdate?.(guarantor);
    };

    return (
      <div className="relative bg-white">
        {/* Action Bar */}
        <div className="sticky top-0 z-10 bg-white border-b shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditAddress}
                className="flex items-center gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Edit Address
              </Button>

              {contract.requiresGuarantor && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingGuarantor(true)}
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  {guarantorData ? 'Edit Guarantor' : 'Add Guarantor'}
                  {contract.requiresGuarantor && !guarantorData && (
                    <Badge variant="destructive" className="ml-1">Required</Badge>
                  )}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!signatureData && !manualUploadData && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleManualUploadStart}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Signed
                  </Button>
                  
                  <Button
                    onClick={handleStartSigning}
                    className="flex items-center gap-2"
                  >
                    <FileSignature className="h-4 w-4" />
                    Sign Digitally
                  </Button>
                </>
              )}

              {signatureData && (
                <Badge variant="default" className="flex items-center gap-1 bg-green-600">
                  <FileSignature className="h-3 w-3" />
                  Digitally Signed
                </Badge>
              )}

              {manualUploadData && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Upload className="h-3 w-3" />
                  Manually Uploaded
                </Badge>
              )}
            </div>
          </div>

          {/* Guarantor Requirement Alert */}
          {contract.requiresGuarantor && !guarantorData && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">Guarantor Required</p>
                  <p>This loan requires a guarantor. Please provide guarantor details before signing the contract.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contract Display */}
        <div className="flex-1 overflow-auto">
          <LegalContract
            contract={contract}
            borrower={borrowerData}
            lender={lender}
            guarantor={guarantorData}
            className="p-6"
          />
        </div>

        {/* Signature/Upload Confirmation */}
        {signatureData && (
          <div className="border-t bg-green-50 p-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <FileSignature className="h-5 w-5" />
                  Digital Signature Applied
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700">
                      Contract signed on {new Date().toLocaleDateString('en-GB')} at {new Date().toLocaleTimeString('en-GB')}
                    </p>
                    <p className="text-xs text-green-600">
                      This contract is now legally binding and has been digitally signed.
                    </p>
                  </div>
                  <div className="h-16 w-32 bg-white border rounded flex items-center justify-center">
                    <img 
                      src={`data:image/png;base64,${signatureData}`} 
                      alt="Digital Signature" 
                      className="max-h-12 max-w-28"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {manualUploadData && (
          <div className="border-t bg-blue-50 p-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Manually Signed Contract Uploaded
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-700">
                        Uploaded on {new Date(manualUploadData.uploadedAt).toLocaleDateString('en-GB')}
                      </p>
                      <p className="text-sm text-blue-600">
                        File: {manualUploadData.fileName}
                      </p>
                    </div>
                  </div>
                  {manualUploadData.notes && (
                    <div className="mt-2 p-2 bg-white rounded border">
                      <p className="text-xs text-muted-foreground mb-1">Upload Notes:</p>
                      <p className="text-sm">{manualUploadData.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Address Edit Dialog */}
        <Dialog open={editingAddress} onOpenChange={setEditingAddress}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Edit Address
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={tempAddress}
                  onChange={(e) => setTempAddress(e.target.value)}
                  rows={4}
                  placeholder="Enter your full address"
                />
              </div>

              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSaveAddress}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Address
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Guarantor Details Form */}
        <GuarantorDetailsForm
          isOpen={editingGuarantor}
          onClose={() => setEditingGuarantor(false)}
          onSave={handleGuarantorSave}
          initialData={guarantorData || undefined}
          isRequired={contract.requiresGuarantor}
        />

        {/* Manual Contract Upload */}
        <ManualContractUpload
          isOpen={showManualUpload}
          onClose={() => setShowManualUpload(false)}
          onComplete={handleManualUploadComplete}
          contractId={contract.id}
          contractType={contract.contractType}
        />

        {/* Digital Signature Modal */}
        {showSignature && (
          <ESignature
            onComplete={handleSignatureComplete}
            onCancel={handleSignatureCancel}
          />
        )}
      </div>
    );
  }
);

InteractiveContract.displayName = 'InteractiveContract';

export { InteractiveContract };
export default InteractiveContract;