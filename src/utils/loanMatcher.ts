
import { UserProfile, LoanOption } from '@/types/techscale';
import { supabase } from '@/integrations/supabase/client';

// Convert database lender product to LoanOption format
const convertToLoanOption = (lender: any, product: any): LoanOption => {
  const aprRange = `${product.min_apr}% - ${product.max_apr}%`;
  const maxAmount = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0
  }).format(product.max_amount);
  const repaymentTerm = `${Math.floor(product.min_term_months / 12)}-${Math.floor(product.max_term_months / 12)} years`;
  const gracePeriod = product.grace_period_months > 0 ? `${product.grace_period_months} months` : 'No grace period';

  return {
    id: product.id,
    lenderName: lender.name,
    lenderLogo: lender.logo_url,
    aprRange,
    maxAmount,
    repaymentTerm,
    coSignerRequired: product.co_signer_required || false,
    gracePeriod,
    eligibilityTier: 'green', // Will be calculated later
    features: product.features || [],
    applicationUrl: product.application_url || '#',
    description: product.description || lender.description || '',
    processingTime: lender.processing_time_days ? `${lender.processing_time_days} days` : '2-3 weeks',
    specialOffers: lender.special_offers
  };
};

// Fetch active lenders and their products from database
export const fetchActiveLenders = async (): Promise<LoanOption[]> => {
  try {
    const { data, error } = await supabase
      .from('lender_products')
      .select(`
        *,
        lender:lenders (
          name,
          description,
          logo_url,
          processing_time_days,
          special_offers,
          status
        )
      `)
      .eq('status', 'active')
      .eq('lender.status', 'active');

    if (error) {
      console.error('Error fetching lenders:', error);
      return [];
    }

    return data.map(product => convertToLoanOption(product.lender, product));
  } catch (error) {
    console.error('Error in fetchActiveLenders:', error);
    return [];
  }
};

export const matchLoansToUser = async (profile: UserProfile): Promise<LoanOption[]> => {
  // Fetch active lenders from database
  const activeLenders = await fetchActiveLenders();
  
  if (activeLenders.length === 0) {
    console.warn('No active lenders found, falling back to mock data');
    return getMockLenders(profile);
  }
  const matches = activeLenders.map(lender => {
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

// Fallback mock data for development/testing
const getMockLenders = (profile: UserProfile): LoanOption[] => {
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
    }
  ];

  return MOCK_LENDERS.map(lender => {
    let eligibilityTier: 'green' | 'yellow' | 'red' = 'green';
    
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
    
    if (lender.coSignerRequired && !profile.hasCoSigner) {
      eligibilityTier = 'yellow';
    }
    
    return { ...lender, eligibilityTier };
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
