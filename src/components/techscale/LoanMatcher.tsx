
import React, { useState } from 'react';
import UserIntakeForm from './UserIntakeForm';
import LoanResults from './LoanResults';
import CreditReadinessScore from './CreditReadinessScore';
import { UserProfile, LoanOption } from '@/types/techscale';
import { matchLoansToUser } from '@/utils/loanMatcher';

const LoanMatcher = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [matchedLoans, setMatchedLoans] = useState<LoanOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (profile: UserProfile) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const matches = matchLoansToUser(profile);
    setUserProfile(profile);
    setMatchedLoans(matches);
    setIsLoading(false);
  };

  const handleReset = () => {
    setUserProfile(null);
    setMatchedLoans([]);
  };

  return (
    <section id="loan-matcher" className="w-full py-12 md:py-20 px-4 sm:px-6 md:px-12 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {!userProfile ? (
          <div className="space-y-6 md:space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
                Check Your Eligibility
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Tell us about your education goals and financial situation to get personalized financing recommendations
              </p>
            </div>
            <UserIntakeForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </div>
        ) : (
          <div className="space-y-6 md:space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tighter text-foreground">
                  Your Financing Options
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Based on your profile, we found {matchedLoans.length} matching options
                </p>
              </div>
              <button
                onClick={handleReset}
                className="text-primary hover:text-primary/80 text-sm font-medium min-h-[44px] px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors"
              >
                Start Over →
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="lg:col-span-2">
                <LoanResults loans={matchedLoans} userProfile={userProfile} />
              </div>
              <div className="lg:col-span-1">
                <CreditReadinessScore userProfile={userProfile} />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LoanMatcher;
