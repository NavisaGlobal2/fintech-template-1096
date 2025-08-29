import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, CheckCircle, User, Shield } from 'lucide-react';
import { FullLoanApplication } from '@/types/loanApplication';
import DocumentUpload from '../DocumentUpload';

interface PersonalInfoKYCStepProps {
  form: UseFormReturn<FullLoanApplication>;
  applicationId: string | null;
  onComplete: () => void;
}

const PersonalInfoKYCStep: React.FC<PersonalInfoKYCStepProps> = ({ form, applicationId, onComplete }) => {
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});

  const personalInfo = form.watch('personalInfo');
  const kycDocuments = form.watch('kycDocuments');

  const handleFileUpload = async (documentType: string, file: File) => {
    setUploading(prev => ({ ...prev, [documentType]: true }));
    
    try {
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

  const canContinue = personalInfo.firstName && 
                     personalInfo.lastName && 
                     personalInfo.email &&
                     personalInfo.phone &&
                     kycDocuments.passportId.uploaded &&
                     kycDocuments.proofOfResidence.uploaded;

  return (
    <Form {...form}>
      <div className="space-y-6">
        {/* Personal Information Section */}
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Personal Information</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="personalInfo.firstName"
            rules={{ required: "First name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="personalInfo.lastName"
            rules={{ required: "Last name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="personalInfo.email"
            rules={{ 
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Please enter a valid email address"
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="personalInfo.phone"
            rules={{ required: "Phone number is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator className="my-6" />

        {/* Identity Verification Section */}
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Identity Verification</h3>
        </div>

        {/* Passport/ID Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Passport or Government ID
              {kycDocuments.passportId.uploaded && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentUpload
              documentType="passportId"
              acceptedTypes={['application/pdf', 'image/jpeg', 'image/png']}
              maxSize={10 * 1024 * 1024}
              onUpload={(file) => handleFileUpload('passportId', file)}
              isUploading={uploading.passportId}
              uploadedFile={kycDocuments.passportId.uploaded ? {
                name: kycDocuments.passportId.fileName || '',
                url: kycDocuments.passportId.fileUrl || '',
                verified: kycDocuments.passportId.verified || false
              } : null}
            />
            <div className="mt-2 text-xs text-muted-foreground">
              Upload a clear photo of your passport or government-issued ID.
            </div>
          </CardContent>
        </Card>

        {/* Proof of Residence Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Proof of Residence
              {kycDocuments.proofOfResidence.uploaded && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentUpload
              documentType="proofOfResidence"
              acceptedTypes={['application/pdf', 'image/jpeg', 'image/png']}
              maxSize={10 * 1024 * 1024}
              onUpload={(file) => handleFileUpload('proofOfResidence', file)}
              isUploading={uploading.proofOfResidence}
              uploadedFile={kycDocuments.proofOfResidence.uploaded ? {
                name: kycDocuments.proofOfResidence.fileName || '',
                url: kycDocuments.proofOfResidence.fileUrl || '',
                verified: kycDocuments.proofOfResidence.verified || false
              } : null}
            />
            <div className="mt-2 text-xs text-muted-foreground">
              Upload a utility bill, bank statement, or rental agreement dated within the last 3 months.
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            onClick={onComplete} 
            disabled={!canContinue}
            className="bg-primary"
          >
            Continue
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default PersonalInfoKYCStep;