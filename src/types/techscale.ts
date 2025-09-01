
export interface UserProfile {
  countryOfOrigin: string;
  destination?: string;
  loanPurpose: 'study-abroad' | 'upskilling' | 'career-development';
  incomeRange: string;
  employmentStatus: string;
  userType: 'student' | 'professional';
  institution?: string;
  loanAmount?: string;
  hasCoSigner: boolean;
  creditHistory: string;
}

export interface LoanOption {
  id: string;
  lenderName: string;
  lenderLogo?: string;
  aprRange: string;
  maxAmount: string;
  repaymentTerm: string;
  coSignerRequired: boolean;
  gracePeriod: string;
  eligibilityTier: 'green' | 'yellow' | 'red';
  features: string[];
  applicationUrl: string;
  description: string;
  processingTime: string;
  specialOffers?: string;
}

export interface CreditScore {
  score: number;
  tier: 'excellent' | 'good' | 'fair' | 'needs-improvement';
  factors: {
    income: number;
    employment: number;
    education: number;
    coSigner: number;
  };
  tips: string[];
}
