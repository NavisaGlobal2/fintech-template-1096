
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  nationality: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  phone: string;
  email: string;
}

export interface KYCDocuments {
  passportId: {
    uploaded: boolean;
    fileUrl?: string;
    fileName?: string;
    verified?: boolean;
  };
  proofOfResidence: {
    uploaded: boolean;
    fileUrl?: string;
    fileName?: string;
    verified?: boolean;
  };
}

export interface EducationCareer {
  highestQualification: string;
  institution: string;
  graduationYear: string;
  transcripts: {
    uploaded: boolean;
    fileUrl?: string;
    fileName?: string;
    verified?: boolean;
  };
  resume: {
    uploaded: boolean;
    fileUrl?: string;
    fileName?: string;
    verified?: boolean;
  };
  currentEmployment?: {
    company: string;
    position: string;
    startDate: string;
    salary: string;
  };
}

export interface ProgramInfo {
  institution: string;
  programName: string;
  duration: string;
  startDate: string;
  totalCost: string;
  costBreakdown: {
    tuition: string;
    livingExpenses: string;
    other: string;
  };
  acceptanceLetter: {
    uploaded: boolean;
    fileUrl?: string;
    fileName?: string;
    verified?: boolean;
  };
}

export interface FinancialInfo {
  householdIncome: string;
  dependents: number;
  bankAccount: {
    bankName: string;
    accountType: string;
    accountNumber?: string;
    sortCode?: string;
  };
  bankStatements: {
    uploaded: boolean;
    fileUrl?: string;
    fileName?: string;
    verified?: boolean;
  };
  existingLoans: string;
  otherIncome?: string;
}

export type LoanTypeRequest = 'study-abroad' | 'career-microloan' | 'sponsor-match';

export interface LoanTypeDetails {
  type: LoanTypeRequest;
  amount: string;
  purpose: string;
  repaymentPreference: string;
}

export interface Declarations {
  creditCheckConsent: boolean;
  dataPrivacyConsent: boolean;
  termsAndConditions: boolean;
  marketingConsent: boolean;
  signatureDate: string;
  signatureImage?: string;
}

export interface FullLoanApplication {
  id?: string;
  userId?: string;  // Made optional since users create accounts at the end
  loanOptionId: string;
  lenderName: string;
  personalInfo: PersonalInfo;
  kycDocuments: KYCDocuments;
  educationCareer: EducationCareer;
  programInfo: ProgramInfo;
  financialInfo: FinancialInfo;
  loanTypeRequest: LoanTypeDetails;
  declarations: Declarations;
  isDraft: boolean;
  completedSteps: string[];
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected';
  createdAt?: string;
  updatedAt?: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewerNotes?: string;
}

export interface ApplicationStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export type ApplicationStepId = 
  | 'personal-kyc'
  | 'education-career'
  | 'program-info'
  | 'financial-info'
  | 'loan-type'
  | 'account-creation';
