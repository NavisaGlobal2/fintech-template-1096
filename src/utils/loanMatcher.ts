
import { UserProfile, LoanOption } from '@/types/techscale';

// Mock lender data
const MOCK_LENDERS: LoanOption[] = [
  {
    id: '1',
    lenderName: 'Global Education Finance',
    aprRange: '4.5% - 12.8%',
    maxAmount: '£250,000',
    repaymentTerm: '5-20 years',
    coSignerRequired: false,
    gracePeriod: '6 months',
    eligibilityTier: 'green',
    features: ['No co-signer required', 'Flexible repayment', 'Grace period during studies'],
    applicationUrl: '#',
    description: 'Specialized in international education financing for African students',
    processingTime: '2-3 weeks',
    specialOffers: 'No origination fees for African students'
  },
  {
    id: '2',
    lenderName: 'Africa Skills Fund',
    aprRange: '6.2% - 15.9%',
    maxAmount: '£125,000',
    repaymentTerm: '3-15 years',
    coSignerRequired: true,
    gracePeriod: '3 months',
    eligibilityTier: 'green',
    features: ['Africa-focused', 'Career counseling included', 'Alumni network access'],
    applicationUrl: '#',
    description: 'Dedicated to empowering African professionals through education financing',
    processingTime: '1-2 weeks'
  },
  {
    id: '3',
    lenderName: 'International Study Loans',
    aprRange: '5.8% - 18.2%',
    maxAmount: '£200,000',
    repaymentTerm: '5-25 years',
    coSignerRequired: false,
    gracePeriod: '9 months',
    eligibilityTier: 'yellow',
    features: ['Global coverage', 'Multiple currency options', 'Online application'],
    applicationUrl: '#',
    description: 'Comprehensive education financing for international students worldwide',
    processingTime: '3-4 weeks'
  },
  {
    id: '4',
    lenderName: 'Career Boost Finance',
    aprRange: '7.5% - 16.4%',
    maxAmount: '£80,000',
    repaymentTerm: '2-10 years',
    coSignerRequired: true,
    gracePeriod: '1 month',
    eligibilityTier: 'green',
    features: ['Upskilling focus', 'Quick approval', 'Employer partnerships'],
    applicationUrl: '#',
    description: 'Fast financing solutions for professional development and upskilling',
    processingTime: '5-7 days'
  },
  {
    id: '5',
    lenderName: 'Premium Education Capital',
    aprRange: '3.9% - 11.5%',
    maxAmount: '£400,000',
    repaymentTerm: '5-30 years',
    coSignerRequired: true,
    gracePeriod: '12 months',
    eligibilityTier: 'yellow',
    features: ['Premium institutions', 'Lowest rates', 'Comprehensive coverage'],
    applicationUrl: '#',
    description: 'Premium financing for top-tier international universities',
    processingTime: '4-6 weeks'
  }
];

export const matchLoansToUser = (profile: UserProfile): LoanOption[] => {
  const matches = MOCK_LENDERS.map(lender => {
    let eligibilityTier: 'green' | 'yellow' | 'red' = 'green';
    
    // Simple matching logic
    const incomeScore = getIncomeScore(profile.incomeRange);
    const employmentScore = getEmploymentScore(profile.employmentStatus);
    const creditScore = getCreditScore(profile.creditHistory);
    const coSignerBonus = profile.hasCoSigner ? 20 : 0;
    
    const totalScore = incomeScore + employmentScore + creditScore + coSignerBonus;
    
    if (totalScore >= 80) {
      eligibilityTier = 'green';
    } else if (totalScore >= 60) {
      eligibilityTier = 'yellow';
    } else {
      eligibilityTier = 'red';
    }
    
    // Apply lender-specific logic
    if (lender.coSignerRequired && !profile.hasCoSigner) {
      eligibilityTier = 'yellow';
    }
    
    if (profile.loanPurpose === 'upskilling' && lender.lenderName === 'Career Boost Finance') {
      eligibilityTier = 'green';
    }
    
    return {
      ...lender,
      eligibilityTier
    };
  });
  
  // Sort by eligibility tier and then by relevance
  return matches.sort((a, b) => {
    const tierOrder = { green: 0, yellow: 1, red: 2 };
    if (tierOrder[a.eligibilityTier] !== tierOrder[b.eligibilityTier]) {
      return tierOrder[a.eligibilityTier] - tierOrder[b.eligibilityTier];
    }
    return 0;
  });
};

const getIncomeScore = (incomeRange: string): number => {
  switch (incomeRange) {
    case 'over-100k': return 40;
    case '50k-100k': return 35;
    case '25k-50k': return 25;
    case '10k-25k': return 15;
    case 'under-10k': return 5;
    default: return 0;
  }
};

const getEmploymentScore = (employmentStatus: string): number => {
  switch (employmentStatus) {
    case 'employed-full-time': return 30;
    case 'self-employed': return 25;
    case 'employed-part-time': return 20;
    case 'student': return 15;
    case 'unemployed': return 5;
    default: return 0;
  }
};

const getCreditScore = (creditHistory: string): number => {
  switch (creditHistory) {
    case 'excellent': return 30;
    case 'good': return 25;
    case 'fair': return 15;
    case 'limited': return 10;
    case 'none': return 5;
    default: return 0;
  }
};
