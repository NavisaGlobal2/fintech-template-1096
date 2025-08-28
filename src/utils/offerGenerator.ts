import { RiskAssessment } from './underwritingEngine';
import { FullLoanApplication } from '@/types/loanApplication';

export interface LoanOffer {
  offerType: 'loan' | 'isa' | 'hybrid';
  loanAmount: number;
  aprRate?: number;
  isaPercentage?: number;
  repaymentTermMonths: number;
  gracePeriodMonths: number;
  repaymentSchedule: {
    monthlyPayment?: number;
    totalRepayment?: number;
    firstPaymentDate: string;
  };
  termsAndConditions: {
    eligibilityRequirements: string[];
    specialConditions: string[];
    benefits: string[];
  };
  offerValidUntil: string;
}

export class OfferGenerator {
  generateOffer(
    application: FullLoanApplication, 
    assessment: RiskAssessment
  ): LoanOffer {
    const requestedAmount = this.parseAmount(application.loanTypeRequest?.amount || '10000');
    const adjustedAmount = this.calculateLoanAmount(requestedAmount, assessment);
    const offerType = this.determineOfferType(assessment, application);
    
    // Set offer valid for 14 days
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 14);

    if (offerType === 'loan') {
      return this.generateLoanOffer(adjustedAmount, assessment, validUntil);
    } else if (offerType === 'isa') {
      return this.generateISAOffer(adjustedAmount, assessment, validUntil);
    } else {
      return this.generateHybridOffer(adjustedAmount, assessment, validUntil);
    }
  }

  private generateLoanOffer(amount: number, assessment: RiskAssessment, validUntil: Date): LoanOffer {
    const apr = this.calculateAPR(assessment);
    const termMonths = this.calculateRepaymentTerm(assessment);
    const gracePeriod = assessment.riskTier === 'low' ? 6 : 3;

    const monthlyRate = apr / 100 / 12;
    const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                          (Math.pow(1 + monthlyRate, termMonths) - 1);

    return {
      offerType: 'loan',
      loanAmount: amount,
      aprRate: apr,
      repaymentTermMonths: termMonths,
      gracePeriodMonths: gracePeriod,
      repaymentSchedule: {
        monthlyPayment: Math.round(monthlyPayment),
        totalRepayment: Math.round(monthlyPayment * termMonths),
        firstPaymentDate: this.calculateFirstPaymentDate(gracePeriod)
      },
      termsAndConditions: {
        eligibilityRequirements: [
          'Must maintain student enrollment status',
          'Regular income verification required',
          'Annual credit check compliance'
        ],
        specialConditions: assessment.riskTier === 'low' ? [
          'Early repayment allowed without penalty',
          'Rate reduction available with on-time payments'
        ] : [
          'Co-signer may be required',
          'Additional documentation needed'
        ],
        benefits: [
          'Flexible repayment options',
          'Career support services included',
          '24/7 customer support'
        ]
      },
      offerValidUntil: validUntil.toISOString()
    };
  }

  private generateISAOffer(amount: number, assessment: RiskAssessment, validUntil: Date): LoanOffer {
    const isaPercentage = this.calculateISAPercentage(assessment);
    const termMonths = 60; // 5 years typical for ISA

    return {
      offerType: 'isa',
      loanAmount: amount,
      isaPercentage,
      repaymentTermMonths: termMonths,
      gracePeriodMonths: 6,
      repaymentSchedule: {
        firstPaymentDate: this.calculateFirstPaymentDate(6)
      },
      termsAndConditions: {
        eligibilityRequirements: [
          'Must secure employment within 12 months',
          'Minimum income threshold of £25,000',
          'Regular income reporting required'
        ],
        specialConditions: [
          `Pay ${isaPercentage}% of gross income for ${termMonths} months`,
          'Payment cap at 1.5x original amount',
          'No payments if income below £25,000'
        ],
        benefits: [
          'No payments until employed',
          'Payment adjusts with income',
          'Career coaching included'
        ]
      },
      offerValidUntil: validUntil.toISOString()
    };
  }

  private generateHybridOffer(amount: number, assessment: RiskAssessment, validUntil: Date): LoanOffer {
    const loanPortion = Math.floor(amount * 0.6); // 60% as traditional loan
    const isaPortion = amount - loanPortion; // 40% as ISA
    const apr = this.calculateAPR(assessment) + 1; // Slightly higher for complexity
    const isaPercentage = this.calculateISAPercentage(assessment) - 1; // Slightly lower

    return {
      offerType: 'hybrid',
      loanAmount: amount,
      aprRate: apr,
      isaPercentage,
      repaymentTermMonths: 48,
      gracePeriodMonths: 6,
      repaymentSchedule: {
        monthlyPayment: Math.round((loanPortion * (apr / 100 / 12)) / (1 - Math.pow(1 + (apr / 100 / 12), -48))),
        firstPaymentDate: this.calculateFirstPaymentDate(6)
      },
      termsAndConditions: {
        eligibilityRequirements: [
          'Must maintain enrollment or employment status',
          'Income verification required',
          'Annual review meetings'
        ],
        specialConditions: [
          `£${loanPortion} as traditional loan at ${apr}% APR`,
          `£${isaPortion} as ISA at ${isaPercentage}% of income`,
          'ISA portion capped at 1.3x original amount'
        ],
        benefits: [
          'Lower risk with dual structure',
          'Flexible repayment on ISA portion',
          'Comprehensive support services'
        ]
      },
      offerValidUntil: validUntil.toISOString()
    };
  }

  private calculateLoanAmount(requested: number, assessment: RiskAssessment): number {
    let maxAmount = requested;

    // Adjust based on risk assessment
    if (assessment.riskTier === 'high') {
      maxAmount = Math.min(requested, 15000);
    } else if (assessment.riskTier === 'medium') {
      maxAmount = Math.min(requested, 35000);
    } else {
      maxAmount = Math.min(requested, 50000);
    }

    // Further adjust based on affordability
    const affordabilityAdjustment = assessment.affordabilityScore / 100;
    return Math.round(maxAmount * Math.max(0.5, affordabilityAdjustment));
  }

  private calculateAPR(assessment: RiskAssessment): number {
    let baseRate = 8.5; // Base APR

    if (assessment.riskTier === 'low') {
      baseRate = 6.5;
    } else if (assessment.riskTier === 'medium') {
      baseRate = 9.5;
    } else {
      baseRate = 12.5;
    }

    // Fine-tune based on overall score
    const scoreAdjustment = (80 - assessment.riskScore) * 0.05;
    return Math.round((baseRate + scoreAdjustment) * 10) / 10;
  }

  private calculateISAPercentage(assessment: RiskAssessment): number {
    if (assessment.riskTier === 'low') return 8;
    if (assessment.riskTier === 'medium') return 10;
    return 12;
  }

  private calculateRepaymentTerm(assessment: RiskAssessment): number {
    // Longer terms for higher risk (lower monthly payments)
    if (assessment.riskTier === 'low') return 36; // 3 years
    if (assessment.riskTier === 'medium') return 48; // 4 years
    return 60; // 5 years
  }

  private calculateFirstPaymentDate(gracePeriodMonths: number): string {
    const firstPayment = new Date();
    firstPayment.setMonth(firstPayment.getMonth() + gracePeriodMonths);
    return firstPayment.toISOString().split('T')[0];
  }

  private parseAmount(amountStr: string): number {
    const match = amountStr.match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, '')) : 10000;
  }

  private determineOfferType(assessment: RiskAssessment, application: FullLoanApplication): 'loan' | 'isa' | 'hybrid' {
    const loanType = application.loanTypeRequest?.type;
    
    if (loanType === 'career-microloan' || assessment.riskTier === 'high') {
      return 'isa';
    } else if (assessment.riskTier === 'low') {
      return 'loan';
    } else {
      return 'hybrid';
    }
  }
}