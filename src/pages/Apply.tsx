import React, { useState, useEffect, useCallback } from 'react';
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
import { ArrowLeft, Loader2, User, FileText, Globe, Briefcase, Users, CheckCircle, Save, Trash2, Share2, Facebook, Twitter, Instagram, Linkedin, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import { submitLoanApplication, type ApplicationFormData } from '@/utils/applicationSubmit';
import { uploadMultipleDocuments } from '@/utils/documentUpload';
import { FileUploadCard } from '@/components/ui/file-upload-card';
import { Card } from '@/components/ui/card';
import ApplicationSubmittedPage from '@/components/ApplicationSubmittedPage';

const applicationSchema = z.object({
  // Applicant Information
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(20),
  proofOfAddress: z.boolean().refine(val => val === true, 'Proof of address is required'),
  loanAmount: z.string().min(1, 'Please select a loan amount'),
  loanPurpose: z.string().min(10, 'Please provide at least 10 characters').max(500),
  
  // Immigration Status
  immigrationStatus: z.enum([
    'skilled-worker-visa',
    'student-visa',
    'graduate-route',
    'ilr-settled',
    'pre-settled',
    'asylum-refugee',
    'other'
  ], { required_error: 'Please select your immigration status' }),
  shareCodeOrEvisa: z.boolean().refine(val => val === true, 'Share code or eVisa document is required'),
  
  // Identity Verification
  governmentId: z.boolean().refine(val => val === true, 'Government-issued ID is required'),
  
  // Employment Status
  employmentStatus: z.enum([
    'full-time',
    'part-time',
    'self-employed',
    'contract',
    'unemployed',
    'student'
  ], { required_error: 'Please select your employment status' }),
  employerName: z.string().optional(),
  
  // Guarantor Information
  guarantorName: z.string().min(2, 'Guarantor name is required'),
  guarantorEmail: z.string().email('Invalid guarantor email'),
  guarantorPhone: z.string().min(10, 'Guarantor phone is required'),
  guarantorProofOfAddress: z.boolean().refine(val => val === true, 'Guarantor proof of address is required'),
  guarantorId: z.boolean().refine(val => val === true, 'Guarantor ID is required'),
  guarantorEmployment: z.enum([
    'full-time',
    'part-time',
    'self-employed',
    'contract',
    'retired',
    'other'
  ], { required_error: 'Please select guarantor employment status' }),
  
  // Social Profiles
  socialProfiles: z.object({
    facebook: z.string().optional(),
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    tiktok: z.string().optional(),
    whatsapp: z.string().optional(),
  }).refine(
    (data) => {
      const filled = Object.values(data).filter(v => v && v.trim() !== '').length;
      return filled >= 3;
    },
    { message: 'At least 3 social profiles must be provided' }
  ),

  // Consent
  consentData: z.boolean().refine(val => val === true, 'You must consent to data processing'),
  consentGuarantor: z.boolean().refine(val => val === true, 'You must confirm guarantor agreement'),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

const AUTOSAVE_DELAY = 2000; // 2 seconds

const Apply = () => {
  const { user, loading } = useAuth();
  
  // User-specific draft storage key
  const getTempDraftKey = () => 'loan_application_temp_draft';
  const getUserDraftKey = (userId: string) => `loan_application_draft_${userId}`;
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState(false);
  const [showSubmittedPage, setShowSubmittedPage] = useState(false);
  const [submittedApplicationId, setSubmittedApplicationId] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<{
    proofOfAddress?: File;
    governmentId?: File;
    shareCodeOrEvisa?: File;
    guarantorProofOfAddress?: File;
    guarantorId?: File;
  }>({});

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
  });

  const formValues = watch();

  // Load saved draft from localStorage or sessionStorage on mount
  useEffect(() => {
    // Clear old non-user-specific drafts
    const oldDraft = localStorage.getItem('loan_application_draft');
    if (oldDraft) {
      localStorage.removeItem('loan_application_draft');
    }

    if (user?.id) {
      // For authenticated users, check for temp draft first
      const tempDraft = sessionStorage.getItem(getTempDraftKey());
      if (tempDraft) {
        try {
          const parsed = JSON.parse(tempDraft);
          // Migrate to user-specific storage
          const draftData = {
            userId: user.id,
            formData: parsed.formData || parsed,
            savedAt: new Date().toISOString(),
          };
          localStorage.setItem(getUserDraftKey(user.id), JSON.stringify(draftData));
          sessionStorage.removeItem(getTempDraftKey());
          
          const dataToRestore = parsed.formData || parsed;
          Object.keys(dataToRestore).forEach((key) => {
            setValue(key as any, dataToRestore[key]);
          });
          setHasSavedDraft(true);
          toast.success('Your application has been saved to your account!');
        } catch (error) {
          console.error('Error migrating temp draft:', error);
        }
      } else {
        // Load user-specific draft
        const savedDraft = localStorage.getItem(getUserDraftKey(user.id));
        if (savedDraft) {
          try {
            const parsed = JSON.parse(savedDraft);
            
            // Verify the draft belongs to the current user
            if (parsed.userId && parsed.userId !== user.id) {
              localStorage.removeItem(getUserDraftKey(user.id));
              return;
            }
            
            // Restore form values
            if (parsed.formData) {
              Object.keys(parsed.formData).forEach((key) => {
                setValue(key as any, parsed.formData[key]);
              });
              
              setHasSavedDraft(true);
              setLastSaved(new Date(parsed.savedAt));
              toast.info('Draft restored from previous session', {
                description: `Last saved: ${new Date(parsed.savedAt).toLocaleString()}`,
              });
            }
          } catch (error) {
            console.error('Failed to load draft:', error);
            localStorage.removeItem(getUserDraftKey(user.id));
          }
        }
      }
    } else {
      // For anonymous users, load from sessionStorage
      const tempDraft = sessionStorage.getItem(getTempDraftKey());
      if (tempDraft) {
        try {
          const parsed = JSON.parse(tempDraft);
          const dataToRestore = parsed.formData || parsed;
          Object.keys(dataToRestore).forEach((key) => {
            setValue(key as any, dataToRestore[key]);
          });
          setHasSavedDraft(true);
          if (parsed.savedAt) {
            setLastSaved(new Date(parsed.savedAt));
          }
        } catch (error) {
          console.error('Failed to load temp draft:', error);
          sessionStorage.removeItem(getTempDraftKey());
        }
      }
    }
  }, [setValue, user]);

  // Auto-save form data to localStorage or sessionStorage
  const saveFormData = useCallback(() => {
    if (user?.id) {
      // Authenticated users - save to localStorage
      const draftData = {
        userId: user.id,
        formData: formValues,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(getUserDraftKey(user.id), JSON.stringify(draftData));
    } else {
      // Anonymous users - save to sessionStorage
      const draftData = {
        formData: formValues,
        savedAt: new Date().toISOString(),
      };
      sessionStorage.setItem(getTempDraftKey(), JSON.stringify(draftData));
    }
    setLastSaved(new Date());
    setHasSavedDraft(true);
  }, [formValues, user]);

  // Debounced auto-save
  useEffect(() => {
    // Don't auto-save if form is empty or during submission
    if (isSubmitting) return;
    
    const hasAnyData = Object.values(formValues).some(val => 
      val !== undefined && val !== '' && val !== false
    );
    
    if (!hasAnyData) return;

    const timer = setTimeout(() => {
      saveFormData();
    }, AUTOSAVE_DELAY);

    return () => clearTimeout(timer);
  }, [formValues, isSubmitting, saveFormData]);

  // Clear draft from localStorage or sessionStorage
  const clearDraft = () => {
    if (user?.id) {
      localStorage.removeItem(getUserDraftKey(user.id));
    } else {
      sessionStorage.removeItem(getTempDraftKey());
    }
    reset();
    setSelectedFiles({});
    setHasSavedDraft(false);
    setLastSaved(null);
    toast.success('Draft cleared');
  };

  const loanPurpose = watch('loanPurpose');
  const characterCount = loanPurpose?.length || 0;

  // Calculate progress
  const totalFields = 17;
  const socialProfiles = watch('socialProfiles') || {};
  const filledSocialProfiles = Object.values(socialProfiles).filter(v => v && v.trim() !== '').length;
  const filledFields = Object.values(watch()).filter(val => 
    val !== undefined && val !== '' && val !== false
  ).length;
  const progress = Math.round((filledFields / totalFields) * 100);

  // Handle auto-submit after authentication
  React.useEffect(() => {
    if (pendingSubmission && user) {
      setPendingSubmission(false);
      // Small delay to ensure auth state is fully set
      setTimeout(() => {
        handleSubmit(onSubmit)();
      }, 300);
    }
  }, [pendingSubmission, user]);

  const handleFileChange = (type: keyof typeof selectedFiles) => (file: File | undefined) => {
    setSelectedFiles(prev => ({ ...prev, [type]: file }));
    setValue(type, !!file);
  };

  const onSubmit = async (data: ApplicationForm) => {
    if (!user) {
      // Save current form data before showing auth modal
      saveFormData();
      toast.info('Create an account to save your application');
      setShowAuthModal(true);
      setPendingSubmission(true);
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
      if (selectedFiles.shareCodeOrEvisa) {
        documentsToUpload.push({ file: selectedFiles.shareCodeOrEvisa, type: 'share_code_evisa' });
      }
      if (selectedFiles.guarantorProofOfAddress) {
        documentsToUpload.push({ file: selectedFiles.guarantorProofOfAddress, type: 'guarantor_proof_of_address' });
      }
      if (selectedFiles.guarantorId) {
        documentsToUpload.push({ file: selectedFiles.guarantorId, type: 'guarantor_id' });
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
      const result = await submitLoanApplication(data as any, user.id, uploadedDocuments);

      if (!result.success) {
        toast.error(result.error || 'Failed to submit application');
        setIsSubmitting(false);
        return;
      }

      // Clear the saved draft
      if (user?.id) {
        localStorage.removeItem(getUserDraftKey(user.id));
      }
      sessionStorage.removeItem(getTempDraftKey());
      setHasSavedDraft(false);
      setLastSaved(null);

      // Show submitted page instead of navigating
      setSubmittedApplicationId(result.applicationId || '');
      setShowSubmittedPage(true);
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

  // Show submitted page after successful submission
  if (showSubmittedPage && submittedApplicationId) {
    return <ApplicationSubmittedPage applicationId={submittedApplicationId} />;
  }

  return (
    <div className="min-h-screen bg-background py-8 md:py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3">
            Loan Application
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-4">
            Complete the form below to apply for financial support. We're here to help! ✨
          </p>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Progress</span>
              <div className="flex items-center gap-4">
                {lastSaved && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Save className="h-3 w-3" />
                    Saved {lastSaved.toLocaleTimeString()}
                  </span>
                )}
                <span className="text-sm font-medium text-sage">{progress}%</span>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-sage to-sageDark transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            {hasSavedDraft && (
              <div className="flex justify-end mt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearDraft}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear Draft
                </Button>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Section 1: Applicant Information */}
          <Card className="p-6 md:p-8 space-y-6 border-sage/20 hover-lift">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
                <User className="h-5 w-5 text-sage" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Applicant Information</h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
                <Input 
                  id="fullName" 
                  {...register('fullName')} 
                  className="rounded-2xl h-12 mt-2"
                  placeholder="John Smith"
                />
                {errors.fullName && <p className="text-destructive text-sm mt-1.5">{errors.fullName.message}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                <Input 
                  id="email" 
                  type="email" 
                  {...register('email')} 
                  className="rounded-2xl h-12 mt-2"
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-destructive text-sm mt-1.5">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
                <Input 
                  id="phone" 
                  {...register('phone')} 
                  className="rounded-2xl h-12 mt-2"
                  placeholder="+44 7700 900000"
                />
                {errors.phone && <p className="text-destructive text-sm mt-1.5">{errors.phone.message}</p>}
              </div>

              <div className="md:col-span-2">
                <FileUploadCard
                  id="proofOfAddress"
                  label="Proof of Address"
                  hint="Recent utility bill, bank statement, or council tax letter"
                  file={selectedFiles.proofOfAddress}
                  onChange={handleFileChange('proofOfAddress')}
                  error={errors.proofOfAddress?.message}
                  required
                />
              </div>

              <div>
                <Label htmlFor="loanAmount">Loan Amount <span className="text-destructive">*</span></Label>
                <Select onValueChange={(value) => setValue('loanAmount', value)}>
                  <SelectTrigger className="rounded-2xl h-12 mt-2">
                    <SelectValue placeholder="Select amount" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="300">£300</SelectItem>
                    <SelectItem value="500">£500</SelectItem>
                    <SelectItem value="1000">£1,000</SelectItem>
                    <SelectItem value="1500">£1,500</SelectItem>
                    <SelectItem value="2000">£2,000</SelectItem>
                    <SelectItem value="2500">£2,500</SelectItem>
                    <SelectItem value="5000">£5,000</SelectItem>
                  </SelectContent>
                </Select>
                {errors.loanAmount && <p className="text-destructive text-sm mt-1.5">{errors.loanAmount.message}</p>}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="loanPurpose">Purpose of Loan <span className="text-destructive">*</span></Label>
                <Textarea 
                  id="loanPurpose" 
                  {...register('loanPurpose')} 
                  className="rounded-2xl min-h-[120px] mt-2 resize-none"
                  placeholder="Tell us how you plan to use the loan..."
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-1.5">
                  {errors.loanPurpose && <p className="text-destructive text-sm">{errors.loanPurpose.message}</p>}
                  <p className={`text-xs ml-auto ${characterCount > 450 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {characterCount}/500
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 2: Immigration Status */}
          <Card className="p-6 md:p-8 space-y-6 border-sage/20 hover-lift">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
                <Globe className="h-5 w-5 text-sage" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Immigration Status</h2>
            </div>
            
            <div className="grid gap-6">
              <div>
                <Label htmlFor="immigrationStatus">Immigration Status <span className="text-destructive">*</span></Label>
                <Select onValueChange={(value) => setValue('immigrationStatus', value as any)}>
                  <SelectTrigger className="rounded-2xl h-12 mt-2">
                    <SelectValue placeholder="Select your status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="skilled-worker-visa">Skilled Worker Visa</SelectItem>
                    <SelectItem value="student-visa">Student Visa</SelectItem>
                    <SelectItem value="graduate-route">Graduate Route</SelectItem>
                    <SelectItem value="ilr-settled">ILR/Settled Status</SelectItem>
                    <SelectItem value="pre-settled">Pre-Settled Status</SelectItem>
                    <SelectItem value="asylum-refugee">Asylum/Refugee Status</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.immigrationStatus && <p className="text-destructive text-sm mt-1.5">{errors.immigrationStatus.message}</p>}
              </div>

              <FileUploadCard
                id="shareCodeOrEvisa"
                label="Share Code or eVisa Document"
                hint="Your immigration share code or eVisa document"
                file={selectedFiles.shareCodeOrEvisa}
                onChange={handleFileChange('shareCodeOrEvisa')}
                error={errors.shareCodeOrEvisa?.message}
                required
              />
            </div>
          </Card>

          {/* Section 3: Identity Verification */}
          <Card className="p-6 md:p-8 space-y-6 border-sage/20 hover-lift">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
                <FileText className="h-5 w-5 text-sage" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Identity Verification</h2>
            </div>
            
            <FileUploadCard
              id="governmentId"
              label="Government-Issued ID"
              hint="Accepted: Passport, BRP, or Driving Licence"
              file={selectedFiles.governmentId}
              onChange={handleFileChange('governmentId')}
              error={errors.governmentId?.message}
              required
            />
          </Card>

          {/* Section 4: Employment Status */}
          <Card className="p-6 md:p-8 space-y-6 border-sage/20 hover-lift">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-sage" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Employment Status</h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="employmentStatus">Employment Status <span className="text-destructive">*</span></Label>
                <Select onValueChange={(value) => setValue('employmentStatus', value as any)}>
                  <SelectTrigger className="rounded-2xl h-12 mt-2">
                    <SelectValue placeholder="Select your status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time Employed</SelectItem>
                    <SelectItem value="part-time">Part-time Employed</SelectItem>
                    <SelectItem value="self-employed">Self-employed</SelectItem>
                    <SelectItem value="contract">Contract Worker</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
                {errors.employmentStatus && <p className="text-destructive text-sm mt-1.5">{errors.employmentStatus.message}</p>}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="employerName">Employer or Income Source <span className="text-muted-foreground text-xs">(Optional)</span></Label>
                <Input 
                  id="employerName" 
                  {...register('employerName')} 
                  className="rounded-2xl h-12 mt-2"
                  placeholder="Company name or income source"
                />
              </div>
            </div>
          </Card>

          {/* Section 5: Social Profiles */}
          <Card className="p-6 md:p-8 space-y-6 border-sage/20 hover-lift">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
                <Share2 className="h-5 w-5 text-sage" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground">Social Profiles</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Provide at least 3 social profiles for verification purposes
                </p>
              </div>
            </div>

            {/* Counter */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border">
              <span className="text-sm font-medium text-foreground">Profiles provided:</span>
              <span className={`text-lg font-bold ${filledSocialProfiles >= 3 ? 'text-sage' : 'text-amber-600'}`}>
                {filledSocialProfiles} / 3 minimum
              </span>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="facebook" className="flex items-center gap-2">
                  <Facebook className="h-4 w-4 text-[#1877F2]" />
                  Facebook
                </Label>
                <Input 
                  id="facebook" 
                  {...register('socialProfiles.facebook')} 
                  className="rounded-2xl h-12 mt-2"
                  placeholder="facebook.com/username or username"
                />
                {errors.socialProfiles?.facebook && (
                  <p className="text-destructive text-sm mt-1.5">{errors.socialProfiles.facebook.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="twitter" className="flex items-center gap-2">
                  <Twitter className="h-4 w-4 text-[#1DA1F2]" />
                  Twitter/X
                </Label>
                <Input 
                  id="twitter" 
                  {...register('socialProfiles.twitter')} 
                  className="rounded-2xl h-12 mt-2"
                  placeholder="@username"
                />
                {errors.socialProfiles?.twitter && (
                  <p className="text-destructive text-sm mt-1.5">{errors.socialProfiles.twitter.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="instagram" className="flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-[#E4405F]" />
                  Instagram
                </Label>
                <Input 
                  id="instagram" 
                  {...register('socialProfiles.instagram')} 
                  className="rounded-2xl h-12 mt-2"
                  placeholder="@username"
                />
                {errors.socialProfiles?.instagram && (
                  <p className="text-destructive text-sm mt-1.5">{errors.socialProfiles.instagram.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="linkedin" className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                  LinkedIn
                </Label>
                <Input 
                  id="linkedin" 
                  {...register('socialProfiles.linkedin')} 
                  className="rounded-2xl h-12 mt-2"
                  placeholder="linkedin.com/in/username"
                />
                {errors.socialProfiles?.linkedin && (
                  <p className="text-destructive text-sm mt-1.5">{errors.socialProfiles.linkedin.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="tiktok" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-foreground" />
                  TikTok
                </Label>
                <Input 
                  id="tiktok" 
                  {...register('socialProfiles.tiktok')} 
                  className="rounded-2xl h-12 mt-2"
                  placeholder="@username"
                />
                {errors.socialProfiles?.tiktok && (
                  <p className="text-destructive text-sm mt-1.5">{errors.socialProfiles.tiktok.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="whatsapp" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-[#25D366]" />
                  WhatsApp
                </Label>
                <Input 
                  id="whatsapp" 
                  {...register('socialProfiles.whatsapp')} 
                  className="rounded-2xl h-12 mt-2"
                  placeholder="+44 7700 900000"
                />
                {errors.socialProfiles?.whatsapp && (
                  <p className="text-destructive text-sm mt-1.5">{errors.socialProfiles.whatsapp.message}</p>
                )}
              </div>
            </div>
            
            {errors.socialProfiles && (
              <p className="text-destructive text-sm font-medium">
                {errors.socialProfiles.message}
              </p>
            )}
          </Card>

          {/* Section 6: Guarantor Information */}
          <Card className="p-6 md:p-8 space-y-6 border-sage/20 hover-lift">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-sage" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Guarantor Information</h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="guarantorName">Guarantor Full Name <span className="text-destructive">*</span></Label>
                <Input 
                  id="guarantorName" 
                  {...register('guarantorName')} 
                  className="rounded-2xl h-12 mt-2"
                  placeholder="Jane Doe"
                />
                {errors.guarantorName && <p className="text-destructive text-sm mt-1.5">{errors.guarantorName.message}</p>}
              </div>

              <div>
                <Label htmlFor="guarantorEmail">Guarantor Email <span className="text-destructive">*</span></Label>
                <Input 
                  id="guarantorEmail" 
                  type="email" 
                  {...register('guarantorEmail')} 
                  className="rounded-2xl h-12 mt-2"
                  placeholder="jane@example.com"
                />
                {errors.guarantorEmail && <p className="text-destructive text-sm mt-1.5">{errors.guarantorEmail.message}</p>}
              </div>

              <div>
                <Label htmlFor="guarantorPhone">Guarantor Phone <span className="text-destructive">*</span></Label>
                <Input 
                  id="guarantorPhone" 
                  {...register('guarantorPhone')} 
                  className="rounded-2xl h-12 mt-2"
                  placeholder="+44 7700 900000"
                />
                {errors.guarantorPhone && <p className="text-destructive text-sm mt-1.5">{errors.guarantorPhone.message}</p>}
              </div>

              <div className="md:col-span-2">
                <FileUploadCard
                  id="guarantorProofOfAddress"
                  label="Guarantor Proof of Address"
                  hint="Guarantor's recent utility bill, bank statement, or council tax letter"
                  file={selectedFiles.guarantorProofOfAddress}
                  onChange={handleFileChange('guarantorProofOfAddress')}
                  error={errors.guarantorProofOfAddress?.message}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <FileUploadCard
                  id="guarantorId"
                  label="Guarantor ID"
                  hint="Guarantor's passport, driving licence, or government ID"
                  file={selectedFiles.guarantorId}
                  onChange={handleFileChange('guarantorId')}
                  error={errors.guarantorId?.message}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="guarantorEmployment">Guarantor Employment Status <span className="text-destructive">*</span></Label>
                <Select onValueChange={(value) => setValue('guarantorEmployment', value as any)}>
                  <SelectTrigger className="rounded-2xl h-12 mt-2">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time Employed</SelectItem>
                    <SelectItem value="part-time">Part-time Employed</SelectItem>
                    <SelectItem value="self-employed">Self-employed</SelectItem>
                    <SelectItem value="contract">Contract Worker</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.guarantorEmployment && <p className="text-destructive text-sm mt-1.5">{errors.guarantorEmployment.message}</p>}
              </div>
            </div>
          </Card>

          {/* Section 7: Consent */}
          <Card className="p-6 md:p-8 space-y-6 border-sage/20 hover-lift">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-sage" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Consent</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-muted/30 border border-border hover:border-sage transition-colors">
                <Checkbox 
                  id="consentData" 
                  onCheckedChange={(checked) => setValue('consentData', checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="consentData" className="cursor-pointer font-normal leading-relaxed">
                  I agree to TechScale Accelerate processing my data to assess my loan application. <span className="text-destructive">*</span>
                </Label>
              </div>
              {errors.consentData && <p className="text-destructive text-sm">{errors.consentData.message}</p>}

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-muted/30 border border-border hover:border-sage transition-colors">
                <Checkbox 
                  id="consentGuarantor" 
                  onCheckedChange={(checked) => setValue('consentGuarantor', checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="consentGuarantor" className="cursor-pointer font-normal leading-relaxed">
                  I confirm my guarantor has agreed to be contacted. <span className="text-destructive">*</span>
                </Label>
              </div>
              {errors.consentGuarantor && <p className="text-destructive text-sm">{errors.consentGuarantor.message}</p>}
            </div>
          </Card>

          {/* Submit Button */}
          <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm py-6 border-t border-border md:relative md:bg-transparent md:border-0 md:backdrop-blur-none">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-14 text-lg font-semibold rounded-2xl bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {uploadProgress > 0 ? `Uploading ${uploadProgress}%` : 'Submitting...'}
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </div>
        </form>

      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
        onSuccess={() => {
          // Auth success will trigger the useEffect to auto-submit
        }}
      />
      </div>
    </div>
  );
};

export default Apply;
