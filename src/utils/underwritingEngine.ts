
import { FullLoanApplication } from '@/types/loanApplication';
import { supabase } from '@/integrations/supabase/client';

export interface UnderwritingRule {
  id: string;
  rule_name: string;
  rule_type: 'income' | 'education' | 'employment' | 'credit' | 'sponsor';
  conditions: any;
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
    income: string[];
    education: string[];
    employment: string[];
    credit: string[];
    sponsor: string[];
  };
}

export class UnderwritingEngine {
  private rules: UnderwritingRule[] = [];

  async loadRules(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('underwriting_rules')
        .select('*')
        .eq('active', true);

      if (error) throw error;
      this.rules = data || [];
    } catch (error) {
      console.error('Error loading underwriting rules:', error);
      this.rules = [];
    }
  }

  async assessApplication(application: FullLoanApplication): Promise<RiskAssessment> {
    await this.loadRules();

    const affordabilityScore = this.calculateAffordabilityScore(application);
    const educationScore = this.calculateEducationScore(application);
    const employmentScore = this.calculateEmploymentScore(application);
    const sponsorScore = this.calculateSponsorScore(application);

    const totalScore = (affordabilityScore + educationScore + employmentScore + sponsorScore) / 4;
    
    const riskTier = this.determineRiskTier(totalScore);
    const decision = this.makeDecision(riskTier, totalScore);

    return {
      riskScore: Math.round(totalScore * 100) / 100,
      riskTier,
      decision,
      affordabilityScore: Math.round(affordabilityScore * 100) / 100,
      educationScore: Math.round(educationScore * 100) / 100,
      employmentScore: Math.round(employmentScore * 100) / 100,
      sponsorScore: Math.round(sponsorScore * 100) / 100,
      factors: this.generateFactorExplanations(application, {
        affordabilityScore,
        educationScore,
        employmentScore,
        sponsorScore
      })
    };
  }

  private calculateAffordabilityScore(application: FullLoanApplication): number {
    const financialInfo = application.financialInfo;
    if (!financialInfo?.householdIncome) return 0;

    const incomeRanges = {
      'under-10k': 5000,
      '10k-25k': 17500,
      '25k-50k': 37500,
      '50k-100k': 75000,
      'over-100k': 120000
    };

    const estimatedIncome = incomeRanges[financialInfo.householdIncome as keyof typeof incomeRanges] || 0;
    const loanAmount = parseFloat(application.loanTypeRequest?.amount?.replace(/[£,]/g, '') || '0');
    
    if (loanAmount === 0) return 0;

    const debtToIncomeRatio = loanAmount / estimatedIncome;
    
    // Score based on debt-to-income ratio (lower is better)
    if (debtToIncomeRatio < 0.3) return 10;
    if (debtToIncomeRatio < 0.5) return 8;
    if (debtToIncomeRatio < 0.8) return 6;
    if (debtToIncomeRatio < 1.2) return 4;
    return 2;
  }

  private calculateEducationScore(application: FullLoanApplication): number {
    const education = application.educationCareer;
    if (!education) return 0;

    let score = 0;

    // Base education score
    const qualificationScores = {
      'high-school': 2,
      'some-college': 4,
      'bachelors': 7,
      'masters': 9,
      'phd': 10
    };

    score += qualificationScores[education.highestQualification as keyof typeof qualificationScores] || 0;

    // Institution prestige (simplified)
    if (education.institution?.toLowerCase().includes('university')) {
      score += 2;
    }

    // Recent graduation bonus
    const currentYear = new Date().getFullYear();
    const gradYear = parseInt(education.graduationYear || '0');
    if (gradYear >= currentYear - 5) {
      score += 1;
    }

    return Math.min(score, 10);
  }

  private calculateEmploymentScore(application: FullLoanApplication): number {
    const employment = application.educationCareer?.currentEmployment;
    const personalInfo = application.personalInfo;
    
    if (!employment && !personalInfo) return 0;

    let score = 0;

    // Employment status from profile (if available)
    // This would need to be enhanced with actual employment status from the application
    
    // For now, we'll use a simplified scoring based on employment presence
    if (employment?.company && employment?.position) {
      score += 6;
      
      // Salary information
      if (employment.salary) {
        const salaryValue = parseFloat(employment.salary.replace(/[£,]/g, ''));
        if (salaryValue > 50000) score += 4;
        else if (salaryValue > 25000) score += 2;
        else score += 1;
      }
    }

    return Math.min(score, 10);
  }

  private calculateSponsorScore(application: FullLoanApplication): number {
    // This would need to be enhanced with actual co-signer information
    // For now, we'll return a neutral score
    return 5;
  }

  private determineRiskTier(score: number): 'low' | 'medium' | 'high' {
    if (score >= 7.5) return 'low';
    if (score >= 5.0) return 'medium';
    return 'high';
  }

  private makeDecision(riskTier: 'low' | 'medium' | 'high', score: number): 'auto-approve' | 'manual-review' | 'decline' {
    switch (riskTier) {
      case 'low':
        return score >= 8.0 ? 'auto-approve' : 'manual-review';
      case 'medium':
        return 'manual-review';
      case 'high':
        return score < 3.0 ? 'decline' : 'manual-review';
      default:
        return 'manual-review';
    }
  }

  private generateFactorExplanations(application: FullLoanApplication, scores: any) {
    return {
      income: [
        scores.affordabilityScore >= 8 ? 'Strong income relative to loan amount' : 
        scores.affordabilityScore >= 6 ? 'Adequate income for loan size' : 'Income may be insufficient for requested amount'
      ],
      education: [
        scores.educationScore >= 8 ? 'Strong educational background' : 
        scores.educationScore >= 6 ? 'Good educational qualifications' : 'Limited educational credentials'
      ],
      employment: [
        scores.employmentScore >= 8 ? 'Stable, well-paying employment' : 
        scores.employmentScore >= 6 ? 'Decent employment situation' : 'Employment concerns identified'
      ],
      credit: ['Credit assessment pending'],
      sponsor: ['Co-signer evaluation needed']
    };
  }

  async saveAssessment(applicationId: string, userId: string, assessment: RiskAssessment): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('underwriting_assessments')
        .insert({
          application_id: applicationId,
          user_id: userId,
          risk_score: assessment.riskScore,
          risk_tier: assessment.riskTier,
          decision: assessment.decision,
          affordability_score: assessment.affordabilityScore,
          education_score: assessment.educationScore,
          employment_score: assessment.employmentScore,
          sponsor_score: assessment.sponsorScore,
          assessment_data: assessment.factors
        })
        .select()
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error saving assessment:', error);
      return null;
    }
  }
}
