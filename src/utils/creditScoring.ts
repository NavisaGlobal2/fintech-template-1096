
import { UserProfile, CreditScore } from '@/types/techscale';

export const calculateCreditReadinessScore = (profile: UserProfile): CreditScore => {
  // Calculate individual factor scores
  const incomeScore = calculateIncomeScore(profile.incomeRange);
  const employmentScore = calculateEmploymentScore(profile.employmentStatus);
  const educationScore = calculateEducationScore(profile.fieldOfStudy, profile.loanPurpose);
  const coSignerScore = profile.hasCoSigner ? 20 : 0;
  
  // Calculate weighted total score
  const totalScore = Math.min(100, incomeScore + employmentScore + educationScore + coSignerScore);
  
  // Determine tier
  let tier: 'excellent' | 'good' | 'fair' | 'needs-improvement';
  if (totalScore >= 80) tier = 'excellent';
  else if (totalScore >= 65) tier = 'good';
  else if (totalScore >= 45) tier = 'fair';
  else tier = 'needs-improvement';
  
  // Generate improvement tips
  const tips = generateImprovementTips(profile, {
    income: incomeScore,
    employment: employmentScore,
    education: educationScore,
    coSigner: coSignerScore
  });
  
  return {
    score: totalScore,
    tier,
    factors: {
      income: Math.round((incomeScore / 40) * 100),
      employment: Math.round((employmentScore / 30) * 100),
      education: Math.round((educationScore / 10) * 100),
      coSigner: Math.round((coSignerScore / 20) * 100)
    },
    tips
  };
};

const calculateIncomeScore = (incomeRange: string): number => {
  switch (incomeRange) {
    case 'over-100k': return 40;
    case '50k-100k': return 35;
    case '25k-50k': return 25;
    case '10k-25k': return 15;
    case 'under-10k': return 5;
    default: return 0;
  }
};

const calculateEmploymentScore = (employmentStatus: string): number => {
  switch (employmentStatus) {
    case 'employed-full-time': return 30;
    case 'self-employed': return 25;
    case 'employed-part-time': return 20;
    case 'student': return 15;
    case 'unemployed': return 5;
    default: return 0;
  }
};

const calculateEducationScore = (fieldOfStudy: string, loanPurpose: string): number => {
  const highDemandFields = ['computer-science', 'data-science', 'engineering', 'medicine', 'finance'];
  let score = 5; // Base score
  
  if (highDemandFields.includes(fieldOfStudy)) {
    score += 3;
  }
  
  if (loanPurpose === 'upskilling') {
    score += 2;
  }
  
  return score;
};

const generateImprovementTips = (profile: UserProfile, scores: any): string[] => {
  const tips: string[] = [];
  
  if (scores.income < 25) {
    tips.push("Consider documenting additional income sources or wait until your income increases to improve loan eligibility.");
  }
  
  if (scores.employment < 25) {
    tips.push("Stable full-time employment significantly improves your loan approval chances. Consider securing employment before applying.");
  }
  
  if (!profile.hasCoSigner) {
    tips.push("Adding a co-signer with good credit can dramatically improve your approval odds and potentially lower interest rates.");
  }
  
  if (profile.creditHistory === 'none' || profile.creditHistory === 'limited') {
    tips.push("Start building credit history with a secured credit card or become an authorized user on someone else's account.");
  }
  
  if (!profile.institution) {
    tips.push("Having a confirmed institution acceptance can strengthen your loan application significantly.");
  }
  
  tips.push("Consider applying to multiple lenders to compare offers and increase your chances of approval.");
  
  if (tips.length === 1) {
    tips.push("Your profile looks strong! Consider getting pre-qualified to understand your exact loan terms.");
  }
  
  return tips.slice(0, 4); // Limit to 4 tips
};
