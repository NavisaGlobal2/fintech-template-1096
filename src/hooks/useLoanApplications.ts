
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
      // Convert the application data to a JSON-serializable format
      const applicationData = {
        userProfile: JSON.parse(JSON.stringify(userProfile)),
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
          application_data: applicationData as any, // Cast to any to satisfy JSON type
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
      console.error('Application submission error:', error);
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
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      return { data: null, error };
    }
  };

  return {
    submitApplication,
    getUserApplications,
    loading
  };
};
