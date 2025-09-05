import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { LegalContract } from './LegalContract';
import ESignature from '../techscale/ESignature';
import { Edit, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface InteractiveContractProps {
  contract: any;
  borrower: any;
  lender: any;
  onBorrowerUpdate?: (updatedBorrower: any) => void;
  onSignatureComplete?: (signatureData: string) => void;
  className?: string;
}

export interface InteractiveContractRef {
  getUpdatedData: () => { borrower: any; signed: boolean; signatureData?: string };
}

export const InteractiveContract = forwardRef<InteractiveContractRef, InteractiveContractProps>(({
  contract,
  borrower: initialBorrower,
  lender,
  onBorrowerUpdate,
  onSignatureComplete,
  className = ""
}, ref) => {
  const [borrower, setBorrower] = useState(initialBorrower);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [signatureData, setSignatureData] = useState<string>('');
  const [isSigned, setIsSigned] = useState(false);
  const [tempAddress, setTempAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United Kingdom'
  });

  useImperativeHandle(ref, () => ({
    getUpdatedData: () => ({
      borrower,
      signed: isSigned,
      signatureData
    })
  }));

  const handleEditAddress = () => {
    // Parse current address into components
    const addressParts = borrower.address.split(',').map((part: string) => part.trim());
    setTempAddress({
      street: addressParts[0] || '',
      city: addressParts[1] || '',
      state: addressParts[2] || '',
      postalCode: addressParts[3] || '',
      country: addressParts[4] || 'United Kingdom'
    });
    setIsEditingAddress(true);
  };

  const handleSaveAddress = () => {
    const newAddress = `${tempAddress.street}, ${tempAddress.city}, ${tempAddress.state} ${tempAddress.postalCode}, ${tempAddress.country}`;
    const updatedBorrower = { ...borrower, address: newAddress };
    setBorrower(updatedBorrower);
    onBorrowerUpdate?.(updatedBorrower);
    setIsEditingAddress(false);
    toast.success('Address updated successfully');
  };

  const handleCancelEdit = () => {
    setIsEditingAddress(false);
  };

  const handleStartSigning = () => {
    setShowSignature(true);
  };

  const handleSignatureComplete = (signature: string) => {
    setSignatureData(signature);
    setIsSigned(true);
    setShowSignature(false);
    onSignatureComplete?.(signature);
    toast.success('Contract signed successfully!');
  };

  const handleSignatureCancel = () => {
    setShowSignature(false);
  };

  return (
    <>
      <div className={`relative ${className}`}>
        {/* Interactive Controls */}
        <div className="sticky top-0 z-10 bg-white border-b p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditAddress}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Address
              </Button>
              
              {isSigned ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-4 w-4" />
                  <span className="text-sm font-medium">Contract Signed</span>
                </div>
              ) : (
                <Button
                  onClick={handleStartSigning}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Edit className="h-4 w-4" />
                  Sign Contract
                </Button>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-GB')}
            </div>
          </div>
        </div>

        {/* Contract Document */}
        <LegalContract
          contract={contract}
          borrower={borrower}
          lender={lender}
          className="border rounded-lg"
        />

        {/* Signature Display */}
        {isSigned && signatureData && (
          <Card className="mt-6 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Check className="h-5 w-5" />
                Digitally Signed Contract
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-green-700">Digital Signature:</Label>
                  <div className="mt-2 p-4 bg-white border border-green-200 rounded">
                    <img 
                      src={signatureData} 
                      alt="Digital Signature" 
                      className="max-h-20 border-b border-gray-300"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-green-700">Signed by:</Label>
                    <p className="font-medium">{borrower.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-green-700">Date & Time:</Label>
                    <p className="font-medium">{new Date().toLocaleString('en-GB')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Address Editing Dialog */}
      <Dialog open={isEditingAddress} onOpenChange={setIsEditingAddress}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={tempAddress.street}
                onChange={(e) => setTempAddress({...tempAddress, street: e.target.value})}
                placeholder="Enter street address"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={tempAddress.city}
                  onChange={(e) => setTempAddress({...tempAddress, city: e.target.value})}
                  placeholder="Enter city"
                />
              </div>
              <div>
                <Label htmlFor="state">State/County</Label>
                <Input
                  id="state"
                  value={tempAddress.state}
                  onChange={(e) => setTempAddress({...tempAddress, state: e.target.value})}
                  placeholder="Enter state/county"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={tempAddress.postalCode}
                  onChange={(e) => setTempAddress({...tempAddress, postalCode: e.target.value})}
                  placeholder="Enter postal code"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={tempAddress.country}
                  onChange={(e) => setTempAddress({...tempAddress, country: e.target.value})}
                  placeholder="Enter country"
                />
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveAddress} className="flex-1">
                <Check className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancelEdit} className="flex-1">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Signature Dialog */}
      {showSignature && (
        <ESignature
          onComplete={handleSignatureComplete}
          onCancel={handleSignatureCancel}
        />
      )}
    </>
  );
});

InteractiveContract.displayName = 'InteractiveContract';