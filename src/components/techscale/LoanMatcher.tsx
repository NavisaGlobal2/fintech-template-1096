
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
    <section id="loan-matcher" className="w-full py-20 px-6 md:px-12 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {!userProfile ? (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
                Find Your Perfect Loan Match
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Tell us about your education goals and financial situation to get personalized loan recommendations
              </p>
            </div>
            <UserIntakeForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-medium tracking-tighter text-foreground">
                  Your Loan Recommendations
                </h2>
                <p className="text-muted-foreground">
                  Based on your profile, we found {matchedLoans.length} matching options
                </p>
              </div>
              <button
                onClick={handleReset}
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                Start Over →
              </button>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
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
