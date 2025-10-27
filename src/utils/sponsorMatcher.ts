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
    // For now, return a mock sponsor match
    // In production, this would query a sponsors table
    const mockSponsor: SponsorMatch = {
      sponsorId: 'sponsor-001',
      sponsorName: 'TechSkill UK Alumni Fund',
      matchScore: 85,
      reason: 'Strong match based on field of study and destination country',
      fundingAvailable: 15000,
      expertise: [
        application.programInfo?.programName || 'Technology',
        application.programInfo?.institution || 'International'
      ]
    };

    return mockSponsor;
  } catch (error) {
    console.error('Error finding sponsor match:', error);
    return null;
  }
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
    // Create notification for sponsor assignment
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
        reason: sponsorMatch.reason
      }
    });

    return { success: true, sponsor: sponsorMatch };
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
  if (sponsor.countriesSupported?.includes(application.programInfo?.institution)) {
    score += 25;
  }

  // Funding amount within range (20 points)
  const requestedAmount = parseFloat(application.loanTypeRequest?.amount || application.programInfo?.totalCost || '0');
  if (requestedAmount <= sponsor.maxFunding && requestedAmount >= sponsor.minFunding) {
    score += 20;
  }

  // Career goals alignment (15 points)
  if (sponsor.careerFocus?.some((focus: string) => 
    application.loanTypeRequest?.purpose?.toLowerCase().includes(focus.toLowerCase())
  )) {
    score += 15;
  }

  // Sponsor availability (10 points)
  if (sponsor.currentCapacity > 0) {
    score += 10;
  }

  return Math.min(score, 100);
};
