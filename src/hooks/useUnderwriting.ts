import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UnderwritingEngine, RiskAssessment } from '@/utils/underwritingEngine';
import { OfferGenerator, LoanOffer } from '@/utils/offerGenerator';
import { FullLoanApplication } from '@/types/loanApplication';
import { toast } from 'sonner';

export interface UnderwritingData {
  applications: any[];
  assessments: any[];
  offers: any[];
  loading: boolean;
}

export const useUnderwriting = () => {
  const [data, setData] = useState<UnderwritingData>({
    applications: [],
    assessments: [],
    offers: [],
    loading: true
  });

  const fetchUnderwritingData = async () => {
    try {
      const [applicationsRes, assessmentsRes, offersRes] = await Promise.all([
        supabase
          .from('loan_applications')
          .select('*')
          .eq('status', 'submitted'),
        supabase
          .from('underwriting_assessments')
          .select('*'),
        supabase
          .from('loan_offers')
          .select('*')
      ]);

      setData({
        applications: applicationsRes.data || [],
        assessments: assessmentsRes.data || [],
        offers: offersRes.data || [],
        loading: false
      });
    } catch (error) {
      console.error('Error fetching underwriting data:', error);
      toast.error('Failed to load underwriting data');
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const processApplication = async (application: any): Promise<{ assessment: RiskAssessment; offer: LoanOffer } | null> => {
    try {
      // Fetch underwriting rules (only accessible to authorized staff)
      const { data: rules, error: rulesError } = await supabase
        .from('underwriting_rules')
        .select('*')
        .eq('active', true);

      if (rulesError) {
        if (rulesError.code === 'PGRST116') {
          throw new Error('Access denied: Only authorized staff can process applications');
        }
        throw rulesError;
      }

      if (!rules || rules.length === 0) throw new Error('No underwriting rules found');

      // Create underwriting engine and assess application
      const engine = new UnderwritingEngine(rules as any);
      const assessment = engine.assessApplication(application);

      // Save assessment to database
      const { data: savedAssessment, error: assessmentError } = await supabase
        .from('underwriting_assessments')
        .insert({
          application_id: application.id,
          user_id: application.user_id,
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

      if (assessmentError) throw assessmentError;

      // Generate offer if approved or needs manual review
      if (assessment.decision !== 'decline') {
        const generator = new OfferGenerator();
        const offer = generator.generateOffer(application, assessment);

        // Save offer to database
        const { error: offerError } = await supabase
          .from('loan_offers')
          .insert({
            assessment_id: savedAssessment.id,
            application_id: application.id,
            user_id: application.user_id,
            offer_type: offer.offerType,
            loan_amount: offer.loanAmount,
            apr_rate: offer.aprRate,
            isa_percentage: offer.isaPercentage,
            repayment_term_months: offer.repaymentTermMonths,
            grace_period_months: offer.gracePeriodMonths,
            repayment_schedule: offer.repaymentSchedule,
            terms_and_conditions: offer.termsAndConditions,
            offer_valid_until: offer.offerValidUntil
          });

        if (offerError) throw offerError;

        return { assessment, offer };
      }

      return { assessment, offer: null as any };
    } catch (error) {
      console.error('Error processing application:', error);
      toast.error('Failed to process application');
      return null;
    }
  };

  const updateOfferStatus = async (offerId: string, status: 'accepted' | 'declined') => {
    try {
      const updateData = {
        status,
        [status === 'accepted' ? 'accepted_at' : 'declined_at']: new Date().toISOString()
      };

      const { error } = await supabase
        .from('loan_offers')
        .update(updateData)
        .eq('id', offerId);

      if (error) throw error;

      toast.success(`Offer ${status} successfully`);
      fetchUnderwritingData(); // Refresh data
    } catch (error) {
      console.error('Error updating offer status:', error);
      toast.error(`Failed to ${status} offer`);
    }
  };

  useEffect(() => {
    fetchUnderwritingData();
  }, []);

  return {
    data,
    processApplication,
    updateOfferStatus,
    refreshData: fetchUnderwritingData
  };
};