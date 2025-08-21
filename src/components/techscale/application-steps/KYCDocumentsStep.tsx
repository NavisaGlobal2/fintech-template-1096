
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { FullLoanApplication } from '@/types/loanApplication';
import DocumentUpload from '../DocumentUpload';

interface KYCDocumentsStepProps {
  form: UseFormReturn<FullLoanApplication>;
  applicationId: string | null;
  onComplete: () => void;
}

const KYCDocumentsStep: React.FC<KYCDocumentsStepProps> = ({ form, applicationId, onComplete }) => {
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});

  const kycDocs = form.watch('kycDocuments');

  const handleFileUpload = async (documentType: string, file: File) => {
    setUploading(prev => ({ ...prev, [documentType]: true }));
    
    try {
      // This would integrate with DocumentUpload component
      // For now, we'll simulate the upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (documentType === 'passportId') {
        form.setValue('kycDocuments.passportId', {
          uploaded: true,
          fileName: file.name,
          fileUrl: `/uploads/${file.name}`,
          verified: false
        });
      } else if (documentType === 'proofOfResidence') {
        form.setValue('kycDocuments.proofOfResidence', {
          uploaded: true,
          fileName: file.name,
          fileUrl: `/uploads/${file.name}`,
          verified: false
        });
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(prev => ({ ...prev, [documentType]: false }));
    }
  };

  const canContinue = kycDocs.passportId.uploaded && kycDocs.proofOfResidence.uploaded;

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        Please upload clear, high-quality images of your documents. All documents must be valid and current.
      </div>

      {/* Passport/ID Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Passport or National ID
            {kycDocs.passportId.uploaded && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentUpload
            documentType="passportId"
            acceptedTypes={['image/jpeg', 'image/png', 'application/pdf']}
            maxSize={10 * 1024 * 1024} // 10MB
            onUpload={(file) => handleFileUpload('passportId', file)}
            isUploading={uploading.passportId}
            uploadedFile={kycDocs.passportId.uploaded ? {
              name: kycDocs.passportId.fileName || '',
              url: kycDocs.passportId.fileUrl || '',
              verified: kycDocs.passportId.verified || false
            } : null}
          />
          <div className="mt-2 text-xs text-muted-foreground">
            Upload a clear photo of your passport or national ID card. Make sure all text is readable.
          </div>
        </CardContent>
      </Card>

      {/* Proof of Residence Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Proof of Residence
            {kycDocs.proofOfResidence.uploaded && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentUpload
            documentType="proofOfResidence"
            acceptedTypes={['image/jpeg', 'image/png', 'application/pdf']}
            maxSize={10 * 1024 * 1024} // 10MB
            onUpload={(file) => handleFileUpload('proofOfResidence', file)}
            isUploading={uploading.proofOfResidence}
            uploadedFile={kycDocs.proofOfResidence.uploaded ? {
              name: kycDocs.proofOfResidence.fileName || '',
              url: kycDocs.proofOfResidence.fileUrl || '',
              verified: kycDocs.proofOfResidence.verified || false
            } : null}
          />
          <div className="mt-2 text-xs text-muted-foreground">
            Upload a recent utility bill, bank statement, or lease agreement showing your current address.
          </div>
        </CardContent>
      </Card>

      {/* Verification Status */}
      {(kycDocs.passportId.uploaded || kycDocs.proofOfResidence.uploaded) && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <div className="text-sm">
                <div className="font-medium text-blue-900">Document Verification</div>
                <div className="text-blue-700">
                  Your documents will be automatically verified within 24 hours. You'll receive an email notification once verification is complete.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button 
          onClick={onComplete} 
          disabled={!canContinue}
          className="bg-primary"
        >
          Continue to Education & Career
        </Button>
      </div>
    </div>
  );
};

export default KYCDocumentsStep;
