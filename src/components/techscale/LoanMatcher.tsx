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
    
    try {
      const matches = await matchLoansToUser(profile);
      setUserProfile(profile);
      setMatchedLoans(matches);
    } catch (error) {
      console.error('Error matching loans:', error);
      setMatchedLoans([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUserProfile(null);
    setMatchedLoans([]);
  };

  return (
    <section id="loan-matcher" className="w-full py-16 md:py-20 px-6 md:px-12 bg-background">
      <div className="max-w-6xl mx-auto">
        {!userProfile ? (
          <div className="space-y-8">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">
                Check Your Eligibility
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                Tell us about yourself. We'll match you with the right options.
              </p>
            </div>
            <UserIntakeForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-foreground">
                  Your Options
                </h2>
                <p className="text-muted-foreground text-base">
                  We found {matchedLoans.length} option{matchedLoans.length !== 1 ? 's' : ''} for you
                </p>
              </div>
              <button
                onClick={handleReset}
                className="text-primary hover:text-primary/80 text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors"
              >
                Start Over
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
