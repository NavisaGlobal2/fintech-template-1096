import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { UserPlus, Shield, FileSignature, Eye, EyeOff } from 'lucide-react';
import { FullLoanApplication } from '@/types/loanApplication';
import ESignature from '../ESignature';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { findBestSponsorMatch, assignSponsorToApplication } from '@/utils/sponsorMatcher';
import { notifyApplicationSubmitted } from '@/utils/notifications';

interface AccountCreationStepProps {
  form: UseFormReturn<FullLoanApplication>;
  onComplete: (application: FullLoanApplication) => void;
}

const AccountCreationStep: React.FC<AccountCreationStepProps> = ({ form, onComplete }) => {
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [useExistingAccount, setUseExistingAccount] = useState(!!user);

  const declarations = form.watch('declarations');
  const personalInfo = form.watch('personalInfo');

  const handleSignature = (signatureDataUrl: string) => {
    form.setValue('declarations.signatureImage', signatureDataUrl);
    form.setValue('declarations.signatureDate', new Date().toISOString());
    setShowSignaturePad(false);
  };

  const canSubmit = declarations.creditCheckConsent && 
                   declarations.dataPrivacyConsent && 
                   declarations.termsAndConditions &&
                   declarations.signatureImage &&
                   (useExistingAccount || (password && confirmPassword && password === confirmPassword));

  /**
   * Automatically process application after submission based on loan type
   */
  const processApplicationAutomatically = async (
    applicationData: any, 
    userId: string, 
    formData: FullLoanApplication
  ) => {
    try {
      const loanType = formData.loanTypeRequest.type;

      // Send initial submission notification
      await notifyApplicationSubmitted(
        userId,
        applicationData.id || 'pending',
        formData.lenderName,
        formData.loanTypeRequest?.amount || formData.programInfo?.totalCost
      );

      // Handle sponsor-match type
      if (loanType === 'sponsor-match') {
        const sponsorMatch = await findBestSponsorMatch(formData);
        
        if (sponsorMatch) {
          await assignSponsorToApplication(
            applicationData.id,
            userId,
            sponsorMatch
          );

          // Update application status
          await supabase
            .from('loan_applications')
            .update({ 
              status: 'sponsor_review',
              reviewer_notes: `Automatically matched with sponsor: ${sponsorMatch.sponsorName}`
            })
            .eq('user_id', userId)
            .eq('is_draft', false);

          // Send sponsor match notification email
          await supabase.functions.invoke('send-notification-email', {
            body: {
              userId,
              type: 'sponsor_matched',
              data: {
                sponsorName: sponsorMatch.sponsorName,
                matchScore: sponsorMatch.matchScore,
                reason: sponsorMatch.reason,
                expectedReviewTime: '3-5 business days'
              }
            }
          });
        }
      } else {
        // For study-abroad and career-microloan, trigger automatic underwriting
        // This will be processed by the underwriting system
        await supabase
          .from('loan_applications')
          .update({ 
            status: 'under_review',
            reviewer_notes: 'Application queued for automatic underwriting assessment'
          })
          .eq('user_id', userId)
          .eq('is_draft', false);

        // Notify about auto-processing
        await supabase.functions.invoke('send-notification-email', {
          body: {
            userId,
            type: 'application_processing',
            data: {
              loanType,
              expectedProcessingTime: '24-48 hours',
              nextSteps: 'Our underwriting system will assess your application automatically'
            }
          }
        });
      }
    } catch (error) {
      console.error('Error in automatic processing:', error);
      // Don't block submission if automatic processing fails
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsCreatingAccount(true);
    
    try {
      let userId = user?.id;
      
      if (!useExistingAccount) {
        // Check for existing applications by email before creating account
        const { data: existingProfiles } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', personalInfo.email)
          .limit(1);

        if (existingProfiles && existingProfiles.length > 0) {
          // Check if this user has submitted applications
          const { data: existingApps } = await supabase
            .from('loan_applications')
            .select('id, status, submitted_at')
            .eq('user_id', existingProfiles[0].id)
            .eq('is_draft', false)
            .limit(1);

          if (existingApps && existingApps.length > 0) {
            toast.error('An application has already been submitted with this email address. Please sign in to your existing account or contact support.');
            return;
          }
        }

        // Create new user account
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: personalInfo.email,
          password: password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              first_name: personalInfo.firstName,
              last_name: personalInfo.lastName,
            }
          }
        });

        if (authError) {
          // Provide specific error messages
          if (authError.message.includes('already registered') || authError.message.includes('already been taken')) {
            toast.error('An account with this email already exists. Please sign in instead or use the "Forgot Password" option.');
          } else if (authError.message.includes('weak')) {
            toast.error('Password is too weak. Please create a stronger password.');
          } else {
            toast.error(`Account creation failed: ${authError.message}`);
          }
          return;
        }

        if (!authData.user) {
          toast.error('Account creation failed. Please try again.');
          return;
        }

        userId = authData.user.id;
      } else {
        // Check if existing user already has submitted application
        const { data: existingApps } = await supabase
          .from('loan_applications')
          .select('id, status, submitted_at')
          .eq('user_id', user.id)
          .eq('is_draft', false)
          .limit(1);

        if (existingApps && existingApps.length > 0) {
          toast.error('You have already submitted an application. Please check your dashboard or contact support.');
          return;
        }
      }

      if (!userId) {
        toast.error('User authentication failed. Please try again.');
        return;
      }

      // Transfer any temporary documents to user account
      try {
        const { transferSessionDocumentsToUser } = await import('@/utils/sessionManager');
        await transferSessionDocumentsToUser(userId);
      } catch (transferError) {
        console.warn('Failed to transfer documents:', transferError);
        // Don't block account creation if document transfer fails
      }

      // Update form with user ID
      form.setValue('userId', userId);

      // Save application to database
      const formData = form.getValues();
      const applicationData = {
        user_id: userId,
        loan_option_id: formData.loanOptionId,
        lender_name: formData.lenderName,
        personal_info: JSON.parse(JSON.stringify(formData.personalInfo)),
        kyc_documents: JSON.parse(JSON.stringify(formData.kycDocuments)),
        education_career: formData.educationCareer ? JSON.parse(JSON.stringify(formData.educationCareer)) : {},
        professional_employment: formData.professionalEmployment ? JSON.parse(JSON.stringify(formData.professionalEmployment)) : {},
        program_info: JSON.parse(JSON.stringify(formData.programInfo)),
        financial_info: JSON.parse(JSON.stringify(formData.financialInfo)),
        loan_type_requested: formData.loanTypeRequest.type,
        declarations: JSON.parse(JSON.stringify(formData.declarations)),
        is_draft: false,
        completed_steps: JSON.parse(JSON.stringify(formData.completedSteps)),
        status: 'submitted',
        submitted_at: new Date().toISOString()
      };

      const { data: savedApplication, error: dbError } = await supabase
        .from('loan_applications')
        .insert(applicationData)
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        toast.error('Application submission failed. Please contact support.');
        return;
      }

      if (!savedApplication) {
        console.error('No application data returned');
        toast.error('Application submission failed. Please contact support.');
        return;
      }

      // Create profile if it doesn't exist
      if (!useExistingAccount) {
        await supabase.from('profiles').insert({
          id: userId,
          first_name: personalInfo.firstName,
          last_name: personalInfo.lastName,
          email: personalInfo.email,
          phone: personalInfo.phone
        });
      }

      // Clear localStorage
      localStorage.removeItem('loanApplicationDraft');

      // Trigger automatic processing based on loan type
      await processApplicationAutomatically(savedApplication, userId, formData);

      toast.success(useExistingAccount 
        ? 'Application submitted successfully! You will receive an email with next steps.' 
        : 'Account created and application submitted successfully! Check your email for updates.');
      onComplete(formData);

    } catch (error) {
      console.error('Submission error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsCreatingAccount(false);
    }
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        {/* Account Creation Section */}
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">
            {user ? 'Submit Application' : 'Create Your Account'}
          </h3>
        </div>

        {user && (
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardContent className="p-6">
              <p className="text-sm text-green-800">
                <strong>You're already signed in as:</strong> {user.email}
              </p>
              <p className="text-xs text-green-700 mt-1">
                Your application will be submitted directly to your existing account.
              </p>
            </CardContent>
          </Card>
        )}

        {!user && (
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4">
                Create an account using your email address to secure and submit your application.
              </p>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email Address</label>
                <Input 
                  value={personalInfo.email} 
                  disabled 
                  className="bg-muted"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Confirm Password</label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-sm text-destructive">Passwords do not match</p>
              )}
            </div>
          </CardContent>
        </Card>
        )}

        <Separator />

        {/* Consent and Declarations Section */}
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Consent & Declarations</h3>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <FormField
              control={form.control}
              name="declarations.creditCheckConsent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I consent to credit checks and financial verification
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      We will perform credit checks to assess your application
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="declarations.dataPrivacyConsent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I consent to data processing and privacy policy
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Your data will be processed according to our privacy policy
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="declarations.termsAndConditions"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the terms and conditions
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      By checking this, you agree to our terms of service
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="declarations.marketingConsent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I would like to receive marketing communications (optional)
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Receive updates about new loan products and services
                    </p>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Digital Signature */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileSignature className="h-4 w-4" />
              Digital Signature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!declarations.signatureImage ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Please provide your digital signature to complete the application.
                  </p>
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setShowSignaturePad(true)}
                    className="w-full"
                  >
                    <FileSignature className="h-4 w-4 mr-2" />
                    Open Signature Pad
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Signature captured:</p>
                  <div className="border rounded p-4 bg-muted/20">
                    <img 
                      src={declarations.signatureImage} 
                      alt="Digital signature" 
                      className="max-h-20"
                    />
                  </div>
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setShowSignaturePad(true)}
                    className="mt-2"
                    size="sm"
                  >
                    Re-sign
                  </Button>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              By signing above, you confirm that all information provided is accurate and complete.
            </p>
          </CardContent>
        </Card>

        {showSignaturePad && (
          <ESignature
            onComplete={handleSignature}
            onCancel={() => setShowSignaturePad(false)}
          />
        )}

        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit}
            disabled={!canSubmit || isCreatingAccount}
            className="bg-green-600 hover:bg-green-700 text-white px-8"
          >
            {isCreatingAccount 
              ? (useExistingAccount ? 'Submitting Application...' : 'Creating Account & Submitting...') 
              : (useExistingAccount ? 'Submit Application' : 'Create Account & Submit Application')}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default AccountCreationStep;