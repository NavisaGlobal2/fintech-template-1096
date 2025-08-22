
import { RiskAssessment } from './underwritingEngine';
import { FullLoanApplication } from '@/types/loanApplication';
import { supabase } from '@/integrations/supabase/client';

export interface LoanOffer {
  id?: string;
  offerType: 'loan' | 'isa' | 'hybrid';
  loanAmount: number;
  aprRate?: number;
  isaPercentage?: number;
  repaymentTermMonths: number;
  gracePeriodMonths: number;
  monthlyPayment?: number;
  totalRepayment?: number;
  repaymentSchedule: any;
  termsAndConditions: any;
  offerValidUntil: Date;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

export class OfferGenerator {
  generateOffer(
    application: FullLoanApplication, 
    assessment: RiskAssessment
  ): LoanOffer | null {
    if (assessment.decision === 'decline') {
      return null;
    }

    const requestedAmount = parseFloat(
      application.loanTypeRequest?.amount?.replace(/[£,]/g, '') || '0'
    );

    if (requestedAmount === 0) return null;

    const baseOffer = this.createBaseOffer(application, assessment, requestedAmount);
    
    // Adjust offer based on risk assessment
    return this.adjustOfferForRisk(baseOffer, assessment);
  }

  private createBaseOffer(
    application: FullLoanApplication,
    assessment: RiskAssessment,
    amount: number
  ): LoanOffer {
    const offerValidUntil = new Date();
    offerValidUntil.setDate(offerValidUntil.getDate() + 14); // 14 days validity

    // Determine offer type based on application purpose
    const isStudyAbroad = application.loanTypeRequest?.type === 'study-abroad';
    const offerType = this.determineOfferType(application, assessment);

    return {
      offerType,
      loanAmount: amount,
      aprRate: isStudyAbroad ? 8.5 : 12.0, // Base rates
      isaPercentage: offerType === 'isa' ? 10.0 : undefined,
      repaymentTermMonths: isStudyAbroad ? 180 : 60, // 15 years for study, 5 for career
      gracePeriodMonths: isStudyAbroad ? 6 : 1,
      repaymentSchedule: {},
      termsAndConditions: this.generateTermsAndConditions(offerType),
      offerValidUntil,
      status: 'pending'
    };
  }

  private determineOfferType(
    application: FullLoanApplication,
    assessment: RiskAssessment
  ): 'loan' | 'isa' | 'hybrid' {
    const loanPurpose = application.loanTypeRequest?.type;
    
    // ISA for career development with uncertain income
    if (loanPurpose === 'career-development' && assessment.riskTier === 'medium') {
      return 'isa';
    }
    
    // Hybrid for medium risk study abroad
    if (loanPurpose === 'study-abroad' && assessment.riskTier === 'medium') {
      return 'hybrid';
    }
    
    // Traditional loan for low risk or established income
    return 'loan';
  }

  private adjustOfferForRisk(offer: LoanOffer, assessment: RiskAssessment): LoanOffer {
    const riskMultiplier = {
      'low': 0.8,    // Better terms for low risk
      'medium': 1.0,  // Standard terms
      'high': 1.3     // Higher rates for high risk
    };

    const multiplier = riskMultiplier[assessment.riskTier];

    // Adjust APR based on risk
    if (offer.aprRate) {
      offer.aprRate = Math.round(offer.aprRate * multiplier * 100) / 100;
      offer.aprRate = Math.min(offer.aprRate, 24.0); // Cap at 24%
    }

    // Adjust ISA percentage
    if (offer.isaPercentage) {
      offer.isaPercentage = Math.round(offer.isaPercentage * multiplier * 100) / 100;
      offer.isaPercentage = Math.min(offer.isaPercentage, 15.0); // Cap at 15%
    }

    // Calculate monthly payment for loans
    if (offer.offerType === 'loan' && offer.aprRate) {
      offer.monthlyPayment = this.calculateMonthlyPayment(
        offer.loanAmount,
        offer.aprRate,
        offer.repaymentTermMonths,
        offer.gracePeriodMonths
      );
      offer.totalRepayment = offer.monthlyPayment * offer.repaymentTermMonths;
    }

    // Generate repayment schedule
    offer.repaymentSchedule = this.generateRepaymentSchedule(offer);

    return offer;
  }

  private calculateMonthlyPayment(
    principal: number,
    annualRate: number,
    termMonths: number,
    gracePeriodMonths: number
  ): number {
    const monthlyRate = annualRate / 100 / 12;
    const paymentTermMonths = termMonths - gracePeriodMonths;
    
    if (monthlyRate === 0) {
      return principal / paymentTermMonths;
    }

    // Account for interest during grace period
    const principalAfterGrace = principal * Math.pow(1 + monthlyRate, gracePeriodMonths);
    
    const monthlyPayment = principalAfterGrace * 
      (monthlyRate * Math.pow(1 + monthlyRate, paymentTermMonths)) /
      (Math.pow(1 + monthlyRate, paymentTermMonths) - 1);

    return Math.round(monthlyPayment * 100) / 100;
  }

  private generateRepaymentSchedule(offer: LoanOffer): any {
    if (offer.offerType === 'isa') {
      return {
        type: 'income_share',
        percentage: offer.isaPercentage,
        minimum_income_threshold: 25000,
        maximum_payment_period_months: offer.repaymentTermMonths,
        payment_cap: offer.loanAmount * 1.5
      };
    }

    return {
      type: 'fixed_monthly',
      monthly_payment: offer.monthlyPayment,
      grace_period_months: offer.gracePeriodMonths,
      total_payments: offer.repaymentTermMonths - offer.gracePeriodMonths
    };
  }

  private generateTermsAndConditions(offerType: 'loan' | 'isa' | 'hybrid'): any {
    const commonTerms = {
      origination_fee: 0,
      prepayment_penalty: false,
      late_fee_percentage: 5.0,
      default_grace_period_days: 15
    };

    if (offerType === 'isa') {
      return {
        ...commonTerms,
        income_verification_required: true,
        employment_status_updates_required: true,
        minimum_income_threshold: 25000,
        payment_cap_multiplier: 1.5
      };
    }

    return {
      ...commonTerms,
      fixed_rate: true,
      rate_change_notification_days: 30
    };
  }

  async saveOffer(
    assessmentId: string,
    applicationId: string,
    userId: string,
    offer: LoanOffer
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('loan_offers')
        .insert({
          assessment_id: assessmentId,
          application_id: applicationId,
          user_id: userId,
          offer_type: offer.offerType,
          loan_amount: offer.loanAmount,
          apr_rate: offer.aprRate,
          isa_percentage: offer.isaPercentage,
          repayment_term_months: offer.repaymentTermMonths,
          grace_period_months: offer.gracePeriodMonths,
          repayment_schedule: offer.repaymentSchedule,
          terms_and_conditions: offer.termsAndConditions,
          offer_valid_until: offer.offerValidUntil.toISOString(),
          status: offer.status
        })
        .select()
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error saving offer:', error);
      return null;
    }
  }
}
