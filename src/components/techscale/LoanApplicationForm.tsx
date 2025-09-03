
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Save, Send, CheckCircle } from 'lucide-react';
import { FullLoanApplication, ApplicationStep, ApplicationStepId } from '@/types/loanApplication';
import { LoanOption } from '@/types/techscale';
import PersonalInfoKYCStep from './application-steps/PersonalInfoKYCStep';
import EducationCareerStep from './application-steps/EducationCareerStep';
import ProfessionalEmploymentStep from './application-steps/ProfessionalEmploymentStep';
import ProgramInfoStep from './application-steps/ProgramInfoStep';
import FinancialInfoStep from './application-steps/FinancialInfoStep';
import LoanTypeStep from './application-steps/LoanTypeStep';
import AccountCreationStep from './application-steps/AccountCreationStep';
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
  const [currentStep, setCurrentStep] = useState<ApplicationStepId>('personal-kyc');
  const [isLoading, setIsLoading] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  // Load draft from localStorage on mount
  const loadDraftFromStorage = () => {
    const savedDraft = localStorage.getItem('loanApplicationDraft');
    if (savedDraft) {
      try {
        return JSON.parse(savedDraft);
      } catch (error) {
        console.error('Error parsing draft from localStorage:', error);
      }
    }
    return null;
  };

  const savedDraft = loadDraftFromStorage();

  const form = useForm<FullLoanApplication>({
    defaultValues: savedDraft || {
      userId: '',
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
      professionalEmployment: {
        employmentType: 'full-time',
        company: '',
        jobTitle: '',
        employmentDuration: '',
        monthlySalary: '',
        workAuthorization: '',
        employmentLetter: { uploaded: false },
        paySlips: { uploaded: false }
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

  // Save draft to localStorage whenever form changes
  const formData = form.watch();
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('loanApplicationDraft', JSON.stringify(formData));
    }, 1000); // Debounce saves

    return () => clearTimeout(timeoutId);
  }, [formData]);

  const loanType = form.watch('loanTypeRequest.type');
  
  const getStepsForLoanType = (): ApplicationStep[] => {
    const baseSteps = [
      {
        id: 'personal-kyc',
        title: 'Personal & Identity',
        description: 'Personal details and ID verification',
        completed: form.watch('completedSteps')?.includes('personal-kyc') || false,
        current: currentStep === 'personal-kyc'
      },
      {
        id: 'loan-type',
        title: 'Loan Requirements',
        description: 'Select loan type and amount',
        completed: form.watch('completedSteps')?.includes('loan-type') || false,
        current: currentStep === 'loan-type'
      }
    ];

    // Add appropriate steps based on loan type
    if (loanType === 'study-abroad') {
      baseSteps.push({
        id: 'education-career',
        title: 'Education & Career',
        description: 'Academic background and employment',
        completed: form.watch('completedSteps')?.includes('education-career') || false,
        current: currentStep === 'education-career'
      });
      
      baseSteps.push({
        id: 'program-info',
        title: 'Program Details',
        description: 'Course and institution information',
        completed: form.watch('completedSteps')?.includes('program-info') || false,
        current: currentStep === 'program-info'
      });
    } else {
      // For career-microloan and sponsor-match, use professional employment
      baseSteps.push({
        id: 'professional-employment',
        title: 'Professional Employment',
        description: 'Employment verification and details',
        completed: form.watch('completedSteps')?.includes('professional-employment') || false,
        current: currentStep === 'professional-employment'
      });
    }

    baseSteps.push(
      {
        id: 'financial-info',
        title: 'Financial Information',
        description: 'Essential financial details',
        completed: form.watch('completedSteps')?.includes('financial-info') || false,
        current: currentStep === 'financial-info'
      },
      {
        id: 'account-creation',
        title: 'Create Account & Submit',
        description: 'Account creation and final submission',
        completed: form.watch('completedSteps')?.includes('account-creation') || false,
        current: currentStep === 'account-creation'
      }
    );

    return baseSteps;
  };

  const steps = getStepsForLoanType();

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  const saveDraftToLocalStorage = () => {
    const formData = form.getValues();
    localStorage.setItem('loanApplicationDraft', JSON.stringify(formData));
    toast.success('Draft saved locally');
  };

  const handleStepComplete = (stepId: ApplicationStepId) => {
    const completedSteps = form.getValues('completedSteps') || [];
    if (!completedSteps.includes(stepId)) {
      form.setValue('completedSteps', [...completedSteps, stepId]);
    }
    saveDraftToLocalStorage();
    
    // Auto-advance to next step except for final step
    if (stepId !== 'account-creation') {
      setTimeout(() => {
        nextStep();
      }, 500);
    }
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

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'personal-kyc':
        return <PersonalInfoKYCStep form={form} applicationId={applicationId} onComplete={() => handleStepComplete('personal-kyc')} />;
      case 'education-career':
        return <EducationCareerStep form={form} applicationId={applicationId} onComplete={() => handleStepComplete('education-career')} />;
      case 'professional-employment':
        return <ProfessionalEmploymentStep form={form} applicationId={applicationId} onComplete={() => handleStepComplete('professional-employment')} />;
      case 'program-info':
        return <ProgramInfoStep form={form} applicationId={applicationId} onComplete={() => handleStepComplete('program-info')} />;
      case 'financial-info':
        return <FinancialInfoStep form={form} applicationId={applicationId} onComplete={() => handleStepComplete('financial-info')} />;
      case 'loan-type':
        return <LoanTypeStep form={form} loanOption={loanOption} onComplete={() => handleStepComplete('loan-type')} />;
      case 'account-creation':
        return <AccountCreationStep form={form} onComplete={onComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2 min-h-[44px] w-full sm:w-auto">
          <ArrowLeft className="h-4 w-4" />
          Back to Loan Options
        </Button>
        <div className="text-center flex-1 order-first sm:order-none">
          <h1 className="text-xl sm:text-2xl font-medium">Loan Application</h1>
          <p className="text-muted-foreground text-sm sm:text-base">{loanOption.lenderName}</p>
        </div>
        <Button variant="outline" onClick={saveDraftToLocalStorage} className="min-h-[44px] w-full sm:w-auto">
          <Save className="h-4 w-4 mr-2" />
          <span className="sm:inline">Save Draft</span>
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
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {steps.map((step, index) => (
              <div key={step.id} className="text-center flex-shrink-0 min-w-[80px]">
                <div className={`w-10 h-10 sm:w-8 sm:h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-medium ${
                  step.completed 
                    ? 'bg-green-500 text-white' 
                    : step.current 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step.completed ? <CheckCircle className="h-4 w-4" /> : index + 1}
                </div>
                <p className="text-xs text-muted-foreground text-center leading-tight">{step.title}</p>
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStepIndex === 0}
          className="min-h-[44px] w-full sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {currentStepIndex !== steps.length - 1 && (
            <Button onClick={nextStep} className="min-h-[44px] w-full sm:w-auto">
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
