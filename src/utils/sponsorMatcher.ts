import { supabase } from '@/integrations/supabase/client';
import { FullLoanApplication } from '@/types/loanApplication';

export interface SponsorMatch {
  sponsorId: string;
  sponsorName: string;
  matchScore: number;
  reason: string;
  fundingAvailable: number;
  expertise: string[];
}

/**
 * Automatically matches applicants with suitable sponsors based on:
 * - Field of study/career goals
 * - Location and destination
 * - Funding requirements
 * - Sponsor availability and preferences
 */
export const findBestSponsorMatch = async (
  application: FullLoanApplication
): Promise<SponsorMatch | null> => {
  try {
    console.log('🔍 Finding best sponsor match for application...');
    
    // Query active sponsors from database
    const { data: sponsors, error } = await supabase
      .from('sponsors')
      .select('*')
      .eq('status', 'active')
      .gt('current_capacity', 0);

    if (error) {
      console.error('Error fetching sponsors:', error);
      return null;
    }

    if (!sponsors || sponsors.length === 0) {
      console.warn('No active sponsors available');
      return null;
    }

    // Calculate match score for each sponsor
    const scoredSponsors = sponsors.map(sponsor => ({
      sponsor,
      score: calculateMatchScore(application, sponsor)
    }));

    // Sort by score (highest first)
    scoredSponsors.sort((a, b) => b.score - a.score);

    // Get the best match
    const bestMatch = scoredSponsors[0];

    if (!bestMatch || bestMatch.score < 50) {
      console.warn('No suitable sponsor found (minimum score 50)');
      return null;
    }

    console.log('✅ Best sponsor match:', bestMatch.sponsor.sponsor_name, 'Score:', bestMatch.score);

    return {
      sponsorId: bestMatch.sponsor.id,
      sponsorName: bestMatch.sponsor.sponsor_name,
      matchScore: bestMatch.score,
      reason: generateMatchReason(bestMatch.score, application, bestMatch.sponsor),
      fundingAvailable: bestMatch.sponsor.funding_available,
      expertise: bestMatch.sponsor.expertise || []
    };
  } catch (error) {
    console.error('Error finding sponsor match:', error);
    return null;
  }
};

/**
 * Generate human-readable match reason
 */
const generateMatchReason = (score: number, application: FullLoanApplication, sponsor: any): string => {
  const reasons = [];
  
  if (sponsor.expertise?.includes(application.programInfo?.programName)) {
    reasons.push('field of study alignment');
  }
  
  if (sponsor.countries_supported?.includes(application.programInfo?.institution)) {
    reasons.push('destination country support');
  }
  
  const requestedAmount = parseFloat(application.loanTypeRequest?.amount || application.programInfo?.totalCost || '0');
  if (requestedAmount <= sponsor.max_funding_amount && requestedAmount >= sponsor.min_funding_amount) {
    reasons.push('funding amount match');
  }
  
  if (reasons.length === 0) {
    return 'General compatibility with sponsor criteria';
  }
  
  return `Strong match based on ${reasons.join(', ')}`;
};

/**
 * Creates a sponsor assignment record in the database
 */
export const assignSponsorToApplication = async (
  applicationId: string,
  userId: string,
  sponsorMatch: SponsorMatch
) => {
  try {
    console.log('💾 Assigning sponsor to application...');
    
    // Create sponsor assignment record
    const { data: assignment, error: assignmentError } = await supabase
      .from('sponsor_assignments')
      .insert({
        application_id: applicationId,
        sponsor_id: sponsorMatch.sponsorId,
        user_id: userId,
        assigned_by: null, // NULL indicates automatic assignment
        assignment_method: 'automatic',
        match_score: sponsorMatch.matchScore,
        assignment_reason: sponsorMatch.reason,
        status: 'pending_review'
      })
      .select()
      .single();

    if (assignmentError) {
      console.error('Error creating sponsor assignment:', assignmentError);
      throw assignmentError;
    }

    // Update loan application with sponsor info
    const { error: updateError } = await supabase
      .from('loan_applications')
      .update({
        sponsor_assignment_status: 'sponsor_assigned',
        assigned_sponsor_id: sponsorMatch.sponsorId,
        sponsor_assigned_at: new Date().toISOString()
      })
      .eq('id', applicationId);

    if (updateError) {
      console.error('Error updating loan application:', updateError);
    }

    // Decrease sponsor capacity
    await supabase.rpc('decrement_sponsor_capacity', { 
      sponsor_id: sponsorMatch.sponsorId 
    });

    // Create notification for user
    await supabase.from('notifications').insert({
      user_id: userId,
      type: 'sponsor_matched',
      title: 'Sponsor Matched!',
      message: `You've been matched with ${sponsorMatch.sponsorName}. They will review your application within 3-5 business days.`,
      data: {
        applicationId,
        sponsorId: sponsorMatch.sponsorId,
        sponsorName: sponsorMatch.sponsorName,
        matchScore: sponsorMatch.matchScore,
        reason: sponsorMatch.reason,
        assignmentId: assignment.id
      }
    });

    console.log('✅ Sponsor assignment complete:', assignment.id);

    return { success: true, sponsor: sponsorMatch, assignmentId: assignment.id };
  } catch (error) {
    console.error('Error assigning sponsor:', error);
    return { success: false, error };
  }
};

/**
 * Calculate matching score between applicant and sponsor
 */
const calculateMatchScore = (
  application: FullLoanApplication,
  sponsor: any
): number => {
  let score = 0;

  // Program/field match (30 points)
  if (sponsor.expertise?.includes(application.programInfo?.programName)) {
    score += 30;
  }

  // Institution/location match (25 points)
  if (sponsor.countries_supported?.includes(application.programInfo?.institution)) {
    score += 25;
  }

  // Funding amount within range (20 points)
  const requestedAmount = parseFloat(application.loanTypeRequest?.amount || application.programInfo?.totalCost || '0');
  if (requestedAmount <= sponsor.max_funding_amount && requestedAmount >= sponsor.min_funding_amount) {
    score += 20;
  }

  // Career goals alignment (15 points)
  if (sponsor.career_focus?.some((focus: string) => 
    application.loanTypeRequest?.purpose?.toLowerCase().includes(focus.toLowerCase())
  )) {
    score += 15;
  }

  // Sponsor availability (10 points)
  if (sponsor.current_capacity > 0) {
    score += 10;
  }

  return Math.min(score, 100);
};
