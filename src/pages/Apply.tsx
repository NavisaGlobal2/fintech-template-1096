import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import { submitLoanApplication, type ApplicationFormData } from '@/utils/applicationSubmit';
import { uploadMultipleDocuments } from '@/utils/documentUpload';

const applicationSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(20),
  loanAmount: z.string().min(1, 'Please select a loan amount'),
  loanPurpose: z.string().min(10, 'Please provide at least 10 characters').max(500),
  immigrationStatus: z.string().min(1, 'Please select your immigration status'),
  employmentStatus: z.string().min(1, 'Please select your employment status'),
  employerName: z.string().optional(),
  guarantorName: z.string().min(2, 'Guarantor name is required'),
  guarantorEmail: z.string().email('Invalid guarantor email'),
  guarantorPhone: z.string().min(10, 'Guarantor phone is required'),
  guarantorEmployment: z.string().min(1, 'Please select guarantor employment status'),
  consentData: z.boolean().refine(val => val === true, 'You must consent to data processing'),
  consentGuarantor: z.boolean().refine(val => val === true, 'You must confirm guarantor agreement'),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

const Apply = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<{
    proofOfAddress?: File;
    governmentId?: File;
    immigrationDoc?: File;
  }>({});

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
  });

  // Check authentication
  React.useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true);
    }
  }, [loading, user]);

  const handleFileChange = (type: 'proofOfAddress' | 'governmentId' | 'immigrationDoc') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFiles(prev => ({ ...prev, [type]: file }));
    }
  };

  const onSubmit = async (data: ApplicationForm) => {
    if (!user) {
      toast.error('Please sign in to submit your application');
      setShowAuthModal(true);
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Prepare documents for upload
      const documentsToUpload: { file: File; type: string }[] = [];
      if (selectedFiles.proofOfAddress) {
        documentsToUpload.push({ file: selectedFiles.proofOfAddress, type: 'proof_of_address' });
      }
      if (selectedFiles.governmentId) {
        documentsToUpload.push({ file: selectedFiles.governmentId, type: 'government_id' });
      }
      if (selectedFiles.immigrationDoc) {
        documentsToUpload.push({ file: selectedFiles.immigrationDoc, type: 'immigration_document' });
      }

      // Upload documents
      let uploadedDocuments: any[] = [];
      if (documentsToUpload.length > 0) {
        const uploadResult = await uploadMultipleDocuments(
          documentsToUpload,
          user.id,
          setUploadProgress
        );

        if (!uploadResult.success) {
          toast.error(uploadResult.error || 'Failed to upload documents');
          setIsSubmitting(false);
          return;
        }

        uploadedDocuments = uploadResult.documents || [];
      }

      // Submit application
      const result = await submitLoanApplication(data as ApplicationFormData, user.id, uploadedDocuments);

      if (!result.success) {
        toast.error(result.error || 'Failed to submit application');
        setIsSubmitting(false);
        return;
      }

      toast.success('Application Submitted Successfully!', {
        description: `Reference: ${result.applicationId?.slice(0, 8)}. We'll review your application within 24-48 hours.`,
      });

      // Redirect to applications page
      setTimeout(() => {
        navigate('/my-applications');
      }, 2000);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Loan Application
          </h1>
          <p className="text-lg text-muted-foreground">
            Complete the form below to apply for financial support. All fields marked with * are required.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          {/* Applicant Information */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">
              Applicant Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input id="fullName" {...register('fullName')} className="rounded-[1rem]" />
                {errors.fullName && <p className="text-destructive text-sm mt-1">{errors.fullName.message}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" {...register('email')} className="rounded-[1rem]" />
                {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" {...register('phone')} className="rounded-[1rem]" />
                {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <Label htmlFor="loanAmount">Loan Amount *</Label>
                <Select onValueChange={(value) => setValue('loanAmount', value)}>
                  <SelectTrigger className="rounded-[1rem]">
                    <SelectValue placeholder="Select amount" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="300">£300</SelectItem>
                    <SelectItem value="500">£500</SelectItem>
                    <SelectItem value="1000">£1,000</SelectItem>
                    <SelectItem value="1500">£1,500</SelectItem>
                    <SelectItem value="2000">£2,000</SelectItem>
                    <SelectItem value="2500">£2,500</SelectItem>
                  </SelectContent>
                </Select>
                {errors.loanAmount && <p className="text-destructive text-sm mt-1">{errors.loanAmount.message}</p>}
              </div>

              <div>
                <Label htmlFor="loanPurpose">Loan Purpose *</Label>
                <Textarea 
                  id="loanPurpose" 
                  {...register('loanPurpose')} 
                  className="rounded-[1rem] min-h-[120px]"
                  placeholder="Tell us how you plan to use the loan..."
                />
                {errors.loanPurpose && <p className="text-destructive text-sm mt-1">{errors.loanPurpose.message}</p>}
              </div>
            </div>
          </section>

          {/* Documents Upload */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">
              Required Documents
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="proofOfAddress">Proof of Address (Optional)</Label>
                <div className="mt-2">
                  <label htmlFor="proofOfAddress" className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-[1rem] cursor-pointer hover:border-primary transition-colors">
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {selectedFiles.proofOfAddress ? selectedFiles.proofOfAddress.name : 'Click to upload (Max 5MB)'}
                      </p>
                    </div>
                  </label>
                  <input
                    id="proofOfAddress"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    onChange={handleFileChange('proofOfAddress')}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="governmentId">Government ID (Optional)</Label>
                <div className="mt-2">
                  <label htmlFor="governmentId" className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-[1rem] cursor-pointer hover:border-primary transition-colors">
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {selectedFiles.governmentId ? selectedFiles.governmentId.name : 'Click to upload (Max 5MB)'}
                      </p>
                    </div>
                  </label>
                  <input
                    id="governmentId"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    onChange={handleFileChange('governmentId')}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="immigrationDoc">Immigration Document (Optional)</Label>
                <div className="mt-2">
                  <label htmlFor="immigrationDoc" className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-[1rem] cursor-pointer hover:border-primary transition-colors">
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {selectedFiles.immigrationDoc ? selectedFiles.immigrationDoc.name : 'Click to upload (Max 5MB)'}
                      </p>
                    </div>
                  </label>
                  <input
                    id="immigrationDoc"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    onChange={handleFileChange('immigrationDoc')}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Immigration Status */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">
              Immigration Status
            </h2>
            
            <div>
              <Label htmlFor="immigrationStatus">Immigration Status *</Label>
              <Select onValueChange={(value) => setValue('immigrationStatus', value)}>
                <SelectTrigger className="rounded-[1rem]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visa">Visa</SelectItem>
                  <SelectItem value="work-permit">Work Permit</SelectItem>
                  <SelectItem value="permanent-residence">Permanent Residence</SelectItem>
                  <SelectItem value="indefinite-leave">Indefinite Leave to Remain</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.immigrationStatus && <p className="text-destructive text-sm mt-1">{errors.immigrationStatus.message}</p>}
            </div>
          </section>

          {/* Employment Status */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">
              Employment Status
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="employmentStatus">Employment Status *</Label>
                <Select onValueChange={(value) => setValue('employmentStatus', value)}>
                  <SelectTrigger className="rounded-[1rem]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Employed</SelectItem>
                    <SelectItem value="self-employed">Self-employed</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                  </SelectContent>
                </Select>
                {errors.employmentStatus && <p className="text-destructive text-sm mt-1">{errors.employmentStatus.message}</p>}
              </div>

              <div>
                <Label htmlFor="employerName">Employer/Income Source (Optional)</Label>
                <Input id="employerName" {...register('employerName')} className="rounded-[1rem]" />
              </div>
            </div>
          </section>

          {/* Guarantor Information */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">
              Guarantor Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="guarantorName">Guarantor Full Name *</Label>
                <Input id="guarantorName" {...register('guarantorName')} className="rounded-[1rem]" />
                {errors.guarantorName && <p className="text-destructive text-sm mt-1">{errors.guarantorName.message}</p>}
              </div>

              <div>
                <Label htmlFor="guarantorEmail">Guarantor Email *</Label>
                <Input id="guarantorEmail" type="email" {...register('guarantorEmail')} className="rounded-[1rem]" />
                {errors.guarantorEmail && <p className="text-destructive text-sm mt-1">{errors.guarantorEmail.message}</p>}
              </div>

              <div>
                <Label htmlFor="guarantorPhone">Guarantor Phone *</Label>
                <Input id="guarantorPhone" {...register('guarantorPhone')} className="rounded-[1rem]" />
                {errors.guarantorPhone && <p className="text-destructive text-sm mt-1">{errors.guarantorPhone.message}</p>}
              </div>

              <div>
                <Label htmlFor="guarantorEmployment">Guarantor Employment Status *</Label>
                <Select onValueChange={(value) => setValue('guarantorEmployment', value)}>
                  <SelectTrigger className="rounded-[1rem]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Employed</SelectItem>
                    <SelectItem value="self-employed">Self-employed</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
                {errors.guarantorEmployment && <p className="text-destructive text-sm mt-1">{errors.guarantorEmployment.message}</p>}
              </div>
            </div>
          </section>

          {/* Consent */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">
              Consent
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox 
                  id="consentData" 
                  onCheckedChange={(checked) => setValue('consentData', checked as boolean)}
                />
                <Label htmlFor="consentData" className="cursor-pointer font-normal">
                  I consent to TechScale Accelerate processing my personal data for the purpose of assessing my loan application *
                </Label>
              </div>
              {errors.consentData && <p className="text-destructive text-sm">{errors.consentData.message}</p>}

              <div className="flex items-start gap-3">
                <Checkbox 
                  id="consentGuarantor" 
                  onCheckedChange={(checked) => setValue('consentGuarantor', checked as boolean)}
                />
                <Label htmlFor="consentGuarantor" className="cursor-pointer font-normal">
                  I confirm that my guarantor has agreed to provide their information and support my application *
                </Label>
              </div>
              {errors.consentGuarantor && <p className="text-destructive text-sm">{errors.consentGuarantor.message}</p>}
            </div>
          </section>

          {/* Progress indicator */}
          {isSubmitting && uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Uploading documents...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="pt-6">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full rounded-full h-14 text-lg font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </div>
        </form>
      </div>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </div>
  );
};

export default Apply;
