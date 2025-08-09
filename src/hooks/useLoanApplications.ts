
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LoanOption, UserProfile } from '@/types/techscale';
import { useToast } from '@/hooks/use-toast';

export const useLoanApplications = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submitApplication = async (
    loanOption: LoanOption,
    userProfile: UserProfile,
    userId: string
  ) => {
    setLoading(true);
    
    try {
      const applicationData = {
        userProfile,
        loanDetails: {
          aprRange: loanOption.aprRange,
          maxAmount: loanOption.maxAmount,
          repaymentTerm: loanOption.repaymentTerm,
          features: loanOption.features
        },
        appliedAt: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('loan_applications')
        .insert({
          user_id: userId,
          loan_option_id: loanOption.id,
          lender_name: loanOption.lenderName,
          application_data: applicationData,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: `Your application to ${loanOption.lenderName} has been submitted successfully.`,
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Application Failed",
        description: error.message || "Failed to submit your application. Please try again.",
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const getUserApplications = async (userId: string) => {
    const { data, error } = await supabase
      .from('loan_applications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return { data, error };
  };

  return {
    submitApplication,
    getUserApplications,
    loading
  };
};
