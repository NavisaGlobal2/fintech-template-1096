
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Save, Send, CheckCircle } from 'lucide-react';
import { FullLoanApplication, ApplicationStep, ApplicationStepId } from '@/types/loanApplication';
import { LoanOption } from '@/types/techscale';
import PersonalInfoStep from './application-steps/PersonalInfoStep';
import KYCDocumentsStep from './application-steps/KYCDocumentsStep';
import EducationCareerStep from './application-steps/EducationCareerStep';
import ProgramInfoStep from './application-steps/ProgramInfoStep';
import FinancialInfoStep from './application-steps/FinancialInfoStep';
import LoanTypeStep from './application-steps/LoanTypeStep';
import DeclarationsStep from './application-steps/DeclarationsStep';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LoanApplicationFormProps {
  loanOption: LoanOption;
  onBack: () => void;
  onComplete: (application: FullLoanApplication) => void;
}

const LoanApplicationForm: React.FC<LoanApplicationFormProps> = ({
  loanOption,
  onBack,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState<ApplicationStepId>('personal-info');
  const [isLoading, setIsLoading] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const form = useForm<FullLoanApplication>({
    defaultValues: {
      loanOptionId: loanOption.id,
      lenderName: loanOption.lenderName,
      isDraft: true,
      completedSteps: [],
      status: 'draft',
      personalInfo: {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'prefer-not-to-say',
        nationality: '',
        address: {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: ''
        },
        phone: '',
        email: ''
      },
      kycDocuments: {
        passportId: { uploaded: false },
        proofOfResidence: { uploaded: false }
      },
      educationCareer: {
        highestQualification: '',
        institution: '',
        graduationYear: '',
        transcripts: { uploaded: false },
        resume: { uploaded: false }
      },
      programInfo: {
        institution: '',
        programName: '',
        duration: '',
        startDate: '',
        totalCost: '',
        costBreakdown: {
          tuition: '',
          livingExpenses: '',
          other: ''
        },
        acceptanceLetter: { uploaded: false }
      },
      financialInfo: {
        householdIncome: '',
        dependents: 0,
        bankAccount: {
          bankName: '',
          accountType: '',
          accountNumber: '',
          sortCode: ''
        },
        bankStatements: { uploaded: false },
        existingLoans: ''
      },
      loanTypeRequest: {
        type: 'study-abroad',
        amount: '',
        purpose: '',
        repaymentPreference: ''
      },
      declarations: {
        creditCheckConsent: false,
        dataPrivacyConsent: false,
        termsAndConditions: false,
        marketingConsent: false,
        signatureDate: ''
      }
    }
  });

  const steps: ApplicationStep[] = [
    {
      id: 'personal-info',
      title: 'Personal Information',
      description: 'Basic personal details',
      completed: form.watch('completedSteps')?.includes('personal-info') || false,
      current: currentStep === 'personal-info'
    },
    {
      id: 'kyc-documents',
      title: 'Identity Verification',
      description: 'Upload ID and proof of residence',
      completed: form.watch('completedSteps')?.includes('kyc-documents') || false,
      current: currentStep === 'kyc-documents'
    },
    {
      id: 'education-career',
      title: 'Education & Career',
      description: 'Academic background and employment',
      completed: form.watch('completedSteps')?.includes('education-career') || false,
      current: currentStep === 'education-career'
    },
    {
      id: 'program-info',
      title: 'Program Details',
      description: 'Course and institution information',
      completed: form.watch('completedSteps')?.includes('program-info') || false,
      current: currentStep === 'program-info'
    },
    {
      id: 'financial-info',
      title: 'Financial Information',
      description: 'Income and banking details',
      completed: form.watch('completedSteps')?.includes('financial-info') || false,
      current: currentStep === 'financial-info'
    },
    {
      id: 'loan-type',
      title: 'Loan Requirements',
      description: 'Loan type and amount',
      completed: form.watch('completedSteps')?.includes('loan-type') || false,
      current: currentStep === 'loan-type'
    },
    {
      id: 'declarations',
      title: 'Consent & Signature',
      description: 'Terms and declarations',
      completed: form.watch('completedSteps')?.includes('declarations') || false,
      current: currentStep === 'declarations'
    }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  const saveApplication = async (isDraft: boolean = true) => {
    setIsLoading(true);
    try {
      const formData = form.getValues();
      const user = await supabase.auth.getUser();
      
      if (!user.data.user) {
        toast.error('Please log in to save your application');
        return;
      }

      console.log('Saving application with status:', isDraft ? 'draft' : 'submitted');
      console.log('Form data:', formData);

      // Convert complex objects to JSON-compatible format with proper casting
      const applicationData = {
        user_id: user.data.user.id,
        loan_option_id: formData.loanOptionId,
        lender_name: formData.lenderName,
        personal_info: JSON.parse(JSON.stringify(formData.personalInfo)),
        kyc_documents: JSON.parse(JSON.stringify(formData.kycDocuments)),
        education_career: JSON.parse(JSON.stringify(formData.educationCareer)),
        program_info: JSON.parse(JSON.stringify(formData.programInfo)),
        financial_info: JSON.parse(JSON.stringify(formData.financialInfo)),
        loan_type_requested: formData.loanTypeRequest.type,
        declarations: JSON.parse(JSON.stringify(formData.declarations)),
        is_draft: isDraft,
        completed_steps: JSON.parse(JSON.stringify(formData.completedSteps)),
        status: isDraft ? 'draft' : 'submitted',
        submitted_at: isDraft ? null : new Date().toISOString()
      };

      console.log('Application data to save:', applicationData);

      if (applicationId) {
        console.log('Updating existing application with ID:', applicationId);
        const { data, error } = await supabase
          .from('loan_applications')
          .update(applicationData)
          .eq('id', applicationId)
          .select()
          .single();
        
        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        console.log('Updated application:', data);
      } else {
        console.log('Creating new application');
        const { data, error } = await supabase
          .from('loan_applications')
          .insert(applicationData)
          .select()
          .single();
        
        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        console.log('Created application:', data);
        setApplicationId(data.id);
      }

      toast.success(isDraft ? 'Application saved as draft' : 'Application submitted successfully!');
      
      if (!isDraft) {
        onComplete(formData);
      }
    } catch (error) {
      console.error('Error saving application:', error);
      toast.error(`Failed to save application: ${error.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepComplete = (stepId: ApplicationStepId) => {
    const completedSteps = form.getValues('completedSteps') || [];
    if (!completedSteps.includes(stepId)) {
      form.setValue('completedSteps', [...completedSteps, stepId]);
    }
    saveApplication(true);
  };

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextStepId = steps[currentStepIndex + 1].id as ApplicationStepId;
      setCurrentStep(nextStepId);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      const prevStepId = steps[currentStepIndex - 1].id as ApplicationStepId;
      setCurrentStep(prevStepId);
    }
  };

  const handleSubmit = () => {
    handleStepComplete(currentStep);
    saveApplication(false);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'personal-info':
        return <PersonalInfoStep form={form} onComplete={() => handleStepComplete('personal-info')} />;
      case 'kyc-documents':
        return <KYCDocumentsStep form={form} applicationId={applicationId} onComplete={() => handleStepComplete('kyc-documents')} />;
      case 'education-career':
        return <EducationCareerStep form={form} applicationId={applicationId} onComplete={() => handleStepComplete('education-career')} />;
      case 'program-info':
        return <ProgramInfoStep form={form} applicationId={applicationId} onComplete={() => handleStepComplete('program-info')} />;
      case 'financial-info':
        return <FinancialInfoStep form={form} applicationId={applicationId} onComplete={() => handleStepComplete('financial-info')} />;
      case 'loan-type':
        return <LoanTypeStep form={form} loanOption={loanOption} onComplete={() => handleStepComplete('loan-type')} />;
      case 'declarations':
        return <DeclarationsStep form={form} onComplete={() => handleStepComplete('declarations')} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Loan Options
        </Button>
        <div className="text-center">
          <h1 className="text-2xl font-medium">Loan Application</h1>
          <p className="text-muted-foreground">{loanOption.lenderName}</p>
        </div>
        <Button variant="outline" onClick={() => saveApplication(true)} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
      </div>

      {/* Progress */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {currentStepIndex + 1} of {steps.length}
            </span>
          </div>
          <Progress value={progressPercentage} className="mb-4" />
          
          <div className="grid grid-cols-7 gap-2">
            {steps.map((step, index) => (
              <div key={step.id} className="text-center">
                <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-medium ${
                  step.completed 
                    ? 'bg-green-500 text-white' 
                    : step.current 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step.completed ? <CheckCircle className="h-4 w-4" /> : index + 1}
                </div>
                <p className="text-xs text-muted-foreground">{step.title}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Step */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {steps[currentStepIndex].title}
            {steps[currentStepIndex].completed && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            )}
          </CardTitle>
          <p className="text-muted-foreground">{steps[currentStepIndex].description}</p>
        </CardHeader>
        <CardContent>
          {renderCurrentStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStepIndex === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {currentStepIndex === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? 'Submitting...' : 'Submit Application'}
            </Button>
          ) : (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationForm;
