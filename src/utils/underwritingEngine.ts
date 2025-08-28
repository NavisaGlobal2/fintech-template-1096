import { FullLoanApplication } from '@/types/loanApplication';

export interface UnderwritingRule {
  id: string;
  rule_name: string;
  rule_type: 'income' | 'education' | 'employment' | 'credit' | 'sponsor';
  conditions: Record<string, any>;
  weight: number;
  active: boolean;
}

export interface RiskAssessment {
  riskScore: number;
  riskTier: 'low' | 'medium' | 'high';
  decision: 'auto-approve' | 'manual-review' | 'decline';
  affordabilityScore: number;
  educationScore: number;
  employmentScore: number;
  sponsorScore: number;
  factors: {
    income: { score: number; details: string };
    education: { score: number; details: string };
    employment: { score: number; details: string };
    sponsor: { score: number; details: string };
  };
}

export class UnderwritingEngine {
  private rules: UnderwritingRule[] = [];

  constructor(rules: UnderwritingRule[]) {
    this.rules = rules.filter(rule => rule.active);
  }

  assessApplication(application: FullLoanApplication): RiskAssessment {
    const incomeScore = this.calculateIncomeScore(application);
    const educationScore = this.calculateEducationScore(application);
    const employmentScore = this.calculateEmploymentScore(application);
    const sponsorScore = this.calculateSponsorScore(application);

    // Calculate weighted risk score (0-100, higher is better)
    const totalScore = (incomeScore.score * 0.3) + 
                      (educationScore.score * 0.25) + 
                      (employmentScore.score * 0.25) + 
                      (sponsorScore.score * 0.2);

    const riskTier = this.determineRiskTier(totalScore);
    const decision = this.makeDecision(riskTier, totalScore);

    return {
      riskScore: Math.round(totalScore),
      riskTier,
      decision,
      affordabilityScore: incomeScore.score,
      educationScore: educationScore.score,
      employmentScore: employmentScore.score,
      sponsorScore: sponsorScore.score,
      factors: {
        income: incomeScore,
        education: educationScore,
        employment: employmentScore,
        sponsor: sponsorScore
      }
    };
  }

  private calculateIncomeScore(application: FullLoanApplication): { score: number; details: string } {
    const incomeStr = application.financialInfo?.householdIncome || '0';
    const income = this.parseIncome(incomeStr);

    if (income >= 50000) {
      return { score: 85, details: 'High income provides strong repayment capacity' };
    } else if (income >= 25000) {
      return { score: 65, details: 'Medium income with adequate repayment capacity' };
    } else if (income >= 15000) {
      return { score: 45, details: 'Lower income requires careful assessment' };
    } else {
      return { score: 25, details: 'Very low income presents significant risk' };
    }
  }

  private calculateEducationScore(application: FullLoanApplication): { score: number; details: string } {
    const qualification = application.educationCareer?.highestQualification?.toLowerCase() || '';
    
    if (qualification.includes('masters') || qualification.includes('phd') || qualification.includes('doctorate')) {
      return { score: 90, details: 'Advanced degree indicates strong earning potential' };
    } else if (qualification.includes('bachelor') || qualification.includes('degree')) {
      return { score: 75, details: 'University degree shows good educational foundation' };
    } else if (qualification.includes('diploma') || qualification.includes('certificate')) {
      return { score: 55, details: 'Professional qualification provides some advantage' };
    } else {
      return { score: 35, details: 'Limited formal education may impact earning potential' };
    }
  }

  private calculateEmploymentScore(application: FullLoanApplication): { score: number; details: string } {
    const employment = application.financialInfo?.householdIncome || '0';
    const hasCurrentJob = application.educationCareer?.currentEmployment;
    
    if (hasCurrentJob && parseFloat(employment) > 0) {
      const company = hasCurrentJob.company;
      const position = hasCurrentJob.position;
      
      if (company && position) {
        return { score: 80, details: 'Stable employment with regular income' };
      }
      return { score: 65, details: 'Employment confirmed but limited details' };
    } else if (parseFloat(employment) > 0) {
      return { score: 50, details: 'Income reported but employment status unclear' };
    } else {
      return { score: 30, details: 'No clear employment or income source' };
    }
  }

  private calculateSponsorScore(application: FullLoanApplication): { score: number; details: string } {
    // This would typically check for co-signer information
    // For now, we'll use a basic assessment based on application completeness
    const hasCompleteInfo = application.personalInfo?.firstName && 
                           application.personalInfo?.lastName && 
                           application.personalInfo?.phone;
    
    if (hasCompleteInfo) {
      return { score: 70, details: 'Complete personal information provided' };
    } else {
      return { score: 40, details: 'Incomplete personal information' };
    }
  }

  private parseIncome(incomeStr: string): number {
    // Extract numbers from income string
    const match = incomeStr.match(/[\d,]+/);
    if (match) {
      return parseInt(match[0].replace(/,/g, ''));
    }
    return 0;
  }

  private determineRiskTier(score: number): 'low' | 'medium' | 'high' {
    if (score >= 75) return 'low';
    if (score >= 50) return 'medium';
    return 'high';
  }

  private makeDecision(riskTier: 'low' | 'medium' | 'high', score: number): 'auto-approve' | 'manual-review' | 'decline' {
    if (riskTier === 'low' && score >= 80) return 'auto-approve';
    if (riskTier === 'high' && score < 35) return 'decline';
    return 'manual-review';
  }
}